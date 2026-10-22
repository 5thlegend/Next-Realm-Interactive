# Forge Vault

A private, permanent archive of every Higgsfield asset: images, video, audio and 3D, each
stored with the prompt, model, settings and reference media that produced it.

```
Higgsfield ──(read-only MCP export)──▶ catalog/raw ──build_catalog.py──▶ catalog/out
                                                                            │
                                     Cloudflare Worker + Queue ◀────────────┘
                                         │  copies each file edge-side
                                         ▼
                                   R2 (files) + D1 (search index) ──▶ workers.dev gallery
```

## Stage 1 — Catalog (this directory)

`catalog/` is **gitignored**. It contains full prompts and unsigned CDN links to
unreleased creative, and this repository is public.

| Path | Contents |
|---|---|
| `catalog/raw/history/page-NNN.json` | Generation history, verbatim, 100 per page |
| `catalog/raw/marketing/page-NNN.json` | Marketing Studio history, verbatim |
| `catalog/raw/uploads/<type>-page-NNN.json` | Uploaded images, video, audio |
| `catalog/raw/projects/*.jsonl` | Projects, folder tree, and asset placements |
| `catalog/out/assets.jsonl` | One normalized record per asset (prompt, params, refs, vault path) |
| `catalog/out/ingest.jsonl` | One copy job per file: `{key, url, asset_id, role}` |
| `catalog/out/projects.json` | Project → folder tree with vault paths |
| `catalog/out/summary.json` | Counts and integrity checks |

Rebuild after re-exporting:

```bash
python3 scripts/build_catalog.py
```

### Vault layout

```
<project>/<folder>/<YYYY-MM-DD>_<model>_<id8>/
    asset.<png|mp4|wav|glb…>
    preview.webp
    prompt.txt
    meta.json            model, settings, refs (by vault key), placements, source ids
_unsorted/<YYYY-MM>/…    generations not placed in a project
_marketing-studio/<YYYY-MM>/…
_uploads/<image|video|audio>/<YYYY-MM>/<id>.<ext>
_refs/<id>.<ext>         your media used as a reference but no longer listed in the library
```

References are stored once and linked from each asset's `meta.json`, so a reference
used by 200 generations is copied once. Higgsfield UI presets (camera bodies, lenses,
motion/style thumbnails) are kept in `params` but not copied.

An asset placed in several projects lives under its earliest placement; `meta.json`
lists every placement.

## Stage 2 — Ingest + gallery (next)

Needs a Cloudflare API token (Workers, R2, D1 edit) as `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`, and `api.cloudflare.com` allowed in the session's network policy.
