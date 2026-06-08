
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
            resp = await client.post("http://127.0.0.1:8000/start-training", json={"type": m_type})
            print(f"Start: {resp.json()}")

            # Wait for some epochs
            await asyncio.sleep(2)
            resp = await client.get("http://127.0.0.1:8000/training-status")
            print(f"Status: {resp.json()}")

            await client.post("http://127.0.0.1:8000/stop-training")
            await asyncio.sleep(0.5)

        # Final Inference Test
        print("\n--- Testing Tabular Inference ---")
        await client.post("http://127.0.0.1:8000/start-training", json={"type": "Tabular"})
        await asyncio.sleep(1)
        test_data = [0.5] * 10
        resp = await client.post("http://127.0.0.1:8000/test-model", json={"data": test_data})
        print(f"Inference Result: {resp.json()}")

if __name__ == "__main__":
    env = os.environ.copy()
    env["PYTHONPATH"] = os.getcwd()
    proc = subprocess.Popen(["python3", "-m", "backend.main"], env=env)

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
