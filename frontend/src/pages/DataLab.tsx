import React, { useState } from 'react';
import { Database, Plus, Search, Trash2, FileText, ImageIcon, HardDrive } from 'lucide-react';

const DataLab: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'customer_behavior_clean.csv', size: '1.2 MB', type: 'CSV' },
    { id: 2, name: 'product_images_subset.tar', size: '450 MB', type: 'RAW' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Data Lab</h2>
          <p className="text-text-mid mt-2">Manage datasets and training assets locally.</p>
        </div>
        <button className="bg-white/5 text-text-high border border-border px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
          <Plus className="w-4 h-4" /> ADD DATASET
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent/20 p-2 rounded-lg">
              <HardDrive className="text-accent w-5 h-5" />
            </div>
            <h3 className="font-bold">Local Pool</h3>
          </div>
          <p className="text-2xl font-bold">14.2 <span className="text-sm font-normal text-text-low">GB</span></p>
          <p className="text-xs text-text-mid mt-1">Available training capacity</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl">
           <div className="flex items-center gap-3 mb-4">
            <div className="bg-success/20 p-2 rounded-lg">
              <Database className="text-success w-5 h-5" />
            </div>
            <h3 className="font-bold">Active Sets</h3>
          </div>
          <p className="text-2xl font-bold">28 <span className="text-sm font-normal text-text-low">FILES</span></p>
          <p className="text-xs text-text-mid mt-1">Verified for training</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl">
           <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/5 p-2 rounded-lg">
              <Search className="text-text-mid w-5 h-5" />
            </div>
            <h3 className="font-bold">Sanitization</h3>
          </div>
          <p className="text-2xl font-bold text-success">READY</p>
          <p className="text-xs text-text-mid mt-1">Auto-clean active</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-bold">Dataset Repository</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-low" />
            <input
              type="text"
              placeholder="Filter assets..."
              className="bg-slate-900 border border-border rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent w-64"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-[10px] uppercase tracking-widest text-text-low font-bold">
              <th className="px-6 py-4">Asset Name</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Format</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.type === 'CSV' ? <FileText className="w-4 h-4 text-accent" /> : <ImageIcon className="w-4 h-4 text-success" />}
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-mid">{item.size}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-800 text-text-mid text-[10px] px-2 py-0.5 rounded font-bold uppercase">{item.type}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-text-low hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataLab;
