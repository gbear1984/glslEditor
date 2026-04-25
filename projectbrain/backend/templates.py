from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List


class TemplateNotFoundError(ValueError):
    pass


def templates_dir() -> Path:
    return Path(__file__).resolve().parents[1] / "templates"


def get_template_folders(template_name: str) -> List[str]:
    template_path = templates_dir() / f"{template_name.lower()}.json"
    if not template_path.exists():
        raise TemplateNotFoundError(f"Template not found: {template_name}")

    data: Dict[str, object] = json.loads(template_path.read_text(encoding="utf-8"))
    folders = data.get("folders")
    if not isinstance(folders, list):
        raise ValueError(f"Invalid template format for {template_name}")
    return [str(folder) for folder in folders]
