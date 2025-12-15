import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import Vent from './components/Vent';
import SunkCost from './components/SunkCost';
import Breathing from './components/Breathing';
import Settings from './components/Settings';
import { useWebDAV } from './hooks/useWebDAV';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const webDAVHook = useWebDAV();
  const { data, saveData } = webDAVHook;

  const handleVent = () => {
    saveData({
      ...data,
      stats: {
        ...data.stats,
        ventCount: data.stats.ventCount + 1
      }
    });
  };

  const handleLetGo = () => {
    saveData({
      ...data,
      stats: {
        ...data.stats,
        letGoCount: data.stats.letGoCount + 1
      }
    });
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center">
      <header className="w-full max-w-2xl p-6 text-center relative">
        <button 
          onClick={() => setShowSettings(true)}
          className="absolute right-6 top-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-light tracking-widest mb-2">情绪零点</h1>
        <div className="text-sm text-gray-500">
          这里是私密空间，在这个页面发生的一切，都将留在这个页面。
        </div>
      </header>

      <main className="w-full max-w-2xl px-4 pb-12 flex flex-col gap-6">
        <Vent onVent={handleVent} data={data} />
        <SunkCost onLetGo={handleLetGo} data={data} />
        <Breathing />
      </main>

      <footer className="mt-auto py-6 text-center text-xs text-gray-600">
        <p>仅供个人情绪舒缓使用 | 数据仅保留在本地浏览器或您的私有网盘</p>
        <p className="mt-1">祝你内心平静</p>
      </footer>

      {showSettings && (
        <Settings 
          webDAVHook={webDAVHook} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
}

export default App;
