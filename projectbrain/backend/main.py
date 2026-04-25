from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import CreateProjectRequest, CreateProjectResponse, ScanProjectRequest, ScanProjectResponse
from .project_manager import create_project
from .scanner import scan_project
from .templates import TemplateNotFoundError

app = FastAPI(title="ProjectBrain API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/projects/create", response_model=CreateProjectResponse)
def create_project_endpoint(request: CreateProjectRequest) -> CreateProjectResponse:
    try:
        return create_project(request)
    except TemplateNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Failed to create project: {exc}") from exc


@app.post("/projects/scan", response_model=ScanProjectResponse)
def scan_project_endpoint(request: ScanProjectRequest) -> ScanProjectResponse:
    try:
        return scan_project(request.project_path)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=f"Failed to scan project: {exc}") from exc
