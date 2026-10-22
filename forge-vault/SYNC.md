# Forge Vault daily sync (runbook for the scheduled Claude task)

New Higgsfield work only reaches the vault through a Claude session, since the Higgsfield
connector is the only way to read the account. This runbook pulls what is new since the last
run, rebuilds the catalog, and pushes it to the vault. The Worker's queue then copies the new files
into R2.

**Read-only.** Use only the listing tools named here. Never call a `generate_*`, upscale, edit,
move or create tool. Listing costs no credits.

All commands run from `forge-vault/`. `catalog/` is gitignored, and nothing in it is ever committed.
The workspace is `90b7978b-f180-470d-a5e9-498461d95a7e`.

## 1. Snapshot what is already archived

```
node scripts/sync.mjs known
```

This writes `catalog/state/known-*.txt`.

## 2. Pull new pages

For each stream, start with no cursor (newest first) and page until the helper prints
`"done": true`. Every call uses `size: 100`. Large pages are saved to a file automatically:
pass that path to the helper and don't read the file. If a page comes back inline, write the JSON
object verbatim to a scratch file first. A day's new work is usually one or two pages per stream.

| Stream | Tool call | Save with |
|---|---|---|
| Generations | `show_generations {size:100, cursor}` | `node scripts/save_page.mjs <file> history "page-s{date}-{n}" --known=catalog/state/known-history.txt` |
| Marketing Studio | `show_marketing_studio_generations {size:100, cursor}` | `node scripts/save_page.mjs <file> marketing "page-s{date}-{n}" --known=catalog/state/known-marketing.txt` |
| Image uploads | `show_medias {type:"image", size:100, cursor}` | `node scripts/save_page.mjs <file> uploads "image-page-s{date}-{n}" --known=catalog/state/known-uploads-image.txt` |
| Video uploads | `show_medias {type:"video", ...}` | same, with `video-page-…` and `known-uploads-video.txt` |
| Audio uploads | `show_medias {type:"audio", ...}` | same, with `audio-page-…` and `known-uploads-audio.txt` |

Replace `{date}` with today's date as `YYYYMMDD`, and leave `{n}` literally as written.

## 3. Pull new projects, folders and placements

1. Page `list_projects {workspace_id, size:50}` to the end. Append any project that is not yet in
   `catalog/raw/projects/projects.jsonl`, as
   `{"project_id","name","default_folder_id","workspace_id"}`.
2. For new projects, walk the folders with `list_folders` and append them to `folders.jsonl` as
   `{"folder_id","name","parent_folder_id","project_id"}`. A top-level folder's parent is the
   project's `default_folder_id`.
3. For every project, call
   `list_project_assets {workspace_id, project_id, size:50, order_by:"added_at", ordering:"desc"}`.
   Stop paging a project as soon as a page contains a `placement_id` that is in
   `catalog/state/known-placements.txt`. Append each new placement to
   `catalog/raw/projects/placements-sync.jsonl` as
   `{"item_id","project_id","folder_id","placement_id","added_at","status","source_type"}`.

## 4. Publish

```
node scripts/sync.mjs publish
```

This rebuilds `catalog/out`, upserts into D1 and queues only the files not yet in R2. Check that
the printed summary shows `"duplicate_asset_ids": 0`. If `placements_without_asset` is above 0,
those jobs sit in projects but are missing from the history listing. Fetch them by id with
`show_generation_by_ids`, save them under `catalog/raw/byid/`, and publish again.

## 5. Report

```
curl -s -H "authorization: Bearer $(cat worker/.admin-token)" https://forge-vault.dankpenta.workers.dev/admin/status
```

Report the number of new assets, the number of files queued, and any `error` counts. If errors
look transient, POST to `/admin/requeue-errors` with the same header.
