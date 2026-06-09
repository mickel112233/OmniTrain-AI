import React from 'react';
import { LayoutDashboard, Network as ProjectDiagram, Play, FlaskConical, Settings, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Architect', icon: ProjectDiagram },
    { id: 'training', label: 'Live Training', icon: Play },
    { id: 'datalab', label: 'Data Lab', icon: FlaskConical },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col p-6">
      <div className="flex items-center gap-3 mb-12 px-2">
        <Zap className="text-accent w-8 h-8 fill-accent" />
        <h1 className="text-xl font-bold tracking-tight">OMNITRAIN <span className="text-accent">PRO</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id
                ? "bg-accent/10 text-accent shadow-sm"
                : "text-text-mid hover:bg-white/5 hover:text-text-high"
            )}
          >
            <item.icon className={clsx(
              "w-5 h-5",
              activeTab === item.id ? "text-accent" : "text-text-low group-hover:text-text-mid"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-text-low uppercase font-bold tracking-widest">Version</span>
            <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">v1.0.0</span>
          </div>
          <p className="text-xs text-text-mid font-medium">Enterprise Edition</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
