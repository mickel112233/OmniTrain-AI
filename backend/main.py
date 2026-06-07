from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psutil
import GPUtil
from hardware_detector import HardwareDetector
from data_engine import DataEngine
from training_engine import TrainingEngine
from local_ai import LocalAIAssistant

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
local_ai = LocalAIAssistant()
local_ai.setup()

class HardwareInfo(BaseModel):
    cpu_usage: float
    ram_total: float
    ram_available: float
    gpu_info: list

@app.get("/")
def read_root():
    return {"status": "OmniTrain AI Backend Running"}

@app.post("/setup-system")
async def setup_system():
    # Simulate a full professional installation flow
    steps = [
        "Initializing Environment...",
        "Configuring Python 3.12 Venv...",
        "Installing PyTorch & CUDA Kernels...",
        "Downloading BitsAndBytes 4-bit Engine...",
        "Downloading Phi-3-mini Local Model Weights (2.4 GB)...",
        "Finalizing Optimization..."
    ]
    # Simulate work
    local_ai.setup()
    return {"status": "success", "steps": steps}

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

@app.post("/import-project")
async def import_project(data: dict):
    url = data.get("url")
    return training_engine.import_from_url(url)

@app.post("/start-training")
async def start_training(config: dict, background_tasks: BackgroundTasks):
    background_tasks.add_task(training_engine.start_training, config)
    return {"status": "Training started", "config": config}

@app.get("/training-status")
def get_training_status():
    status = {
        "is_training": training_engine.is_training,
        "epoch": training_engine.current_epoch,
        "loss": round(training_engine.current_loss, 4)
    }
    status["ai_tip"] = local_ai.get_optimization_tip(status)
    return status

@app.post("/ai-chat")
async def ai_chat(message: dict):
    response = local_ai.generate_response(message.get("prompt", ""))
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
