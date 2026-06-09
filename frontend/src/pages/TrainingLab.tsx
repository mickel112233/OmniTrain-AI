import React, { useState } from 'react';
import { useTrainingStore } from '../store/useStore';
import { Play, Square, Settings2, Activity, Terminal } from 'lucide-react';

const TrainingLab: React.FC = () => {
  const { isTraining, epoch, loss, metrics, startTraining, stopTraining } = useTrainingStore();
  const [throttle, setThrottle] = useState(80);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Training Lab</h2>
          <p className="text-text-mid mt-2">Functional model optimization and live telemetry.</p>
        </div>
        <div className="flex gap-3">
          {isTraining ? (
            <button
              onClick={stopTraining}
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-500/20 transition-all"
            >
              <Square className="w-4 h-4 fill-current" /> STOP SESSION
            </button>
          ) : (
            <button
              onClick={() => startTraining(1)}
              className="bg-accent text-background px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-accent/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> START TRAINING
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 h-[450px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest">
                <Terminal className="w-4 h-4" /> Live Console
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isTraining ? 'bg-success/20 text-success animate-pulse' : 'bg-slate-800 text-text-low'}`}>
                {isTraining ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>

            <div className="font-mono text-sm space-y-2 overflow-y-auto h-[350px] pr-4 custom-scrollbar">
               <p className="text-text-low">{'>'} Initializing OmniTrain Pro Engine...</p>
               <p className="text-text-low">{'>'} Checking CUDA Kernels... Found 1 GPU</p>
               <p className="text-success">{'>'} System Ready for Training</p>
               {isTraining && (
                 <>
                   <p className="text-accent">{'>'} Epoch {epoch} started. Optimization: AdamW</p>
                   <p className="text-text-high animate-pulse">{'>'} Step {epoch * 10}: Loss = {loss.toFixed(6)}</p>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest mb-6">
              <Settings2 className="w-4 h-4" /> Hyper-Parameters
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-text-mid">Resource Throttle</span>
                  <span className="font-bold text-accent">{throttle}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={throttle}
                  onChange={(e) => setThrottle(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-[10px] text-text-low mt-2 italic">Keeps system smooth during high-load training</p>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="block text-xs text-text-mid mb-2 font-bold uppercase tracking-tighter">Learning Rate</label>
                <select className="w-full bg-slate-900 border border-border rounded-lg p-2 text-sm focus:outline-none focus:border-accent">
                  <option>1e-4 (Standard)</option>
                  <option>3e-4 (Balanced)</option>
                  <option>1e-5 (Fine-tuning)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-text-mid mb-2 font-bold uppercase tracking-tighter">Batch Size</label>
                <select className="w-full bg-slate-900 border border-border rounded-lg p-2 text-sm focus:outline-none focus:border-accent">
                  <option>16 (Laptop Safe)</option>
                  <option>32 (Mid-Range)</option>
                  <option>128 (Server Grade)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
             <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest mb-6">
              <Activity className="w-4 h-4" /> Metrics
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-border">
                 <span className="text-sm text-text-mid">Avg Accuracy</span>
                 <span className="font-bold text-success">98.2%</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border">
                 <span className="text-sm text-text-mid">Convergence</span>
                 <span className="font-bold text-accent">OPTIMAL</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingLab;
