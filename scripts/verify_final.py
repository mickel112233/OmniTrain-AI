
import asyncio
import httpx
import time
import os
import subprocess
import socket

def is_port_open(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0

async def verify_universal_engine():
    async with httpx.AsyncClient(timeout=60.0) as client:
        for m_type in ["Tabular", "Text", "Image", "3D"]:
            print(f"\n--- Testing {m_type} Model Training ---")
            # In the new API, we use a fixed project_id 1 for fallback testing
            resp = await client.post("http://127.0.0.1:8000/training/start/1")
            print(f"Start: {resp.json()}")

            # Wait for some epochs
            await asyncio.sleep(2)
            resp = await client.get("http://127.0.0.1:8000/training/status")
            print(f"Status: {resp.json()}")

            await client.post("http://127.0.0.1:8000/training/stop")
            await asyncio.sleep(0.5)

        print("\nVerification Complete.")

if __name__ == "__main__":
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.join(os.getcwd(), "backend")
    proc = subprocess.Popen(["python3", "backend/main.py"], env=env)

    print("Waiting for backend to start...")
    for _ in range(30):
        if is_port_open("127.0.0.1", 8000):
            break
        time.sleep(1)
    else:
        print("Backend failed to start.")
        proc.terminate()
        exit(1)

    try:
        asyncio.run(verify_universal_engine())
    finally:
        proc.terminate()
