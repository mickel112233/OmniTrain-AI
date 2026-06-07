import unittest
import os
from backend.hardware_detector import HardwareDetector
from backend.data_engine import DataEngine
from backend.training_engine import TrainingEngine

class TestOmniTrainBackend(unittest.TestCase):
    def test_hardware_detector(self):
        detector = HardwareDetector()
        specs = detector.get_specs()
        self.assertIn("ram_total_gb", specs)
        self.assertIsInstance(specs["gpus"], list)

        capability = detector.suggest_capability(specs)
        self.assertIn("max_model_size", capability)

    def test_data_engine(self):
        engine = DataEngine()
        # Create a small dummy file
        with open("test_dummy.txt", "w") as f:
            f.write("Hello   World\nLine  2\nEmail: test@example.com")

        result = engine.process_file("test_dummy.txt")
        self.assertEqual(result["status"], "Text Cleaning Complete")
        self.assertTrue(os.path.exists("test_dummy.txt.cleaned"))

        redact_res = engine.remove_pii("test_dummy.txt")
        self.assertEqual(redact_res["status"], "PII Redacted")
        with open("test_dummy.txt.redacted", "r") as f:
            self.assertIn("[EMAIL]", f.read())

        os.remove("test_dummy.txt")
        os.remove("test_dummy.txt.cleaned")
        os.remove("test_dummy.txt.redacted")

    def test_training_engine(self):
        engine = TrainingEngine()
        self.assertFalse(engine.is_training)
        engine.stop_training()
        self.assertFalse(engine.is_training)

        # Test start training
        engine.start_training({"mode": "test"})
        self.assertFalse(engine.is_training) # Training finishes in the same thread in this test
        self.assertGreater(engine.current_epoch, 0)

if __name__ == "__main__":
    unittest.main()
