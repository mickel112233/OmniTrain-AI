import React, { useEffect } from 'react';
import { useSystemStore, useTrainingStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NodeBuilder from './pages/NodeBuilder';
import TrainingLab from './pages/TrainingLab';
import DataLab from './pages/DataLab';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { fetchSpecs, fetchLoad } = useSystemStore();
  const { fetchStatus } = useTrainingStore();

  useEffect(() => {
    fetchSpecs();
    const interval = setInterval(() => {
      fetchLoad();
      fetchStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-background text-text-high overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'builder' && <NodeBuilder />}
          {activeTab === 'training' && <TrainingLab />}
          {activeTab === 'datalab' && <DataLab />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
};

export default App;
