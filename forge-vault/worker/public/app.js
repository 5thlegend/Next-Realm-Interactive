// Forge Vault dashboard. Plain DOM, no build step. All text from the catalog goes in via textContent.
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  for (const k of kids) if (k != null) n.append(k);
  return n;
};
const fileUrl = (key, opts = {}) => {
  const q = new URLSearchParams(opts).toString();
  return `/file/${key.split("/").map(encodeURIComponent).join("/")}${q ? "?" + q : ""}`;
};
const fmt = new Intl.NumberFormat();
const day = (iso) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const bytes = (n) => {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`;
};
const GLYPH = { audio: "♪", "3d": "◈", video: "▶", image: "◻" };
const COLLECTIONS = [
  ["", "All assets", "total"],
  ["liked", "Liked", "liked"],
  ["unsorted", "Unsorted", "unsorted"],
  ["marketing", "Marketing Studio", "marketing"],
  ["uploads", "Uploads", "uploads"],
  ["refs", "Used as references", "refs"],
];

const state = { q: "", kind: "", model: "", sort: "desc", collection: "", project: "", folder: "" };
let cursor = null, loading = false, exhausted = false, generation = 0;
let projectsData = { projects: [], folders: [] };
let stats = null;

async function getJSON(path) {
  const r = await fetch(path, { credentials: "same-origin" });
  if (r.status === 401) { location.href = "/login"; throw new Error("signed out"); }
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

function query(extra = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...state, ...extra })) if (v) p.set(k, v);
  return p;
}

// ---------- state <-> URL hash ----------

function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  for (const k of Object.keys(state)) state[k] = h.get(k) || (k === "sort" ? "desc" : "");
  return h.get("a");
}

function writeHash(assetId) {
  const p = query();
  if (p.get("sort") === "desc") p.delete("sort");
  if (assetId) p.set("a", assetId);
  const next = p.toString();
  if (next !== location.hash.slice(1)) history.replaceState(null, "", next ? `#${next}` : location.pathname);
}

// ---------- rail ----------

function renderCollections() {
  const ul = $("collections");
  ul.replaceChildren(...COLLECTIONS.map(([id, label, statKey]) => {
    const on = !state.project && state.collection === id;
    const b = el("button", { className: on ? "on" : "" },
      el("span", { textContent: label }),
      el("span", { className: "n", textContent: stats ? fmt.format(stats.collections[statKey] || 0) : "" }));
    b.onclick = () => setView({ collection: id, project: "", folder: "" });
    return el("li", {}, b);
  }));
}

function renderProjects() {
  const f = $("projectFilter").value.trim().toLowerCase();
  const items = [];
  for (const p of projectsData.projects) {
    if (f && !p.name.toLowerCase().includes(f)) continue;
    const b = el("button", { className: state.project === p.id && !state.folder ? "on" : "", title: p.name },
      el("span", { textContent: p.name }), el("span", { className: "n", textContent: fmt.format(p.n) }));
    b.onclick = () => setView({ project: p.id, folder: "", collection: "" });
    items.push(el("li", {}, b));
    if (state.project === p.id) {
      for (const fo of projectsData.folders.filter((x) => x.project_id === p.id)) {
        const fb = el("button", { className: state.folder === fo.id ? "on" : "", title: fo.name },
          el("span", { textContent: fo.name }), el("span", { className: "n", textContent: fmt.format(fo.n) }));
        fb.onclick = () => setView({ project: p.id, folder: fo.id, collection: "" });
        items.push(el("li", { className: "sub" }, fb));
      }
    }
  }
  $("projects").replaceChildren(...items);
  $("projectCount").textContent = fmt.format(projectsData.projects.length);
}

function renderStats() {
  if (!stats) return;
  const k = stats.kinds;
  $("stats").replaceChildren(
    ...[["total", stats.collections.total], ["images", k.image], ["video", k.video], ["audio", k.audio], ["3D", k["3d"]], ["projects", stats.projects]]
      .map(([label, n]) => el("span", {}, el("b", { textContent: fmt.format(n || 0) }), ` ${label}`)));
  const f = stats.files || {};
  const done = f.done?.n || 0, total = done + (f.pending?.n || 0) + (f.error?.n || 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("ingest").replaceChildren(...[
    el("div", { textContent: total ? `Archived ${fmt.format(done)} of ${fmt.format(total)} files · ${bytes(f.done?.bytes)}` : "Archive copy not started" }),
    f.error?.n ? el("div", { textContent: `${fmt.format(f.error.n)} failed — will retry on next requeue` }) : null,
    el("div", { className: "bar" }, el("i", { style: `width:${pct}%` })),
  ].filter(Boolean));
}

function viewTitle() {
  if (state.project) {
    const p = projectsData.projects.find((x) => x.id === state.project);
    const fo = state.folder && projectsData.folders.find((x) => x.id === state.folder);
    return [p?.name || "Project", fo?.name].filter(Boolean).join(" / ");
  }
  return COLLECTIONS.find(([id]) => id === state.collection)?.[1] || "All assets";
}

// ---------- grid ----------

const glyph = (kind) => el("div", { className: "glyph", textContent: GLYPH[kind] || "◻" });

// A dead source link shows the type glyph instead of a broken-image icon.
function withFallback(node, kind) {
  node.addEventListener("error", () => node.replaceWith(glyph(kind)), { once: true });
  return node;
}

function mediaFor(a, { thumb = true } = {}) {
  const key = thumb && a.preview_key ? a.preview_key : a.asset_key;
  if (a.kind === "image") return withFallback(el("img", { src: fileUrl(key), loading: "lazy", alt: "", decoding: "async" }), a.kind);
  if (a.kind === "video") {
    return withFallback(el("video", { src: fileUrl(a.asset_key) + "#t=0.5", muted: true, playsInline: true, preload: "metadata", loop: true }), a.kind);
  }
  return glyph(a.kind);
}

function card(a) {
  const c = el("button", { className: "card", type: "button" },
    el("div", { className: "media" }, mediaFor(a)),
    el("span", { className: "badge", textContent: a.kind }),
    a.liked ? el("span", { className: "badge right", textContent: "♥" }) : null,
    el("div", { className: "meta" }, el("b", { textContent: a.model || "upload" }), el("span", { textContent: day(a.created_at) })));
  c.title = a.prompt || a.model || "";
  c.onclick = () => openAsset(a.id);
  const v = c.querySelector("video");
  if (v) {
    c.onmouseenter = () => v.play().catch(() => {});
    c.onmouseleave = () => { v.pause(); };
  }
  return c;
}

async function loadMore() {
  if (loading || exhausted) return;
  loading = true;
  const gen = generation;
  try {
    const data = await getJSON(`/api/assets?${query(cursor ? { cursor } : {})}`);
    if (gen !== generation) return; // a newer filter replaced this request
    $("grid").append(...data.items.map(card));
    cursor = data.cursor;
    exhausted = !cursor;
    $("empty").hidden = $("grid").children.length > 0;
  } catch (err) {
    toast(err.message);
  } finally {
    if (gen === generation) loading = false;
  }
  // Keep filling if the sentinel is still on screen.
  if (!exhausted && $("sentinel").getBoundingClientRect().top < innerHeight + 600) loadMore();
}

function reload() {
  generation++;
  cursor = null; exhausted = false; loading = false;
  $("grid").replaceChildren();
  $("empty").hidden = true;
  $("viewTitle").textContent = viewTitle();
  for (const b of $("kinds").children) b.classList.toggle("on", b.dataset.kind === state.kind);
  $("model").value = state.model;
  $("sort").value = state.sort;
  $("q").value = state.q;
  const label = viewTitle().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  $("zipBtn").href = `/zip?${query({ label: `forge-vault-${label}` })}`;
  renderCollections();
  renderProjects();
  writeHash();
  loadMore();
}

function setView(patch) {
  Object.assign(state, patch);
  $("rail").classList.remove("open");
  reload();
}

// ---------- detail ----------

const SETTING_KEYS = ["aspect_ratio", "resolution", "quality", "duration", "width", "height", "seed", "batch_size",
  "generate_audio", "camera_model", "camera_lens", "camera_focal_length", "camera_aperture", "genre", "speedramp", "voice", "style"];

function settingValue(v) {
  if (v == null || v === "") return null;
  if (typeof v === "object") return v.name || v.title || v.label || v.id || JSON.stringify(v).slice(0, 80);
  return String(v);
}

function thumbFor(item, label, onClick) {
  const t = el("button", { className: "thumb", type: "button", title: label || "" });
  const a = item.asset;
  if (a && a.kind === "image") t.append(withFallback(el("img", { src: fileUrl(a.preview_key || a.asset_key), loading: "lazy", alt: "" }), a.kind));
  else if (a && a.kind === "video") t.append(withFallback(el("video", { src: fileUrl(a.asset_key) + "#t=0.5", muted: true, preload: "metadata" }), a.kind));
  else if (!a && /\.(png|jpe?g|webp|gif)(\?|$)/i.test(item.url || "")) t.append(withFallback(el("img", { src: fileUrl(item.vault_key), loading: "lazy", alt: "" }), "image"));
  else t.append(el("span", { textContent: GLYPH[a?.kind] || "◻" }));
  if (label) t.append(el("small", { textContent: label }));
  t.onclick = onClick;
  return t;
}

let current = null;

async function openAsset(id) {
  let a;
  try { a = await getJSON(`/api/assets/${encodeURIComponent(id)}`); } catch (err) { toast(err.message); return; }
  current = a;
  writeHash(id);

  const media = $("detailMedia");
  if (a.kind === "image") media.replaceChildren(el("img", { src: fileUrl(a.asset_key), alt: "" }));
  else if (a.kind === "video") media.replaceChildren(el("video", { src: fileUrl(a.asset_key), controls: true, autoplay: true, playsInline: true, loop: true }));
  else if (a.kind === "audio") media.replaceChildren(el("audio", { src: fileUrl(a.asset_key), controls: true }));
  else if (a.kind === "3d" && a.asset_key.endsWith(".glb")) {
    import("https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js").catch(() => {});
    const mv = document.createElement("model-viewer");
    mv.setAttribute("src", fileUrl(a.asset_key));
    mv.setAttribute("camera-controls", "");
    mv.setAttribute("auto-rotate", "");
    media.replaceChildren(mv);
  } else media.replaceChildren(el("div", { className: "glyph", textContent: GLYPH[a.kind] || "◻" }));

  $("detailEyebrow").textContent = `${a.kind} · ${a.source}`;
  $("detailTitle").textContent = `${a.model || "Upload"} — ${day(a.created_at)}`;
  $("detailPrompt").textContent = a.prompt || "No prompt (upload or utility job).";
  $("copyPrompt").hidden = !a.prompt;
  $("enhancedWrap").hidden = !a.enhanced_prompt;
  $("detailEnhanced").textContent = a.enhanced_prompt || "";

  const ext = a.asset_key.split(".").pop();
  const base = `${(a.model || a.kind)}_${a.id.slice(0, 8)}`;
  $("detailActions").replaceChildren(
    el("a", { className: "btn", href: fileUrl(a.asset_key, { dl: 1, name: `${base}.${ext}` }), textContent: `Download ${ext.toUpperCase()}` }),
    a.prompt ? el("a", { className: "btn ghost", href: `/api/assets/${a.id}/prompt.txt`, textContent: "prompt.txt" }) : null,
    el("a", { className: "btn ghost", href: `/api/assets/${a.id}/meta.json`, textContent: "meta.json" }),
    Object.assign(el("button", { className: "btn ghost", textContent: "Copy link" }), {
      onclick: () => copy(location.href, "Link copied"),
    }));

  const rows = [];
  for (const k of SETTING_KEYS) {
    const v = settingValue(a.params[k]);
    if (v) rows.push(el("dt", { textContent: k.replace(/_/g, " ") }), el("dd", { textContent: v }));
  }
  rows.push(el("dt", { textContent: "id" }), el("dd", { textContent: a.id }));
  $("detailSettings").replaceChildren(...rows);
  $("detailParams").textContent = JSON.stringify(a.params, null, 2);
  $("settingsWrap").hidden = a.source === "upload";

  $("refsWrap").hidden = !a.refs.length;
  $("detailRefs").replaceChildren(...a.refs.map((r) => thumbFor(r, (r.role || "").replace(/_/g, " "),
    () => (r.asset ? openAsset(r.asset.id) : window.open(fileUrl(r.vault_key), "_blank")))));

  $("usedWrap").hidden = !a.used_by.length;
  $("detailUsed").replaceChildren(...a.used_by.map((u) => thumbFor({ asset: u }, day(u.created_at), () => openAsset(u.id))));

  $("placeWrap").hidden = !a.placements.length;
  $("detailPlaces").replaceChildren(...a.placements.map((pl) => {
    const t = el("button", { className: "tag", textContent: [pl.project_name, pl.folder_name].filter(Boolean).join(" / ") || pl.project_id });
    t.onclick = () => { closeDetail(); setView({ project: pl.project_id, folder: pl.folder_name ? pl.folder_id : "", collection: "" }); };
    return t;
  }));

  if (!$("detail").open) $("detail").showModal();
  $("detail").querySelector(".detail-info").scrollTop = 0;
}

function closeDetail() {
  $("detail").close();
}

$("detail").addEventListener("close", () => {
  $("detailMedia").replaceChildren(); // stop video/audio
  current = null;
  writeHash();
});
$("detailClose").onclick = closeDetail;
$("detail").addEventListener("click", (e) => { if (e.target === $("detail")) closeDetail(); });
$("copyPrompt").onclick = () => current && copy(current.prompt, "Prompt copied");

// ---------- misc ----------

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg); } catch { toast("Copy failed — select and copy manually"); }
}

// ---------- wiring ----------

let qTimer;
$("q").addEventListener("input", (e) => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => setView({ q: e.target.value.trim() }), 280);
});
$("kinds").addEventListener("click", (e) => { if (e.target.dataset.kind != null) setView({ kind: e.target.dataset.kind }); });
$("model").onchange = (e) => setView({ model: e.target.value });
$("sort").onchange = (e) => setView({ sort: e.target.value });
$("projectFilter").oninput = renderProjects;
$("railToggle").onclick = () => {
  // On phones the rail is a sheet under the (wrapping) top bar.
  document.documentElement.style.setProperty("--rail-top", `${document.querySelector(".topbar").getBoundingClientRect().bottom}px`);
  $("rail").classList.toggle("open");
};
$("zipBtn").addEventListener("click", () => toast("Preparing ZIP — up to 300 assets per download"));

async function init() {
  const assetId = readHash();
  const [s, p, models] = await Promise.all([getJSON("/api/stats"), getJSON("/api/projects"), getJSON("/api/models")]);
  stats = s;
  projectsData = p;
  $("model").append(...models.map((m) => el("option", { value: m.model, textContent: `${m.model} (${fmt.format(m.n)})` })));
  renderStats();
  reload();
  // Observe only after the first reload, so page one isn't requested twice.
  new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) loadMore(); }, { rootMargin: "800px" }).observe($("sentinel"));
  if (assetId) openAsset(assetId);
  setInterval(async () => { try { stats = await getJSON("/api/stats"); renderStats(); renderCollections(); } catch {} }, 60000);
}

init().catch((err) => toast(err.message));
