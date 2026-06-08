import React from 'react';
import { Shield, Cloud, Palette, Bell, HelpCircle } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold">Preferences</h2>
        <p className="text-text-mid mt-2">Configure environment and integration settings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest mb-6">
              <Shield className="w-4 h-4" /> Security & Privacy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Local Data Redaction</p>
                  <p className="text-[10px] text-text-low">Auto-strip PII before training pool injection</p>
                </div>
                <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between opacity-50 pointer-events-none">
                <div>
                  <p className="text-sm font-medium">Encrypted Checkpoints</p>
                  <p className="text-[10px] text-text-low">AES-256 for local model weights</p>
                </div>
                <div className="w-10 h-5 bg-slate-700 rounded-full relative" />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest mb-6">
              <Cloud className="w-4 h-4" /> Cloud Sync
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Supabase URL"
                className="w-full bg-slate-900 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent"
              />
              <input
                type="password"
                placeholder="API Key"
                className="w-full bg-slate-900 border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent"
              />
              <button className="w-full bg-white/5 border border-border py-2.5 rounded-xl font-bold text-xs hover:bg-white/10 transition-colors">
                CONNECT TO CLOUD
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest mb-6">
              <Palette className="w-4 h-4" /> Personalization
            </h3>
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-text-low uppercase mb-2">Theme Engine</label>
                 <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-background border-2 border-accent cursor-pointer" />
                   <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-transparent cursor-pointer" />
                   <div className="w-8 h-8 rounded-full bg-indigo-950 border-2 border-transparent cursor-pointer" />
                 </div>
               </div>
            </div>
          </section>

          <section className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="flex items-center gap-2 font-bold text-text-mid uppercase text-xs tracking-widest mb-6">
              <Bell className="w-4 h-4" /> Notifications
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Training Completion Alerts</p>
               <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
            </div>
          </section>

          <button className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
             FACTORY RESET APP
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-text-low pb-8">
        <div className="flex items-center gap-1 hover:text-text-mid cursor-pointer transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs">Documentation</span>
        </div>
        <span className="opacity-20">|</span>
        <span className="text-xs">© 2024 OmniTrain AI Pro</span>
      </div>
    </div>
  );
};

export default Settings;
