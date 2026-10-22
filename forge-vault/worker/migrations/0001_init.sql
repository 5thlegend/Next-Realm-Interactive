CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL
);

CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  parent_id TEXT,
  name TEXT NOT NULL,
  path TEXT NOT NULL
);

CREATE TABLE assets (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,          -- generation | marketing | upload
  kind TEXT NOT NULL,            -- image | video | audio | 3d
  model TEXT,
  created_at TEXT NOT NULL,      -- ISO 8601
  liked INTEGER NOT NULL DEFAULT 0,
  prompt TEXT NOT NULL DEFAULT '',
  enhanced_prompt TEXT NOT NULL DEFAULT '',
  params TEXT NOT NULL DEFAULT '{}',
  refs TEXT NOT NULL DEFAULT '[]',
  project_id TEXT,               -- primary placement; NULL = unsorted
  folder_id TEXT,
  vault_folder TEXT NOT NULL,
  asset_key TEXT NOT NULL,
  asset_src TEXT NOT NULL,
  preview_key TEXT,
  preview_src TEXT,
  ref_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX assets_created ON assets (created_at DESC, id DESC);
CREATE INDEX assets_kind ON assets (kind, created_at DESC);
CREATE INDEX assets_model ON assets (model, created_at DESC);
CREATE INDEX assets_source ON assets (source, created_at DESC);
CREATE INDEX assets_project ON assets (project_id, created_at DESC);

-- Every project placement (an asset can sit in several projects and folders).
CREATE TABLE asset_projects (
  asset_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  folder_id TEXT,
  PRIMARY KEY (asset_id, project_id, folder_id)
);
CREATE INDEX asset_projects_project ON asset_projects (project_id, folder_id);

-- Lineage: which assets used which references.
CREATE TABLE asset_refs (
  asset_id TEXT NOT NULL,
  ref_id TEXT NOT NULL,
  role TEXT,
  PRIMARY KEY (asset_id, ref_id, role)
);
CREATE INDEX asset_refs_ref ON asset_refs (ref_id);

CREATE VIRTUAL TABLE assets_fts USING fts5(id UNINDEXED, prompt, enhanced_prompt, model);

-- Copy jobs from Higgsfield into R2.
CREATE TABLE files (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  asset_id TEXT,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | done | error
  bytes INTEGER,
  error TEXT,
  updated_at TEXT
);
CREATE INDEX files_status ON files (status);
