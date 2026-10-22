# Forge Vault

A private, permanent archive of every Higgsfield asset: images, video, audio and 3D, each
stored with the prompt, model, settings and reference media that produced it.

```
Higgsfield ──(read-only MCP export)──▶ catalog/raw ──build_catalog.py──▶ catalog/out
                                                                            │ load_vault.mjs
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

## Stage 2 — Vault Worker + dashboard (`worker/`)

One Worker does everything:

| Route | What it does |
|---|---|
| `/` | Dashboard: search prompts, filter by type/model/project/collection, infinite grid, detail view |
| `/api/*` | Stats, projects, models, asset list (cursor-paged), asset detail with refs + lineage |
| `/api/assets/:id/prompt.txt`, `/meta.json` | Prompt and full metadata as downloads |
| `/file/<vault key>` | Streams from R2 (range requests for video). Not copied yet → redirects to the Higgsfield original |
| `/zip?<filters>` | Streams a ZIP of the current view: files, `prompt.txt`, `meta.json`, references (300 assets max) |
| `/admin/*` | Bearer-token loader endpoints: `seed`, `enqueue`, `status`, `requeue-errors` |
| queue consumer | Copies each file Higgsfield → R2, then writes `prompt.txt` + `meta.json` beside the asset |

Storage: **R2** holds the files (the archive itself). **D1** holds the search index, projects and
copy-job status. The dashboard works from the moment D1 is seeded; thumbnails switch from
Higgsfield links to vault copies as the queue drains.

Access: everything except `/login` and `/admin/*` requires the vault password (HMAC session
cookie, 30 days). For a team, also put the workers.dev hostname behind **Cloudflare Access**
(Zero Trust → Access → Applications), free up to 50 users.

### Deploy

Requires a Cloudflare API token with Workers Scripts, R2, D1 and Queues edit rights
(`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). Queues need the Workers Paid plan ($5/mo).

```bash
cd forge-vault/worker
npm install
npx wrangler r2 bucket create forge-vault
npx wrangler d1 create forge-vault          # paste the printed database_id into wrangler.toml
npx wrangler queues create forge-vault-ingest
npm run migrate:remote
npx wrangler secret put VAULT_PASSWORD
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy                          # prints https://forge-vault.<subdomain>.workers.dev

cd ..
VAULT_URL=https://forge-vault.<subdomain>.workers.dev ADMIN_TOKEN=... node scripts/load_vault.mjs --seed
VAULT_URL=... ADMIN_TOKEN=... node scripts/load_vault.mjs --enqueue
curl -H "authorization: Bearer $ADMIN_TOKEN" $VAULT_URL/admin/status
```

Both loader steps are idempotent. Re-export from Higgsfield, rebuild the catalog and re-run
them to sync new work; files already in R2 are skipped.

### Local development

```bash
cd forge-vault/worker
printf 'VAULT_PASSWORD=local-test\nADMIN_TOKEN=local-admin\n' > .dev.vars
npm run migrate:local
npx wrangler dev
VAULT_URL=http://127.0.0.1:8787 ADMIN_TOKEN=local-admin node ../scripts/load_vault.mjs --seed
```
