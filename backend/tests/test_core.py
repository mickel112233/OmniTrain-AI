import unittest
import os
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from hardware_detector import HardwareDetector
from data_engine import DataEngine
from training_engine import TrainingEngine

class TestOmniTrainBackend(unittest.TestCase):
    def test_hardware_detector(self):
        detector = HardwareDetector()
        specs = detector.get_specs()
        self.assertIn("ram_total_gb", specs)
        self.assertIsInstance(specs["gpus"], list)

    def test_data_engine_sanitization(self):
        engine = DataEngine()
        res = engine.process_file("non_existent.txt")
        self.assertEqual(res["error"], "File not found or invalid path")

    def test_training_engine_lifecycle(self):
        engine = TrainingEngine()
        self.assertFalse(engine.is_training)
        # Test with a transformer node as well
        engine.start_training({"nodes": {"nodes": [{"type": "Linear"}, {"type": "Transformer"}]}})
        status = engine.get_status()
        self.assertFalse(status["is_training"])
        self.assertEqual(status["epoch"], 20)
        self.assertLess(status["loss"], 2.0)

if __name__ == "__main__":
    unittest.main()
