#!/usr/bin/env node
// Helpers for the incremental Forge Vault sync (see SYNC.md).
//
//   node scripts/sync.mjs known     write catalog/state/known-*.txt: ids already in catalog/raw,
//                                   used by save_page.mjs --known to stop paging at old work
//   node scripts/sync.mjs publish   rebuild the catalog and push it to the vault (seed + enqueue)
//
// publish reads the admin token from worker/.admin-token (gitignored) and the vault URL from
// VAULT_URL, defaulting to the deployed Worker.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const RAW = path.join(ROOT, "catalog", "raw");
const STATE = path.join(ROOT, "catalog", "state");
const DEFAULT_URL = "https://forge-vault.dankpenta.workers.dev";

const pageItems = (dir, re) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => re.test(f)).flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).items)
    : [];
const jsonl = (file) => fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

function known() {
  fs.mkdirSync(STATE, { recursive: true });
  const sets = {
    history: [...pageItems(path.join(RAW, "history"), /^page-.*\.json$/), ...pageItems(path.join(RAW, "byid"), /^page-.*\.json$/)],
    marketing: pageItems(path.join(RAW, "marketing"), /^page-.*\.json$/),
    "uploads-image": pageItems(path.join(RAW, "uploads"), /^image-page-.*\.json$/),
    "uploads-video": pageItems(path.join(RAW, "uploads"), /^video-page-.*\.json$/),
    "uploads-audio": pageItems(path.join(RAW, "uploads"), /^audio-page-.*\.json$/),
  };
  const projDir = path.join(RAW, "projects");
  const placements = fs.existsSync(projDir)
    ? fs.readdirSync(projDir).filter((f) => /^placements.*\.jsonl$/.test(f)).flatMap((f) => jsonl(path.join(projDir, f)))
    : [];
  const out = {};
  for (const [name, items] of Object.entries(sets)) {
    const ids = [...new Set(items.map((i) => i.id))];
    fs.writeFileSync(path.join(STATE, `known-${name}.txt`), ids.join("\n"));
    out[name] = ids.length;
  }
  fs.writeFileSync(path.join(STATE, "known-placements.txt"), [...new Set(placements.map((p) => p.placement_id))].join("\n"));
  out.placements = placements.length;
  console.log(JSON.stringify(out));
}

function publish() {
  const tokenFile = path.join(ROOT, "worker", ".admin-token");
  if (!fs.existsSync(tokenFile)) throw new Error(`missing ${tokenFile}`);
  const env = {
    ...process.env,
    VAULT_URL: process.env.VAULT_URL || DEFAULT_URL,
    ADMIN_TOKEN: fs.readFileSync(tokenFile, "utf8").trim(),
    PYTHONUTF8: "1",
  };
  const python = process.platform === "win32" ? "python" : "python3";
  execFileSync(python, [path.join(HERE, "build_catalog.py")], { stdio: "inherit", env });
  execFileSync(process.execPath, [path.join(HERE, "load_vault.mjs")], { stdio: "inherit", env });
}

const cmd = process.argv[2];
if (cmd === "known") known();
else if (cmd === "publish") publish();
else {
  console.error("usage: sync.mjs known|publish");
  process.exit(2);
}
