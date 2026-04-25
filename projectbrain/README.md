# ProjectBrain (v1 foundation)

ProjectBrain is a **local-first creative project manager** for structured project work across VFX, jewelry, music, AI media, design, and realtime pipelines. It runs as a local web app with a Python backend and React frontend.

## What it is

- Template-driven project creation (VFX, jewelry, music)
- Local project indexing and JSON metadata storage
- Basic smart file categorization hooks (texture detection)
- Browser UI with project creation, project scanning, a folder graph, and file inspector

No cloud database is used in v1. Project metadata is written directly into each project folder.

## Backend setup (FastAPI)

From repository root:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r projectbrain/backend/requirements.txt  # or: pip install fastapi uvicorn pydantic
```

Run backend:

```bash
python projectbrain/start_projectbrain.py
```

Or directly:

```bash
python -m uvicorn projectbrain.backend.main:app --host 127.0.0.1 --port 8000
```

## Frontend setup (React + Vite)

```bash
cd projectbrain/frontend
npm install
npm run dev
```

Open the URL printed by Vite (default: <http://127.0.0.1:5173>). Backend should be running on <http://127.0.0.1:8000>.

## v1 currently supports

- `POST /projects/create`
  - Creates project directory under selected root path
  - Applies chosen template folders
  - Writes `project.json`
  - Initializes `_index/asset_index.json`, `_index/tags.json`, `_index/prompts.json`, `_index/conversations.json`
- `POST /projects/scan`
  - Recursively scans project files
  - Ignores generated files in `_index`
  - Detects file type (`image`, `video`, `audio`, `code`, `text`, `unknown`)
  - Detects texture-like filenames and UDIM patterns and sets `smart_category: "texture"`
  - Writes index to `_index/asset_index.json`
- Frontend vertical slice
  - Project creation form
  - Scan button
  - React Flow graph for top-level template folders
  - File list and inspector panel

## Planned future features (not in this task)

- Windows right-click **Move to Project**
- Visual notes and drawovers
- AI image tagging
- ChatGPT/ComfyUI prompt backup
- External app launch profiles with environment variables
- Video/audio previews
- Thumbnail generation
- Drag/drop file routing

## Notes

- Thumbnail/image generation is stubbed for now (classification only).
- Smart routing currently detects categories only; it does not move files.
