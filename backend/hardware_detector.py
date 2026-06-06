import psutil
import GPUtil
import platform
import speedtest
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
            return "Advanced (LLMs up to 30B+, Large Generative Models)"
        elif vram >= 8000:
            return "Mid-Range (LLMs up to 7B-13B with 4-bit, Stable Diffusion)"
        elif ram >= 16:
            return "Entry-Level / CPU-Optimized (Small Models, Fine-tuning 3B-7B)"
        else:
            return "Low-Spec (Extremely small models, basic fine-tuning)"

    @staticmethod
    def get_internet_speed():
        try:
            st = speedtest.Speedtest()
            st.get_best_server()
            download_speed = st.download() / 1_000_000 # Mbps
            return round(download_speed, 2)
        except:
            return "Unknown"

if __name__ == "__main__":
    detector = HardwareDetector()
    specs = detector.get_specs()
    print(f"Specs: {specs}")
    print(f"Capability: {detector.suggest_capability(specs)}")
