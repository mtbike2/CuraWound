from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CuraWound API",
    description="Wound care documentation backend",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "CuraWound", "version": "0.1.0"}
