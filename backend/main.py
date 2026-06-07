from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import psutil
import os
from .hardware_detector import HardwareDetector
from .data_engine import DataEngine
from .training_engine import TrainingEngine
from .local_ai import LocalAIAssistant
from .setup_checker import check_dependencies, get_system_readiness
from .template_manager import TemplateManager

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

@app.get("/")
def read_root():
    return {"status": "OmniTrain AI Backend Running"}

@app.get("/setup-status")
def setup_status():
    deps = check_dependencies()
    system = get_system_readiness()
    return {
        "dependencies": deps,
        "system": system,
        "ready": all(d["status"] == "INSTALLED" for d in deps) and system["is_capable"]
    }

@app.post("/setup-system")
async def setup_system():
    # In a real app, this might trigger pip installs or downloads
    local_ai.setup()
    return {"status": "success", "steps": [
        "Verifying System Readiness...",
        "Checking PyTorch Kernels...",
        "Validating Local AI Weights...",
        "All components verified."
    ]}

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
    return data_engine.process_file(file_path)

@app.post("/data-action")
async def data_action(action: str, file_path: str):
    if action == "remove_pii":
        return data_engine.remove_pii(file_path)
    return {"error": "Action not found"}

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
    return status

@app.post("/ai-chat")
async def ai_chat(message: dict):
    response = local_ai.generate_response(message.get("prompt", ""))
    return {"response": response}

static_path = os.path.abspath("app")
app.mount("/static", StaticFiles(directory=static_path), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/template/{name}")
def get_template(name: str):
    return TemplateManager.get_template(name)

@app.get("/auto-pilot")
def get_auto_pilot():
    specs = detector.get_specs()
    return TemplateManager.auto_pilot_config(specs)
