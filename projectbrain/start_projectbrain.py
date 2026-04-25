from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


def main() -> int:
    repo_root = Path(__file__).resolve().parent
    backend_module = "projectbrain.backend.main:app"

    print("Starting ProjectBrain backend on http://127.0.0.1:8000 ...")
    print("To start frontend in another terminal:")
    print("  cd projectbrain/frontend")
    print("  npm install")
    print("  npm run dev")

    env = os.environ.copy()
    env.setdefault("PYTHONPATH", str(repo_root.parent))

    command = [sys.executable, "-m", "uvicorn", backend_module, "--host", "127.0.0.1", "--port", "8000"]
    return subprocess.call(command, cwd=repo_root.parent, env=env)


if __name__ == "__main__":
    raise SystemExit(main())
