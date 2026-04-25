@echo off
setlocal

echo Starting ProjectBrain backend on http://127.0.0.1:8000 ...
echo To start frontend in another terminal:
echo   cd projectbrain\frontend
echo   npm install
echo   npm run dev

set PYTHONPATH=%cd%
python -m uvicorn projectbrain.backend.main:app --host 127.0.0.1 --port 8000
