#!/usr/bin/env sh
set -e

PYTHON_BIN=python3
command -v python >/dev/null && PYTHON_BIN=python

echo "Using Python: $PYTHON_BIN"

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Installing backend dependencies..."
cd ../backend
$PYTHON_BIN -m pip install -r requirements.txt

echo "Starting FastAPI..."
$PYTHON_BIN -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
