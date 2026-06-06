import unittest
from backend.hardware_detector import HardwareDetector
from backend.data_engine import DataEngine
from backend.training_engine import TrainingEngine
from backend.cloud_bridge import CloudBridge
import os

class TestOmniTrainBackend(unittest.TestCase):
    def test_hardware_detector(self):
        detector = HardwareDetector()
        specs = detector.get_specs()
        self.assertIn("cpu_count", specs)
        self.assertIn("ram_total_gb", specs)
        capability = detector.suggest_capability(specs)
        self.assertIsInstance(capability, str)

    def test_data_engine(self):
        engine = DataEngine()
        # Create a small dummy file
        with open("test_dummy.txt", "w") as f:
            f.write("Hello   World\nLine  2")

        result = engine.process_file("test_dummy.txt")
        self.assertEqual(result["status"], "Cleaned (Streaming)")
        # "Hello World" (11) + "Line 2" (6) = 17.
        self.assertEqual(result["length"], 17)

        os.remove("test_dummy.txt")

        result = engine.process_file("test.unknown")
        self.assertEqual(result["error"], "Format .unknown not supported")

    def test_training_engine(self):
        engine = TrainingEngine()
        self.assertFalse(engine.is_training)
        engine.stop_training()
        self.assertFalse(engine.is_training)
        # Should not crash if torch is missing
        res = engine.load_model("gpt2")
        if not engine.load_model.__globals__.get('torch'):
            self.assertIsNone(res)

    def test_cloud_bridge(self):
        bridge = CloudBridge()
        bridge.set_config("test_key", "test_url")
        self.assertEqual(bridge.api_key, "test_key")
        self.assertEqual(bridge.remote_url, "test_url")

if __name__ == "__main__":
    unittest.main()
