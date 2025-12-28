import os

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from api.routes import router

app = FastAPI()
app.include_router(router)

frontend_build_dir = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.exists(frontend_build_dir):
    app.mount("/", StaticFiles(directory=frontend_build_dir, html=True), name="frontend")