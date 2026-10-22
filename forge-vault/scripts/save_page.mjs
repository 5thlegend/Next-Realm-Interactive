#!/usr/bin/env node
// Save one Higgsfield MCP listing page into catalog/raw and report where to continue.
//
//   node scripts/save_page.mjs <page.json> <raw subdir> <name pattern> [--min-ts=<epoch>] [--known=<ids file>]
//
//   <page.json>     a {items, next_cursor} response (the tool-result file Claude Code saves for large pages)
//   <raw subdir>    e.g. history, marketing, uploads, byid
//   <name pattern>  file name with {n} for the next free page number, e.g. "page-w1-{n}" or "image-page-{n}"
//   --min-ts        drop items older than this epoch (window boundary for parallel exports)
//   --known         a file of ids already in the catalog: stop once a page reaches them (incremental sync)
//
// Prints {saved, kept, next_cursor, oldest, done}. Keep paging while done is false.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [src, sub, pattern, ...flags] = process.argv.slice(2);
if (!src || !sub || !pattern?.includes("{n}")) {
  console.error("usage: save_page.mjs <page.json> <raw subdir> <name pattern with {n}> [--min-ts=N] [--known=file]");
  process.exit(2);
}
const opt = Object.fromEntries(flags.map((f) => f.replace(/^--/, "").split("=")));

const page = JSON.parse(fs.readFileSync(src, "utf8"));
if (!Array.isArray(page.items)) throw new Error("not a listing page: no items[]");
const created = (it) => Number(it.createdAt ?? it.created_at ?? 0);

let items = page.items;
let done = page.next_cursor == null || items.length === 0;
if (opt["min-ts"]) {
  const min = Number(opt["min-ts"]);
  const before = items.length;
  items = items.filter((it) => created(it) >= min);
  if (items.length < before) done = true;
}
if (opt.known && fs.existsSync(opt.known)) {
  const known = new Set(fs.readFileSync(opt.known, "utf8").split(/\s+/).filter(Boolean));
  const fresh = items.filter((it) => !known.has(it.id));
  if (fresh.length < items.length) done = true;
  items = fresh;
}

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "catalog", "raw", sub);
fs.mkdirSync(dir, { recursive: true });
let saved = null;
if (items.length) {
  let n = 1;
  const name = () => pattern.replace("{n}", String(n).padStart(3, "0")) + ".json";
  while (fs.existsSync(path.join(dir, name()))) n++;
  saved = path.join(sub, name());
  fs.writeFileSync(path.join(dir, name()), JSON.stringify({ items, next_cursor: page.next_cursor }));
}

const ts = page.items.map(created).filter(Boolean);
console.log(JSON.stringify({
  saved,
  kept: items.length,
  next_cursor: page.next_cursor,
  oldest: ts.length ? new Date(Math.min(...ts) * 1000).toISOString() : null,
  done,
}));
