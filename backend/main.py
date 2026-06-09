from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
import os

from database.models import get_db, Project, TrainingSession, Settings
from training_engine import TrainingEngine
from data_engine import DataEngine
from hardware_detector import HardwareDetector

app = FastAPI(title="OmniTrain AI Pro Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Engines
training_engine = TrainingEngine()
data_engine = DataEngine()
detector = HardwareDetector()

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    model_type: str
    nodes: List[dict]

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0-PRO"}

# --- Project Management ---
@app.post("/projects")
def create_project(proj: ProjectCreate, db: Session = Depends(get_db)):
    db_proj = Project(**proj.model_dump())
    db.add(db_proj)
    db.commit()
    db.refresh(db_proj)
    return db_proj

@app.get("/projects")
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

# --- Hardware & System ---
@app.get("/system/specs")
def get_specs():
    return detector.get_specs()

@app.get("/system/load")
def get_load():
    return detector.get_specs() # In this simple impl, load is part of specs

# --- Training Operations ---
@app.post("/training/start/{project_id}")
async def start_training(project_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Fallback for dynamic training if project doesn't exist
    project = db.query(Project).filter(Project.id == project_id).first()
    config = {"nodes": project.nodes if project else {"nodes": []}}

    background_tasks.add_task(training_engine.start_training, config)
    return {"status": "Training initiated"}

@app.post("/training/stop")
def stop_training():
    training_engine.stop_training()
    return {"status": "Stop signal sent"}

@app.get("/training/status")
def get_training_status():
    return training_engine.get_status()

# --- Data Management ---
@app.post("/data/pool")
def add_to_pool(file_path: str):
    return data_engine.process_file(file_path)

@app.get("/data/pool")
def list_pool():
    return data_engine.get_pool_stats()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
