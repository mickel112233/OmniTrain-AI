import os
import subprocess
import sys

def install_dependencies():
    print("Checking system requirements...")
    # This would check for python, pip, etc.

    print("Installing backend requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])

    print("Setup complete.")

if __name__ == "__main__":
    install_dependencies()
