# OmniTrain AI Architecture

## Overview
OmniTrain AI is a universal training studio designed to run on desktop (Electron) with a powerful Python backend.

## Structure
- `app/`: Electron frontend (HTML/JS)
- `backend/`: FastAPI Python server
  - `modules/`: Specialized training modules (text, image, 3d, minecraft)
  - `core/`: Core training engine logic
  - `data/`: Universal data engine and cleaners
- `scripts/`: Installation and hardware detection scripts

## Communication
The frontend communicates with the backend via REST API (FastAPI).

## Key Components
1. **Hardware Detector**: Scans specs to suggest model sizes.
2. **Universal Data Engine**: Pipeline for multi-format data cleaning.
3. **Smart Throttle**: Dynamically adjusts resource usage.
4. **Cloud Bridge**: Optional cloud GPU integration.
