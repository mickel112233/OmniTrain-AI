from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psutil
import GPUtil
from hardware_detector import HardwareDetector
from data_engine import DataEngine
from training_engine import TrainingEngine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = HardwareDetector()
data_engine = DataEngine()
training_engine = TrainingEngine()

class HardwareInfo(BaseModel):
    cpu_usage: float
    ram_total: float
    ram_available: float
    gpu_info: list

@app.get("/")
def read_root():
    return {"status": "OmniTrain AI Backend Running"}

@app.get("/hardware")
def get_hardware():
    specs = detector.get_specs()
    capability = detector.suggest_capability(specs)
    return {
        "specs": specs,
        "capability": capability,
        "cpu_usage": psutil.cpu_percent()
    }

@app.post("/upload-data")
async def upload_data(file_path: str):
    result = data_engine.process_file(file_path)
    return result

@app.post("/data-action")
async def data_action(action: str, file_path: str):
    if action == "remove_pii":
        return data_engine.remove_pii(file_path)
    elif action == "auto_crop":
        return data_engine.auto_crop_images(file_path)
    return {"error": "Action not found"}

@app.post("/start-training")
async def start_training(config: dict, background_tasks: BackgroundTasks):
    background_tasks.add_task(training_engine.start_training, config)
    return {"status": "Training started", "config": config}

@app.get("/training-status")
def get_training_status():
    return {
        "is_training": training_engine.is_training,
        "epoch": training_engine.current_epoch,
        "loss": round(training_engine.current_loss, 4)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
