
import asyncio
import httpx
import time
import os
import subprocess

async def verify_data_pool_workflow():
    async with httpx.AsyncClient(timeout=60.0) as client:
        # 1. Check Initial State
        hw = await client.get("http://127.0.0.1:8000/hardware")
        print(f"Initial Pool: {hw.json()['data_pool']}")

        # 2. Upload Multiple Data Samples
        for i in range(3):
            file_name = f"test_{i}.txt"
            with open(file_name, 'w') as f: f.write(f"This is test data sample {i} for AI training.")

            print(f"Uploading {file_name}...")
            resp = await client.post(f"http://127.0.0.1:8000/upload-data?file_path={file_name}")
            print(f"Upload Response: {resp.json()['status']}")
            os.remove(file_name)

        # 3. Check Updated Pool State
        hw = await client.get("http://127.0.0.1:8000/hardware")
        pool = hw.json()['data_pool']
        print(f"Updated Pool: {pool}")
        assert pool['file_count'] >= 3

        # 4. Start Training and check log for data detection
        print("Starting Text Training with Pool Data...")
        await client.post("http://127.0.0.1:8000/start-training", json={"type": "Text"})

        # Give it a moment to log
        await asyncio.sleep(2)
        await client.post("http://127.0.0.1:8000/stop-training")

if __name__ == "__main__":
    env = os.environ.copy()
    env["PYTHONPATH"] = os.getcwd()
    os.system("rm -rf project_data/*") # Reset for test
    proc = subprocess.Popen(["python3", "-m", "backend.main"], env=env)
    time.sleep(5)
    try:
        asyncio.run(verify_data_pool_workflow())
    finally:
        proc.terminate()
