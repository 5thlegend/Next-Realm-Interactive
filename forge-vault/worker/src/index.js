// Forge Vault — private archive of Higgsfield assets.
//   fetch: login-gated dashboard, JSON API, file + ZIP downloads, admin loader endpoints
//   queue: copies each file from Higgsfield's CDN into R2 and writes prompt.txt / meta.json beside it
import { downloadZip } from "client-zip";

const enc = new TextEncoder();
const PAGE = 60;
const KINDS = new Set(["image", "video", "audio", "3d"]);
const SOURCES = new Set(["generation", "marketing", "upload"]);
const MIME = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
  mp3: "audio/mpeg", wav: "audio/wav", m4a: "audio/mp4", ogg: "audio/ogg",
  glb: "model/gltf-binary", json: "application/json", txt: "text/plain; charset=utf-8",
};
const mimeOf = (key) => MIME[key.split(".").pop().toLowerCase()] || "application/octet-stream";
const now = () => new Date().toISOString();

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p.startsWith("/admin/")) return await admin(req, env, url);
      if (p === "/login") return await login(req, env);
      if (!(await authed(req, env))) {
        return p.startsWith("/api/") || p.startsWith("/file/") || p === "/zip"
          ? json({ error: "unauthorized" }, 401)
          : loginPage(env, url.searchParams.has("e"));
      }
      if (p === "/logout") return logout();
      if (p.startsWith("/api/")) return await api(req, env, url);
      if (p.startsWith("/file/")) return await file(req, env, url);
      if (p === "/zip") return await zip(env, url);
      return env.ASSETS.fetch(req);
    } catch (err) {
      console.error(err);
      return json({ error: String(err?.message || err) }, 500);
    }
  },

  async queue(batch, env) {
    for (const msg of batch.messages) {
      const job = msg.body;
      try {
        let bytes = (await env.VAULT.head(job.key))?.size;
        if (bytes == null) {
          const r = await fetch(job.url);
          if (!r.ok) throw new Error(`source HTTP ${r.status}`);
          const len = Number(r.headers.get("content-length"));
          // R2 needs a known length for streamed bodies.
          const body = len > 0 ? r.body.pipeThrough(new FixedLengthStream(len)) : await r.arrayBuffer();
          const put = await env.VAULT.put(job.key, body, {
            httpMetadata: { contentType: r.headers.get("content-type") || mimeOf(job.key) },
            customMetadata: { source_url: job.url, asset_id: job.asset_id || "" },
          });
          bytes = put.size;
        }
        if (job.role === "asset" && job.asset_id) await writeSidecars(env, job.asset_id);
        await env.DB.prepare("UPDATE files SET status='done', bytes=?, error=NULL, updated_at=? WHERE key=?")
          .bind(bytes, now(), job.key).run();
        msg.ack();
      } catch (err) {
        if (msg.attempts >= 5) {
          await env.DB.prepare("UPDATE files SET status='error', error=?, updated_at=? WHERE key=?")
            .bind(String(err?.message || err).slice(0, 500), now(), job.key).run();
          msg.ack();
        } else {
          msg.retry({ delaySeconds: 30 * msg.attempts });
        }
      }
    }
  },
};

// ---------- auth ----------

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sessionToken(env) {
  const key = await crypto.subtle.importKey("raw", enc.encode(env.VAULT_PASSWORD), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode("forge-vault-session-v1")));
}

function cookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

async function authed(req, env) {
  if (!env.VAULT_PASSWORD) return false; // fail closed until the secret is set
  return safeEqual(cookie(req, "vault"), await sessionToken(env));
}

async function login(req, env) {
  if (req.method !== "POST") return loginPage(env, false);
  const form = await req.formData();
  if (!env.VAULT_PASSWORD || !safeEqual(String(form.get("password") || ""), env.VAULT_PASSWORD)) {
    return Response.redirect(new URL("/login?e=1", req.url), 303);
  }
  return new Response(null, {
    status: 303,
    headers: {
      location: "/",
      "set-cookie": `vault=${await sessionToken(env)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
    },
  });
}

function logout() {
  return new Response(null, {
    status: 303,
    headers: { location: "/login", "set-cookie": "vault=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" },
  });
}

function loginPage(env, failed) {
  const note = !env.VAULT_PASSWORD
    ? `<p class="err">VAULT_PASSWORD is not set. Run: wrangler secret put VAULT_PASSWORD</p>`
    : failed ? `<p class="err">That password didn't match.</p>` : "";
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Forge Vault</title>
<link rel="stylesheet" href="/app.css"></head>
<body class="login"><form method="post" action="/login" class="login-card">
<div class="wordmark">FORGE <span>VAULT</span></div>
<p class="muted">Private asset library</p>${note}
<input type="password" name="password" placeholder="Vault password" autocomplete="current-password" autofocus required>
<button type="submit">Enter</button></form></body></html>`, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// ---------- JSON API ----------

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

function ftsQuery(q) {
  const tokens = (q || "").match(/[\p{L}\p{N}_]+/gu) || [];
  return tokens.slice(0, 8).map((t) => `"${t}"*`).join(" ");
}

// Shared by the grid listing and ZIP downloads, so "download this view" matches what's on screen.
function filters(url) {
  const where = [];
  const args = [];
  const s = url.searchParams;
  if (KINDS.has(s.get("kind"))) { where.push("a.kind = ?"); args.push(s.get("kind")); }
  if (s.get("model")) { where.push("a.model = ?"); args.push(s.get("model")); }
  if (s.get("project")) {
    if (s.get("folder")) {
      where.push("EXISTS (SELECT 1 FROM asset_projects ap WHERE ap.asset_id = a.id AND ap.project_id = ? AND ap.folder_id = ?)");
      args.push(s.get("project"), s.get("folder"));
    } else {
      where.push("EXISTS (SELECT 1 FROM asset_projects ap WHERE ap.asset_id = a.id AND ap.project_id = ?)");
      args.push(s.get("project"));
    }
  }
  switch (s.get("collection")) {
    case "liked": where.push("a.liked = 1"); break;
    case "unsorted": where.push("a.project_id IS NULL AND a.source != 'upload'"); break;
    case "marketing": where.push("a.source = 'marketing'"); break;
    case "uploads": where.push("a.source = 'upload'"); break;
    case "refs": where.push("a.ref_count > 0"); break;
  }
  if (SOURCES.has(s.get("source"))) { where.push("a.source = ?"); args.push(s.get("source")); }
  const q = ftsQuery(s.get("q"));
  if (q) { where.push("a.id IN (SELECT id FROM assets_fts WHERE assets_fts MATCH ?)"); args.push(q); }
  return { where, args, asc: s.get("sort") === "asc" };
}

async function api(req, env, url) {
  const parts = url.pathname.split("/").filter(Boolean); // ["api", ...]
  const route = parts[1];

  if (route === "stats") {
    const [kinds, sources, files, projects] = await env.DB.batch([
      env.DB.prepare("SELECT kind, count(*) n FROM assets GROUP BY kind"),
      env.DB.prepare("SELECT source, count(*) n FROM assets GROUP BY source"),
      env.DB.prepare("SELECT status, count(*) n, coalesce(sum(bytes), 0) bytes FROM files GROUP BY status"),
      env.DB.prepare("SELECT count(*) n FROM projects"),
    ]);
    const collections = await env.DB.prepare(`SELECT
        (SELECT count(*) FROM assets) total,
        (SELECT count(*) FROM assets WHERE liked = 1) liked,
        (SELECT count(*) FROM assets WHERE project_id IS NULL AND source != 'upload') unsorted,
        (SELECT count(*) FROM assets WHERE source = 'marketing') marketing,
        (SELECT count(*) FROM assets WHERE source = 'upload') uploads,
        (SELECT count(*) FROM assets WHERE ref_count > 0) refs`).first();
    return json({
      kinds: Object.fromEntries(kinds.results.map((r) => [r.kind, r.n])),
      sources: Object.fromEntries(sources.results.map((r) => [r.source, r.n])),
      files: Object.fromEntries(files.results.map((r) => [r.status, { n: r.n, bytes: r.bytes }])),
      projects: projects.results[0].n,
      collections,
    });
  }

  if (route === "projects") {
    const [projects, folders] = await env.DB.batch([
      env.DB.prepare(`SELECT p.id, p.name, p.path,
          (SELECT count(DISTINCT asset_id) FROM asset_projects ap WHERE ap.project_id = p.id) n
        FROM projects p ORDER BY lower(p.name)`),
      env.DB.prepare(`SELECT f.id, f.project_id, f.parent_id, f.name,
          (SELECT count(DISTINCT asset_id) FROM asset_projects ap WHERE ap.folder_id = f.id) n
        FROM folders f ORDER BY lower(f.name)`),
    ]);
    return json({ projects: projects.results, folders: folders.results });
  }

  if (route === "models") {
    const r = await env.DB.prepare("SELECT model, count(*) n FROM assets WHERE model IS NOT NULL GROUP BY model ORDER BY n DESC").all();
    return json(r.results);
  }

  if (route === "assets" && !parts[2]) {
    const { where, args, asc } = filters(url);
    const cursor = url.searchParams.get("cursor");
    if (cursor) {
      const [created, id] = cursor.split("|");
      where.push(asc ? "(a.created_at, a.id) > (?, ?)" : "(a.created_at, a.id) < (?, ?)");
      args.push(created, id);
    }
    const dir = asc ? "ASC" : "DESC";
    const sql = `SELECT a.id, a.source, a.kind, a.model, a.created_at, a.liked, substr(a.prompt, 1, 280) prompt,
        a.asset_key, a.preview_key, a.ref_count
      FROM assets a ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY a.created_at ${dir}, a.id ${dir} LIMIT ${PAGE + 1}`;
    const rows = (await env.DB.prepare(sql).bind(...args).all()).results;
    const more = rows.length > PAGE;
    const items = rows.slice(0, PAGE);
    const last = items[items.length - 1];
    return json({ items, cursor: more && last ? `${last.created_at}|${last.id}` : null });
  }

  if (route === "assets" && parts[2]) {
    const id = parts[2];
    const a = await env.DB.prepare("SELECT * FROM assets WHERE id = ?").bind(id).first();
    if (!a) return json({ error: "not found" }, 404);
    if (parts[3] === "prompt.txt") return download(promptText(a), `${id}.prompt.txt`, "text/plain; charset=utf-8");
    if (parts[3] === "meta.json") return download(JSON.stringify(await meta(env, a), null, 2), `${id}.meta.json`, "application/json");

    const refs = JSON.parse(a.refs);
    const refIds = [...new Set(refs.map((r) => r.id).filter(Boolean))];
    const [placements, usedBy, known] = await env.DB.batch([
      env.DB.prepare(`SELECT ap.project_id, p.name project_name, ap.folder_id, f.name folder_name
        FROM asset_projects ap LEFT JOIN projects p ON p.id = ap.project_id LEFT JOIN folders f ON f.id = ap.folder_id
        WHERE ap.asset_id = ?`).bind(id),
      env.DB.prepare(`SELECT a.id, a.kind, a.asset_key, a.preview_key, a.created_at FROM asset_refs r
        JOIN assets a ON a.id = r.asset_id WHERE r.ref_id = ? ORDER BY a.created_at DESC LIMIT 24`).bind(id),
      env.DB.prepare(`SELECT id, kind, asset_key, preview_key FROM assets WHERE id IN (SELECT value FROM json_each(?))`)
        .bind(JSON.stringify(refIds)),
    ]);
    const byId = Object.fromEntries(known.results.map((r) => [r.id, r]));
    return json({
      ...a,
      params: JSON.parse(a.params),
      refs: refs.map((r) => ({ ...r, asset: byId[r.id] || null })),
      placements: placements.results,
      used_by: usedBy.results,
    });
  }

  return json({ error: "not found" }, 404);
}

function download(body, filename, type) {
  return new Response(body, {
    headers: { "content-type": type, "content-disposition": `attachment; filename="${filename}"`, "cache-control": "no-store" },
  });
}

function promptText(a) {
  const lines = [a.prompt || "(no prompt)"];
  if (a.enhanced_prompt) lines.push("", "--- enhanced prompt ---", a.enhanced_prompt);
  lines.push("", "--- source ---", `model: ${a.model || "upload"}`, `created: ${a.created_at}`, `id: ${a.id}`);
  return lines.join("\n") + "\n";
}

async function meta(env, a) {
  const placements = (await env.DB.prepare(`SELECT p.name project, f.name folder, ap.project_id, ap.folder_id
    FROM asset_projects ap LEFT JOIN projects p ON p.id = ap.project_id LEFT JOIN folders f ON f.id = ap.folder_id
    WHERE ap.asset_id = ?`).bind(a.id).all()).results;
  return {
    id: a.id,
    source: a.source,
    kind: a.kind,
    model: a.model,
    created_at: a.created_at,
    liked: !!a.liked,
    prompt: a.prompt,
    enhanced_prompt: a.enhanced_prompt || undefined,
    params: JSON.parse(a.params),
    references: JSON.parse(a.refs),
    placements,
    files: { asset: a.asset_key, preview: a.preview_key || undefined },
    higgsfield_url: a.asset_src,
  };
}

async function writeSidecars(env, id) {
  const a = await env.DB.prepare("SELECT * FROM assets WHERE id = ?").bind(id).first();
  if (!a || a.source === "upload") return;
  await Promise.all([
    env.VAULT.put(`${a.vault_folder}/prompt.txt`, promptText(a), { httpMetadata: { contentType: MIME.txt } }),
    env.VAULT.put(`${a.vault_folder}/meta.json`, JSON.stringify(await meta(env, a), null, 2), { httpMetadata: { contentType: MIME.json } }),
  ]);
}

// ---------- files ----------

async function file(req, env, url) {
  const key = decodeURIComponent(url.pathname.slice("/file/".length));
  const obj = await env.VAULT.get(key, { range: req.headers, onlyIf: req.headers });
  if (!obj) {
    // Not copied yet: fall back to the Higgsfield original so the library works during ingest.
    const row = await env.DB.prepare(`SELECT url FROM files WHERE key = ?1
      UNION ALL SELECT asset_src FROM assets WHERE asset_key = ?1
      UNION ALL SELECT preview_src FROM assets WHERE preview_key = ?1 LIMIT 1`).bind(key).first();
    return row ? Response.redirect(row.url, 302) : json({ error: "not found" }, 404);
  }
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "private, max-age=86400");
  if (url.searchParams.has("dl")) {
    const name = url.searchParams.get("name") || key.split("/").slice(-2).join("_");
    headers.set("content-disposition", `attachment; filename="${name.replace(/"/g, "")}"`);
  }
  if (!("body" in obj)) return new Response(null, { status: 304, headers });
  let status = 200;
  if (req.headers.has("range") && obj.range) {
    const r = obj.range;
    const start = r.suffix != null ? obj.size - r.suffix : r.offset ?? 0;
    const end = r.suffix != null ? obj.size - 1 : r.length != null ? start + r.length - 1 : obj.size - 1;
    headers.set("content-range", `bytes ${start}-${end}/${obj.size}`);
    headers.set("content-length", String(end - start + 1));
    status = 206;
  }
  return new Response(obj.body, { status, headers });
}

async function source(env, key, fallbackUrl) {
  const obj = await env.VAULT.get(key);
  if (obj) return { input: obj.body, size: obj.size };
  if (!fallbackUrl) return null;
  // One dead source link must not abort the whole ZIP stream; skip it instead.
  try {
    const r = await fetch(fallbackUrl);
    return r.ok ? { input: r } : null;
  } catch {
    return null;
  }
}

async function zip(env, url) {
  const { where, args, asc } = filters(url);
  const limit = Number(env.ZIP_LIMIT) || 300;
  const dir = asc ? "ASC" : "DESC";
  const rows = (await env.DB.prepare(`SELECT a.* FROM assets a ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY a.created_at ${dir}, a.id ${dir} LIMIT ${limit}`).bind(...args).all()).results;
  if (!rows.length) return json({ error: "nothing matches this view" }, 404);

  async function* entries() {
    const seenRefs = new Set();
    for (const a of rows) {
      const modified = new Date(a.created_at);
      if (a.source !== "upload") {
        yield { name: `${a.vault_folder}/prompt.txt`, input: promptText(a), lastModified: modified };
        yield { name: `${a.vault_folder}/meta.json`, input: JSON.stringify(await meta(env, a), null, 2), lastModified: modified };
      }
      const f = await source(env, a.asset_key, a.asset_src);
      if (f) yield { name: a.asset_key, lastModified: modified, ...f };
      for (const r of JSON.parse(a.refs)) {
        if (!r.vault_key || seenRefs.has(r.vault_key)) continue;
        seenRefs.add(r.vault_key);
        const rf = await source(env, r.vault_key, r.url);
        if (rf) yield { name: r.vault_key, ...rf };
      }
    }
  }

  const label = url.searchParams.get("label") || "forge-vault";
  const res = downloadZip(entries());
  return new Response(res.body, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${label.replace(/[^\w.-]+/g, "-")}.zip"`,
      "x-vault-assets": String(rows.length),
    },
  });
}

// ---------- admin (used by scripts/load_vault.mjs) ----------

async function admin(req, env, url) {
  const auth = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!env.ADMIN_TOKEN || !safeEqual(auth, env.ADMIN_TOKEN)) return json({ error: "forbidden" }, 403);
  const route = url.pathname.slice("/admin/".length);

  if (route === "status") {
    const r = await env.DB.prepare("SELECT status, count(*) n, coalesce(sum(bytes), 0) bytes FROM files GROUP BY status").all();
    const errors = await env.DB.prepare("SELECT key, error FROM files WHERE status = 'error' LIMIT 20").all();
    return json({ files: r.results, sample_errors: errors.results });
  }

  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  const body = await req.json();

  if (route === "seed") {
    const stmts = [];
    for (const p of body.projects || []) {
      stmts.push(env.DB.prepare("INSERT INTO projects (id, name, path) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, path = excluded.path")
        .bind(p.id, p.name, p.path));
    }
    for (const f of body.folders || []) {
      stmts.push(env.DB.prepare("INSERT INTO folders (id, project_id, parent_id, name, path) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, path = excluded.path, parent_id = excluded.parent_id")
        .bind(f.id, f.project_id, f.parent_id, f.name, f.path));
    }
    for (const a of body.assets || []) {
      stmts.push(env.DB.prepare(`INSERT INTO assets (id, source, kind, model, created_at, liked, prompt, enhanced_prompt, params, refs,
          project_id, folder_id, vault_folder, asset_key, asset_src, preview_key, preview_src, ref_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET source = excluded.source, kind = excluded.kind, model = excluded.model,
          created_at = excluded.created_at, liked = excluded.liked, prompt = excluded.prompt,
          enhanced_prompt = excluded.enhanced_prompt, params = excluded.params, refs = excluded.refs,
          project_id = excluded.project_id, folder_id = excluded.folder_id, vault_folder = excluded.vault_folder,
          asset_key = excluded.asset_key, asset_src = excluded.asset_src, preview_key = excluded.preview_key,
          preview_src = excluded.preview_src, ref_count = excluded.ref_count`)
        .bind(a.id, a.source, a.kind, a.model, a.created_at, a.liked ? 1 : 0, a.prompt, a.enhanced_prompt,
          JSON.stringify(a.params), JSON.stringify(a.refs), a.project_id, a.folder_id, a.vault_folder,
          a.asset_key, a.asset_src, a.preview_key, a.preview_src, a.ref_count));
      stmts.push(env.DB.prepare("DELETE FROM assets_fts WHERE id = ?").bind(a.id));
      stmts.push(env.DB.prepare("INSERT INTO assets_fts (id, prompt, enhanced_prompt, model) VALUES (?, ?, ?, ?)")
        .bind(a.id, a.prompt, a.enhanced_prompt, a.model || ""));
      stmts.push(env.DB.prepare("DELETE FROM asset_projects WHERE asset_id = ?").bind(a.id));
      for (const pl of a.placements) {
        stmts.push(env.DB.prepare("INSERT OR IGNORE INTO asset_projects (asset_id, project_id, folder_id) VALUES (?, ?, ?)")
          .bind(a.id, pl.project_id, pl.folder_id));
      }
      stmts.push(env.DB.prepare("DELETE FROM asset_refs WHERE asset_id = ?").bind(a.id));
      for (const r of a.refs) {
        if (r.id) stmts.push(env.DB.prepare("INSERT OR IGNORE INTO asset_refs (asset_id, ref_id, role) VALUES (?, ?, ?)").bind(a.id, r.id, r.role || ""));
      }
    }
    if (stmts.length) await env.DB.batch(stmts);
    return json({ ok: true, statements: stmts.length });
  }

  if (route === "enqueue") {
    const jobs = body.jobs || [];
    if (jobs.length) {
      await env.DB.batch(jobs.map((j) => env.DB.prepare("INSERT OR IGNORE INTO files (key, url, asset_id, role) VALUES (?, ?, ?, ?)")
        .bind(j.key, j.url, j.asset_id, j.role)));
    }
    const done = new Set((await env.DB.prepare("SELECT key FROM files WHERE status = 'done' AND key IN (SELECT value FROM json_each(?))")
      .bind(JSON.stringify(jobs.map((j) => j.key))).all()).results.map((r) => r.key));
    const todo = jobs.filter((j) => !done.has(j.key));
    for (let i = 0; i < todo.length; i += 100) {
      await env.INGEST.sendBatch(todo.slice(i, i + 100).map((j) => ({ body: j })));
    }
    return json({ ok: true, queued: todo.length, skipped: jobs.length - todo.length });
  }

  if (route === "requeue-errors") {
    const rows = (await env.DB.prepare("SELECT key, url, asset_id, role FROM files WHERE status = 'error' LIMIT 500").all()).results;
    if (rows.length) {
      await env.DB.prepare("UPDATE files SET status = 'pending', error = NULL WHERE key IN (SELECT value FROM json_each(?))")
        .bind(JSON.stringify(rows.map((r) => r.key))).run();
      for (let i = 0; i < rows.length; i += 100) await env.INGEST.sendBatch(rows.slice(i, i + 100).map((j) => ({ body: j })));
    }
    return json({ ok: true, requeued: rows.length });
  }

  return json({ error: "not found" }, 404);
}
