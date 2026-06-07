import psutil
import GPUtil
import platform
import os

class HardwareDetector:
    @staticmethod
    def get_specs():
        specs = {
            "os": platform.system(),
            "cpu_count": psutil.cpu_count(logical=True),
            "ram_total_gb": round(psutil.virtual_memory().total / (1024**3), 2),
            "ram_available_gb": round(psutil.virtual_memory().available / (1024**3), 2),
            "gpus": []
        }

        try:
            gpus = GPUtil.getGPUs()
            for gpu in gpus:
                specs["gpus"].append({
                    "name": gpu.name,
                    "vram_total_mb": gpu.memoryTotal,
                    "vram_free_mb": gpu.memoryFree
                })
        except Exception:
            pass

        return specs

    @staticmethod
    def suggest_capability(specs):
        vram = 0
        if specs["gpus"]:
            vram = specs["gpus"][0]["vram_total_mb"]

        ram = specs["ram_total_gb"]

        if vram >= 24000:
            return {"tier": "Advanced", "max_model_size": "30B+", "description": "Large Generative Models"}
        elif vram >= 8000:
            return {"tier": "Mid-Range", "max_model_size": "7B-13B", "description": "4-bit Optimizations Active"}
        elif ram >= 16:
            return {"tier": "Entry-Level", "max_model_size": "3B-7B", "description": "CPU-Optimized Fine-tuning"}
        else:
            return {"tier": "Low-Spec", "max_model_size": "Small Models", "description": "Basic fine-tuning and inference"}

if __name__ == "__main__":
    detector = HardwareDetector()
    specs = detector.get_specs()
    print(f"Specs: {specs}")
    print(f"Capability: {detector.suggest_capability(specs)}")
