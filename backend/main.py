from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from backend.routes.mission import router as mission_router
    from backend.routes.upload import router as upload_router
    from backend.routes.report import router as report_router
except ModuleNotFoundError:
    from routes.mission import router as mission_router
    from routes.upload import router as upload_router
    from routes.report import router as report_router

app = FastAPI(
    title="OrionOS API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mission_router)
app.include_router(upload_router)
app.include_router(report_router)

@app.get("/")
def root():
    return {
        "status": "running",
        "project": "OrionOS",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {
        "healthy": True
    }