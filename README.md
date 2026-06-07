# OmniTrain AI: Ultra-Pro Universal Training Studio

OmniTrain AI is a professional-grade, modular desktop application designed to make AI model training, fine-tuning, and architecture design accessible to everyone—from beginners to pro engineers. It is specifically optimized to run high-level models on **low-spec hardware** using advanced quantization and "Smart Throttle" technology.

## 🚀 Key Features

### 1. Universal Model Support
Train any kind of AI model:
- **Text & LLMs:** Fine-tune Llama, DeepSeek, or Phi models using LoRA/QLoRA.
- **Generative & Image:** Support for GANs and Diffusion models.
- **3D & Specialized:** Integrated templates for 3D City Generation and Minecraft `.litematica` data training.

### 2. Pro Node Architect
A visual "Lego-style" builder for custom AI architectures.
- Drag-and-drop layers (Linear, Transformer, Conv2D).
- Visual bezier-curve connectivity.
- Real-time parameter configuration.

### 3. Universal Data Engine
- **Auto-Cleaning:** Automatically normalizes whitespace and removes noise.
- **PII Redaction:** Built-in AI-powered privacy protection.
- **Multi-Format:** Support for text, images, and specialized 3D formats.

### 4. Local AI Copilot
Powered by a local **Phi-3-mini** engine, the built-in assistant provides:
- Real-time training optimization tips.
- Architecture design advice.
- Token-free, 100% private local troubleshooting.

### 5. Smart Performance Management
- **4-bit Quantization:** Run 7B+ models on laptops with as little as 8GB RAM.
- **Smart Throttle:** Automatically adjusts resource usage to keep your system smooth while training in the background.
- **Cloud Bridge:** One-click toggle to offload heavy training to cloud GPUs.

## 💻 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB+ |
| **GPU** | Entry-level (4GB VRAM) | NVIDIA RTX 3060+ |
| **Storage** | 5 GB SSD | 20 GB SSD |
| **OS** | Windows 10+, macOS, Linux | Windows 11 / Linux |

*Note: OmniTrain AI includes a "Smart-Check" module that automatically suggests model sizes based on your detected specs.*

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/omnitrain-ai.git
   cd omnitrain-ai
   ```

2. **Run the Setup Suite:**
   Launch the app and follow the **Setup Agreement** screen. OmniTrain will automatically:
   - Configure a portable Python 3.12 environment.
   - Install PyTorch, CUDA Kernels, and optimization libraries.
   - Download the local AI assistant weights (~2.4 GB).

3. **Start Training:**
   Use the **Project Launcher** to select a template or start a blank project.

## 🏗️ Architecture

- **Frontend:** Electron.js with Glassmorphism UI.
- **Backend:** FastAPI (Python 3.12) managing the core training engine.
- **Local AI:** Integrated GGUF/Transformers-based Phi-3 engine.
- **Training Engine:** Custom PyTorch wrapper with BitsAndBytes and PEFT (LoRA) support.

---

*Built for the future of decentralized AI training.*
