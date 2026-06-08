import React from 'react';
import { Layers, Plus, Save, RotateCcw } from 'lucide-react';

const NodeBuilder: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Pro Architect</h2>
          <p className="text-text-mid mt-2">Visual neural network designer and architecture builder.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-border text-text-high px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all">
            <RotateCcw className="w-4 h-4" /> RESET
          </button>
          <button className="bg-accent text-background px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 shadow-lg shadow-accent/20 transition-all active:scale-95">
            <Save className="w-4 h-4 fill-current" /> DEPLOY ARCHITECTURE
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-[600px]">
        <aside className="w-64 bg-card border border-border rounded-2xl p-6 space-y-6 overflow-y-auto">
          <h3 className="text-xs font-bold text-text-low uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4" /> Components
          </h3>

          <div className="space-y-3">
            {[
              { name: 'Linear Layer', desc: 'Fully connected dense layer' },
              { name: 'Transformer Block', desc: 'Attention-based sequential block' },
              { name: 'Convolution 2D', desc: 'Spatial feature extractor' },
              { name: 'ReLU Activation', desc: 'Non-linear rectifying unit' },
              { name: 'Dropout', desc: 'Regularization by deactivation' },
            ].map((node) => (
              <div
                key={node.name}
                className="bg-slate-900 border border-border p-4 rounded-xl cursor-grab hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all group active:cursor-grabbing"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold">{node.name}</p>
                  <Plus className="w-3 h-3 text-text-low group-hover:text-accent transition-colors" />
                </div>
                <p className="text-[10px] text-text-mid leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 bg-slate-950 border border-border rounded-2xl relative overflow-hidden group shadow-inner">
           {/* Visual Grid Background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none group-hover:scale-105 transition-transform duration-500">
             <div className="bg-accent/10 p-4 rounded-full inline-block mb-4">
               <Plus className="w-8 h-8 text-accent animate-pulse" />
             </div>
             <p className="text-text-mid font-medium">Drag components here to build architecture</p>
             <p className="text-text-low text-xs mt-2 italic">Connect nodes by dragging ports</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NodeBuilder;
