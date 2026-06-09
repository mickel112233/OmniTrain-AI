# OmniTrain AI Studio Pro

Production-grade Universal AI Training Studio for high-performance model development on any hardware.

## Architecture
- **Frontend**: React 18, TypeScript, Tailwind CSS, Zustand (State), React Flow (Architect).
- **Desktop**: Electron 28 (TypeScript), Secure IPC, Native Lifecycle Management.
- **Backend**: Python FastAPI, PyTorch (Engine), SQLite (Storage), SQLAlchemy.
- **Packaging**: Electron Builder (NSIS, DMG, AppImage).

## Features
- **Visual Architect**: Drag-and-drop neural network design.
- **Live Training Lab**: Real-time telemetry, loss/accuracy visualization, and resource throttling.
- **Universal Hardware Engine**: Automatic GPU/CPU selection with VRAM optimization.
- **Data Lab**: PII redaction, automated data cleaning, and local asset pooling.
- **Cloud Sync**: Optional hybrid training with Supabase integration.

## Installation & Setup
### Prerequisites
- Node.js 18+
- Python 3.9+
- CUDA Toolkit (Optional, for GPU acceleration)

### Local Development
1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the dev environment (Frontend + Backend + Electron):
   ```bash
   npm run dev
   ```

## Build Instructions
### Windows (.exe)
```bash
npm run build
```
The installer will be generated in the `dist/` folder.

## Troubleshooting
- **Backend Connection**: Ensure port 8000 is not blocked by a firewall.
- **GPU Not Found**: Verify `nvidia-smi` works and `GPUtil` is correctly installed.
- **Module Imports**: Always run from the root directory to ensure `PYTHONPATH` is set correctly.

## Architecture Guide
The app follows a **Local-First** design. The Electron main process manages the Python backend as a sidecar. All training happens locally in a separate thread to prevent UI freezing, with a "Smart Throttle" to keep the host system smooth.

---
© 2024 OmniTrain AI Studio. Commercial License.
