#!/usr/bin/env sh
set -e

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Installing backend dependencies..."
cd ../backend
pip install -r requirements.txt

echo "Starting FastAPI..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
