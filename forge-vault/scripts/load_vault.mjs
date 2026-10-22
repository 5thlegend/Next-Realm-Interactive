#!/usr/bin/env node
// Push the built catalog into a Forge Vault Worker.
//
//   VAULT_URL=https://forge-vault.<you>.workers.dev ADMIN_TOKEN=... node scripts/load_vault.mjs [--seed] [--enqueue]
//
// --seed     upsert projects, folders and asset records into D1 (search + dashboard)
// --enqueue  queue every file for copying from Higgsfield into R2 (already-copied files are skipped)
// With neither flag, both run. Safe to re-run: every write is an upsert.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "catalog");
const args = new Set(process.argv.slice(2));
const opt = (name, dflt) => Number((process.argv.find((a) => a.startsWith(`--${name}=`)) || "").split("=")[1]) || dflt;
const doSeed = args.has("--seed") || !args.has("--enqueue");
const doEnqueue = args.has("--enqueue") || !args.has("--seed");
const BATCH = opt("batch", 10); // assets per request; ~5 D1 statements each
const CONCURRENCY = opt("concurrency", 4);

const { VAULT_URL, ADMIN_TOKEN } = process.env;
if (!VAULT_URL || !ADMIN_TOKEN) {
  console.error("Set VAULT_URL and ADMIN_TOKEN.");
  process.exit(1);
}

const jsonl = (path) => readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

async function post(route, body, attempt = 1) {
  const r = await fetch(new URL(`/admin/${route}`, VAULT_URL), {
    method: "POST",
    headers: { authorization: `Bearer ${ADMIN_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (r.ok) return r.json();
  const text = await r.text();
  if (attempt < 4 && (r.status >= 500 || r.status === 429)) {
    await new Promise((res) => setTimeout(res, 1000 * 2 ** attempt));
    return post(route, body, attempt + 1);
  }
  throw new Error(`${route} ${r.status}: ${text.slice(0, 300)}`);
}

async function inBatches(items, size, fn, label) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  let done = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (chunks.length) {
      const chunk = chunks.shift();
      await fn(chunk);
      done += chunk.length;
      if (done % (size * 20) < size || done === items.length) process.stdout.write(`\r${label}: ${done}/${items.length}`);
    }
  });
  await Promise.all(workers);
  process.stdout.write("\n");
}

if (doSeed) {
  const tree = JSON.parse(readFileSync(join(ROOT, "out/projects.json"), "utf8"));
  const rawFolders = Object.fromEntries(jsonl(join(ROOT, "raw/projects/folders.jsonl")).map((f) => [f.folder_id, f]));
  const projects = tree.map((p) => ({ id: p.project_id, name: p.name, path: p.path }));
  const folders = tree.flatMap((p) => p.folders.map((f) => ({
    id: f.folder_id, project_id: p.project_id, parent_id: rawFolders[f.folder_id]?.parent_folder_id || null, name: f.name, path: f.path,
  })));
  await post("seed", { projects, folders });
  console.log(`projects: ${projects.length}, folders: ${folders.length}`);

  const assets = jsonl(join(ROOT, "out/assets.jsonl"));
  const refCount = {};
  for (const a of assets) for (const id of new Set(a.refs.map((r) => r.id).filter(Boolean))) refCount[id] = (refCount[id] || 0) + 1;
  const rows = assets.map((a) => ({
    id: a.id,
    source: a.source,
    kind: a.kind,
    model: a.model,
    created_at: a.created_at,
    liked: a.liked,
    prompt: a.prompt,
    enhanced_prompt: a.enhanced_prompt,
    params: a.params,
    refs: a.refs,
    placements: a.placements,
    project_id: a.placements[0]?.project_id || null,
    folder_id: a.placements[0]?.folder_id || null,
    vault_folder: a.folder,
    asset_key: a.files.asset.key,
    asset_src: a.files.asset.url,
    preview_key: a.files.preview?.key || null,
    preview_src: a.files.preview?.url || null,
    ref_count: refCount[a.id] || 0,
  }));
  await inBatches(rows, BATCH, (chunk) => post("seed", { assets: chunk }), "assets");
}

if (doEnqueue) {
  const jobs = jsonl(join(ROOT, "out/ingest.jsonl"));
  let queued = 0, skipped = 0;
  await inBatches(jobs, 100, async (chunk) => {
    const r = await post("enqueue", { jobs: chunk });
    queued += r.queued;
    skipped += r.skipped;
  }, "files");
  console.log(`queued ${queued}, already archived ${skipped}`);
}
