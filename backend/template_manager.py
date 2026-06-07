class TemplateManager:
    @staticmethod
    def get_template(name):
        templates = {
            "3d_city": {
                "name": "3D City Generator (NeRF-based)",
                "base_model": "stable-nerf-v1",
                "optimizer": "adamw",
                "lr": 2e-4,
                "quantization": "4bit",
                "description": "Optimized for urban environment synthesis from prompt data."
            },
            "map_maker": {
                "name": "Universal Map Maker (GAN)",
                "base_model": "satellite-gan-pro",
                "optimizer": "rmsprop",
                "lr": 1e-4,
                "quantization": "8bit",
                "description": "High-fidelity satellite texture and terrain generation."
            },
            "speech_pro": {
                "name": "Pro Speech Synthesis (XTTS)",
                "base_model": "xtts-v2-local",
                "optimizer": "adam",
                "lr": 5e-5,
                "quantization": "none",
                "description": "Zero-shot cross-lingual voice cloning and training."
            }
        }
        return templates.get(name, {"error": "Template not found"})

    @staticmethod
    def auto_pilot_config(specs):
        ram = specs.get("ram_total_gb", 8)
        gpu = len(specs.get("gpus", [])) > 0

        if gpu:
            return {"batch_size": 4, "precision": "bf16", "mode": "Performance"}
        elif ram >= 16:
            return {"batch_size": 2, "precision": "fp16", "mode": "Balanced"}
        else:
            return {"batch_size": 1, "precision": "int4", "mode": "Efficiency"}
