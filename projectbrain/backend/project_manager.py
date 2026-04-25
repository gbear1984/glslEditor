from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List

from .models import CreateProjectRequest, CreateProjectResponse
from .templates import get_template_folders


def _write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def create_project(request: CreateProjectRequest) -> CreateProjectResponse:
    project_root = Path(request.root_path).expanduser().resolve()
    project_path = project_root / request.name
    project_path.mkdir(parents=True, exist_ok=True)

    folders: List[str] = get_template_folders(request.template)
    for folder in folders:
        (project_path / folder).mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc).isoformat()

    project_metadata = {
        "name": request.name,
        "template": request.template,
        "created_at": now,
        "updated_at": now,
        "project_path": str(project_path),
    }
    _write_json(project_path / "project.json", project_metadata)

    index_path = project_path / "_index"
    _write_json(index_path / "asset_index.json", [])
    _write_json(index_path / "tags.json", {"tags": []})
    _write_json(index_path / "prompts.json", {"prompts": []})
    _write_json(index_path / "conversations.json", {"conversations": []})

    return CreateProjectResponse(
        project_path=str(project_path),
        template=request.template,
        created_folders=folders,
    )
