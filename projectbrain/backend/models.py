from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class CreateProjectRequest(BaseModel):
    name: str = Field(..., min_length=1)
    root_path: str = Field(..., min_length=1)
    template: str = Field(..., min_length=1)


class ScanProjectRequest(BaseModel):
    project_path: str = Field(..., min_length=1)


class AssetEntry(BaseModel):
    path: str
    relative_path: str
    name: str
    extension: str
    type: str
    size_bytes: int
    tags: List[str] = Field(default_factory=list)
    smart_category: Optional[str] = None


class CreateProjectResponse(BaseModel):
    project_path: str
    template: str
    created_folders: List[str]


class ScanProjectResponse(BaseModel):
    project_path: str
    asset_count: int
    assets: List[AssetEntry]
