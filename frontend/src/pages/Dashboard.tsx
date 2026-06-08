import React from 'react';
import { useSystemStore, useTrainingStore } from '../store/useStore';
import { Cpu, Database, Gauge, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { specs, load } = useSystemStore();
  const { isTraining, epoch, loss } = useTrainingStore();

  const stats = [
    { label: 'CPU Usage', value: `${load.cpu_percent}%`, icon: Cpu, color: 'text-accent' },
    { label: 'RAM Available', value: `${specs?.memory.available_gb ?? '--'} GB`, icon: Database, color: 'text-success' },
    { label: 'Training Status', value: isTraining ? 'ACTIVE' : 'IDLE', icon: Activity, color: isTraining ? 'text-success' : 'text-text-low' },
    { label: 'Current Loss', value: loss.toFixed(4), icon: Gauge, color: 'text-accent' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold">System Dashboard</h2>
        <p className="text-text-mid mt-2">Real-time monitoring and hardware telemetry.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-accent/5 transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm text-text-low font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-6">GPU Accelerator</h3>
          {specs?.gpus.length > 0 ? (
            <div className="space-y-4">
              {specs.gpus.map((gpu: any) => (
                <div key={gpu.name} className="bg-white/5 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{gpu.name}</span>
                    <span className="text-accent text-sm font-bold">{gpu.vram_total_mb}MB VRAM</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-500"
                      style={{ width: `${100 - (gpu.vram_free_mb / gpu.vram_total_mb * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-low border-2 border-dashed border-border rounded-xl">
              <Cpu className="w-12 h-12 mb-4 opacity-20" />
              <p>No dedicated GPU detected</p>
              <p className="text-xs mt-1">Universal CPU Training Active</p>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 h-80">
          <h3 className="text-lg font-bold mb-6">Active Project Status</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-mid">Training Progress (Epoch {epoch}/100)</span>
                <span className="font-bold text-accent">{epoch}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: `${epoch}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-text-low uppercase font-bold tracking-tighter">Current Loss</p>
                <p className="text-lg font-mono font-bold text-accent">{loss.toFixed(6)}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] text-text-low uppercase font-bold tracking-tighter">Smoothness</p>
                <p className="text-lg font-bold text-success">OPTIMAL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
