#!/usr/bin/env python3
"""Build the Forge Vault catalog from raw Higgsfield exports.

Reads   catalog/raw/{history,marketing,uploads,projects}/
Writes  catalog/out/assets.jsonl    one record per generated or uploaded asset
        catalog/out/ingest.jsonl    one copy job per file: {key, url, asset_id, role}
        catalog/out/projects.json   project -> folder tree with vault paths
        catalog/out/summary.json    counts and integrity checks

Vault layout (R2 keys):
  <project>/<folder>/.../<YYYY-MM-DD>_<model>_<id8>/{asset.<ext>, preview.webp, prompt.txt, meta.json}
  _unsorted/<YYYY-MM>/<YYYY-MM-DD>_<model>_<id8>/...      generations not placed in any project
  _marketing-studio/<YYYY-MM>/...                         unplaced Marketing Studio output
  _uploads/<image|video|audio>/<YYYY-MM>/<id>.<ext>       uploaded files (references live here once)
  _refs/<id>.<ext>                                        your media used as a reference but no longer in the library

References are stored once and linked from each asset's meta.json by vault key,
so a reference used by 200 generations is copied once, not 200 times.
"""
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "catalog"
RAW = ROOT / "raw"
OUT = ROOT / "out"

UUID = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")


def load_pages(pattern):
    items = []
    for p in sorted(RAW.glob(pattern)):
        items.extend(json.loads(p.read_text())["items"])
    return items


def load_jsonl(path):
    if not path.exists():
        return []
    return [json.loads(l) for l in path.read_text().splitlines() if l.strip()]


def slug(s, fallback="untitled"):
    s = re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")
    return s[:60] or fallback


def ts(value):
    """Epoch float or ISO string -> aware datetime."""
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(value, tz=timezone.utc)
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def ext_of(url, default="bin"):
    m = re.search(r"\.([A-Za-z0-9]+)(?:\?|$)", url or "")
    return m.group(1).lower() if m else default


def is_user_media(ref):
    """True for the account's own uploads and generations; false for Higgsfield UI presets
    (camera bodies, lenses, motion/style thumbnails), which stay in params but aren't copied."""
    t = ref.get("type") or ""
    return t.endswith("_input") or t.endswith("_job") or "/user_" in (ref.get("url") or "")


def find_refs(obj, role=None, out=None):
    """Walk params and collect every {id, url} media object with its role."""
    if out is None:
        out = []
    if isinstance(obj, dict):
        if "data" in obj and isinstance(obj["data"], dict) and obj["data"].get("url"):
            d = obj["data"]
            out.append({"role": obj.get("role") or role, "id": d.get("id"), "type": d.get("type"), "url": d["url"]})
            return out
        if obj.get("url") and obj.get("id"):
            out.append({"role": role, "id": obj["id"], "type": obj.get("type"), "url": obj["url"]})
            return out
        for k, v in obj.items():
            # Keep the top-level param name (model_image, products, medias...) as the role.
            find_refs(v, role or k, out)
    elif isinstance(obj, list):
        for v in obj:
            find_refs(v, role, out)
    return out


def main():
    # byid/ holds completed jobs that sit in projects but that the history listing doesn't
    # return (e.g. nano_banana_2_1), fetched one by one with show_generation_by_ids.
    history = load_pages("history/page-*.json")
    seen = {g["id"] for g in history}
    history += [g for g in load_pages("byid/page-*.json") if g["id"] not in seen]
    marketing = load_pages("marketing/page-*.json")
    uploads = []
    for kind in ("image", "video", "audio"):
        for u in load_pages(f"uploads/{kind}-page-*.json"):
            u["_kind"] = kind
            uploads.append(u)

    projects = {p["project_id"]: p for p in load_jsonl(RAW / "projects/projects.jsonl")}
    folders = {f["folder_id"]: f for f in load_jsonl(RAW / "projects/folders.jsonl")}
    placements = load_jsonl(RAW / "projects/placements.jsonl")

    # Folder id -> vault path ("skunk-inc-videos/koi-video").
    def folder_path(folder_id, project_id):
        parts, seen = [], set()
        fid = folder_id
        while fid and fid in folders and fid not in seen:
            seen.add(fid)
            parts.append(slug(folders[fid]["name"]))
            fid = folders[fid]["parent_folder_id"]
        proj = projects.get(project_id, {})
        # Project names repeat ("New project"); suffix with id8 to keep paths unique.
        name = slug(proj.get("name"), "project")
        parts.append(f"{name}-{project_id[:8]}" if name in dup_names else name)
        return "/".join(reversed(parts))

    name_counts = {}
    for p in projects.values():
        n = slug(p["name"], "project")
        name_counts[n] = name_counts.get(n, 0) + 1
    dup_names = {n for n, c in name_counts.items() if c > 1}

    by_item = {}
    for pl in sorted(placements, key=lambda p: p.get("added_at") or ""):
        by_item.setdefault(pl["item_id"], []).append(pl)

    upload_key = {}
    for u in uploads:
        d = ts(u["created_at"])
        upload_key[u["id"]] = f"_uploads/{u['_kind']}/{d:%Y-%m}/{u['id']}.{ext_of(u['url'])}"

    assets, ingest, problems = [], [], []
    gen_key = {}

    def place(item_id, fallback_root, created):
        pls = by_item.get(item_id, [])
        if pls:
            primary = pls[0]
            base = folder_path(primary["folder_id"], primary["project_id"])
        else:
            base = f"{fallback_root}/{created:%Y-%m}"
        return base, pls

    for source, items in (("generation", history), ("marketing", marketing)):
        for g in items:
            created = ts(g["createdAt"])
            base, pls = place(g["id"], "_unsorted" if source == "generation" else "_marketing-studio", created)
            folder = f"{base}/{created:%Y-%m-%d}_{slug(g.get('model'), 'model')}_{g['id'][:8]}"
            gen_key[g["id"]] = folder
            res = g.get("results") or {}
            files = {}
            if res.get("rawUrl"):
                files["asset"] = {"key": f"{folder}/asset.{ext_of(res['rawUrl'])}", "url": res["rawUrl"]}
            else:
                problems.append({"id": g["id"], "problem": "no rawUrl"})
            if res.get("minUrl"):
                files["preview"] = {"key": f"{folder}/preview.{ext_of(res['minUrl'], 'webp')}", "url": res["minUrl"]}
            if res.get("waveformUrl"):
                files["waveform"] = {"key": f"{folder}/waveform.{ext_of(res['waveformUrl'], 'json')}", "url": res["waveformUrl"]}
            params = g.get("params") or {}
            assets.append({
                "id": g["id"],
                "source": source,
                "kind": g.get("type"),
                "model": g.get("model"),
                "created_at": created.isoformat(),
                "liked": bool(g.get("liked")),
                "prompt": params.get("prompt") or "",
                "enhanced_prompt": params.get("enhanced_prompt") or "",
                "params": params,
                "folder": folder,
                "files": files,
                "refs": [r for r in find_refs(params) if is_user_media(r)],
                "placements": [{k: pl[k] for k in ("project_id", "folder_id", "placement_id")} for pl in pls],
            })

    for u in uploads:
        created = ts(u["created_at"])
        key = upload_key[u["id"]]
        assets.append({
            "id": u["id"],
            "source": "upload",
            "kind": u["_kind"],
            "model": None,
            "created_at": created.isoformat(),
            "liked": False,
            "prompt": "",
            "enhanced_prompt": "",
            "params": {},
            "folder": key.rsplit("/", 1)[0],
            "files": {"asset": {"key": key, "url": u["url"]}},
            "refs": [],
            "placements": [{k: pl[k] for k in ("project_id", "folder_id", "placement_id")} for pl in by_item.get(u["id"], [])],
        })

    # Resolve each reference to the vault key where its file lives.
    known_urls = {}
    for a in assets:
        for f in a["files"].values():
            known_urls[f["url"]] = f["key"]
    orphan_refs = {}
    for a in assets:
        for r in a["refs"]:
            if r["id"] in upload_key:
                r["vault_key"] = upload_key[r["id"]]
            elif r["url"] in known_urls:
                r["vault_key"] = known_urls[r["url"]]
            elif r["id"] in gen_key:
                r["vault_key"] = f"{gen_key[r['id']]}/asset.{ext_of(r['url'])}"
            else:
                # A reference we have no record of (deleted upload, other account's job): copy it on its own.
                m = UUID.search(r["url"])
                rid = r["id"] or (m.group(0) if m else slug(r["url"][-40:]))
                k = f"_refs/{rid}.{ext_of(r['url'])}"
                r["vault_key"] = k
                orphan_refs[k] = r["url"]

    for a in assets:
        for role, f in a["files"].items():
            ingest.append({"key": f["key"], "url": f["url"], "asset_id": a["id"], "role": role})
    for k, url in orphan_refs.items():
        ingest.append({"key": k, "url": url, "asset_id": None, "role": "external_ref"})

    # Dedupe ingest by key (an upload placed in two projects still has one file).
    seen, deduped = set(), []
    for j in ingest:
        if j["key"] not in seen:
            seen.add(j["key"])
            deduped.append(j)

    ids = [a["id"] for a in assets]
    # Failed and moderated jobs (failed, nsfw, ip_detected) have no output file to archive.
    placed_ids = {p["item_id"] for p in placements if p.get("status", "completed") == "completed"}
    summary = {
        "built_at": datetime.now(timezone.utc).isoformat(),
        "assets": len(assets),
        "by_source": {s: sum(a["source"] == s for a in assets) for s in ("generation", "marketing", "upload")},
        "by_kind": {k: sum(a["kind"] == k for a in assets) for k in sorted({a["kind"] for a in assets})},
        "with_prompt": sum(bool(a["prompt"]) for a in assets if a["source"] != "upload"),
        "liked": sum(a["liked"] for a in assets),
        "placed_in_project": sum(bool(a["placements"]) for a in assets),
        "projects": len(projects),
        "folders": len(folders),
        "ref_links": sum(len(a["refs"]) for a in assets),
        "external_refs": len(orphan_refs),
        "files_to_copy": len(deduped),
        "duplicate_asset_ids": len(ids) - len(set(ids)),
        "placements_without_asset": len(placed_ids - set(ids)),
        "problems": problems,
    }

    tree = []
    for pid, p in sorted(projects.items(), key=lambda kv: kv[1]["name"].lower()):
        tree.append({
            "project_id": pid,
            "name": p["name"],
            "path": folder_path(pid, pid),
            "folders": [
                {"folder_id": f["folder_id"], "name": f["name"], "path": folder_path(f["folder_id"], pid)}
                for f in folders.values() if f["project_id"] == pid
            ],
            "asset_count": sum(1 for a in assets for pl in a["placements"] if pl["project_id"] == pid),
        })

    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / "assets.jsonl", "w") as fh:
        for a in assets:
            fh.write(json.dumps(a, ensure_ascii=False) + "\n")
    with open(OUT / "ingest.jsonl", "w") as fh:
        for j in deduped:
            fh.write(json.dumps(j) + "\n")
    (OUT / "projects.json").write_text(json.dumps(tree, indent=2, ensure_ascii=False))
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2))
    json.dump(summary, sys.stdout, indent=2)
    print()


if __name__ == "__main__":
    main()
