import { create } from 'zustand';
import axios from 'axios';

interface SystemState {
  specs: any;
  load: { cpu_percent: number; ram_percent: number };
  fetchSpecs: () => Promise<void>;
  fetchLoad: () => Promise<void>;
}

export const useSystemStore = create<SystemState>((set) => ({
  specs: null,
  load: { cpu_percent: 0, ram_percent: 0 },
  fetchSpecs: async () => {
    const res = await axios.get('http://127.0.0.1:8000/system/specs');
    set({ specs: res.data });
  },
  fetchLoad: async () => {
    const res = await axios.get('http://127.0.0.1:8000/system/load');
    set({ load: res.data });
  }
}));

interface TrainingState {
  isTraining: boolean;
  epoch: number;
  loss: number;
  metrics: { loss: number[]; accuracy: number[] };
  status: string;
  fetchStatus: () => Promise<void>;
  startTraining: (projectId: number) => Promise<void>;
  stopTraining: () => Promise<void>;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  isTraining: false,
  epoch: 0,
  loss: 0,
  metrics: { loss: [], accuracy: [] },
  status: 'IDLE',
  fetchStatus: async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/training/status');
      set({
        isTraining: res.data.is_training,
        epoch: res.data.epoch,
        loss: res.data.loss,
        metrics: res.data.metrics,
        status: res.data.is_training ? 'TRAINING' : 'IDLE'
      });
    } catch (e) {
      console.error("Status fetch failed");
    }
  },
  startTraining: async (projectId) => {
    await axios.post(`http://127.0.0.1:8000/training/start/${projectId}`);
    set({ status: 'INITIATING', isTraining: true });
  },
  stopTraining: async () => {
    await axios.post('http://127.0.0.1:8000/training/stop');
    set({ status: 'STOPPING', isTraining: false });
  }
}));
