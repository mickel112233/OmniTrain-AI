import importlib.util
import os
import psutil

def check_dependencies():
    deps = {
        "torch": "PyTorch (Core ML Engine)",
        "transformers": "HuggingFace Transformers",
        "accelerate": "HuggingFace Accelerate",
        "numpy": "NumPy (Math Operations)",
        "fastapi": "FastAPI (Backend API)",
        "psutil": "PSUtil (Hardware Detection)",
        "uvicorn": "Uvicorn (Server)"
    }

    results = []
    for pkg, desc in deps.items():
        found = importlib.util.find_spec(pkg) is not None
        results.append({
            "package": pkg,
            "description": desc,
            "status": "INSTALLED" if found else "MISSING"
        })
    return results

def get_system_readiness():
    # Real checks
    cpu_cores = psutil.cpu_count()
    ram_gb = round(psutil.virtual_memory().total / (1024**3), 1)

    return {
        "cpu_cores": cpu_cores,
        "ram_gb": ram_gb,
        "is_capable": ram_gb >= 4
    }
