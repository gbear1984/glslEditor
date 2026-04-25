from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List

from .models import AssetEntry, ScanProjectResponse

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".exr", ".tif", ".tiff", ".bmp", ".gif", ".webp", ".hdr"}
VIDEO_EXTENSIONS = {".mov", ".mp4", ".mkv", ".avi", ".webm", ".mxf"}
AUDIO_EXTENSIONS = {".wav", ".mp3", ".flac", ".aif", ".aiff", ".ogg"}
CODE_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx", ".cpp", ".h", ".cs", ".json", ".yaml", ".yml", ".glsl", ".md"}
TEXT_EXTENSIONS = {".txt", ".csv", ".rtf", ".ini"}

TEXTURE_KEYWORDS = {
    "diff",
    "diffuse",
    "albedo",
    "basecolor",
    "base_color",
    "spec",
    "specular",
    "rough",
    "roughness",
    "gloss",
    "metal",
    "metallic",
    "sss",
    "subsurface",
    "normal",
    "nrm",
    "bump",
    "height",
    "disp",
    "displacement",
    "opacity",
    "alpha",
}

UDIM_PATTERN = re.compile(r"(?:1\d{3}|<udim>)", re.IGNORECASE)


def _file_type(extension: str) -> str:
    if extension in IMAGE_EXTENSIONS:
        return "image"
    if extension in VIDEO_EXTENSIONS:
        return "video"
    if extension in AUDIO_EXTENSIONS:
        return "audio"
    if extension in CODE_EXTENSIONS:
        return "code"
    if extension in TEXT_EXTENSIONS:
        return "text"
    return "unknown"


def _smart_category(filename: str) -> str | None:
    lowered = filename.lower()
    if any(keyword in lowered for keyword in TEXTURE_KEYWORDS):
        return "texture"
    if UDIM_PATTERN.search(lowered):
        return "texture"
    return None


def _write_index(project_path: Path, assets: List[Dict[str, object]]) -> None:
    index_path = project_path / "_index" / "asset_index.json"
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(json.dumps(assets, indent=2), encoding="utf-8")


def scan_project(project_path_str: str) -> ScanProjectResponse:
    project_path = Path(project_path_str).expanduser().resolve()
    if not project_path.exists() or not project_path.is_dir():
        raise FileNotFoundError(f"Project path not found: {project_path}")

    assets: List[AssetEntry] = []

    for file_path in project_path.rglob("*"):
        if not file_path.is_file():
            continue

        relative_path = file_path.relative_to(project_path)
        if relative_path.parts and relative_path.parts[0] == "_index":
            continue

        extension = file_path.suffix.lower()
        entry = AssetEntry(
            path=str(file_path),
            relative_path=str(relative_path).replace("\\", "/"),
            name=file_path.name,
            extension=extension,
            type=_file_type(extension),
            size_bytes=file_path.stat().st_size,
            tags=[],
            smart_category=_smart_category(file_path.stem),
        )
        assets.append(entry)

    serialized = [asset.model_dump() for asset in assets]
    _write_index(project_path, serialized)

    return ScanProjectResponse(
        project_path=str(project_path),
        asset_count=len(assets),
        assets=assets,
    )
