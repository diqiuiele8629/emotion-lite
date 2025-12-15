import { useState } from 'react';
import { Settings as SettingsIcon, Cloud, Save, RefreshCw, X } from 'lucide-react';
import { useWebDAV } from '../hooks/useWebDAV';

interface SettingsProps {
  webDAVHook: ReturnType<typeof useWebDAV>;
  onClose: () => void;
}

export default function Settings({ webDAVHook, onClose }: SettingsProps) {
  const { config, saveConfig, syncToCloud, pullFromCloud, syncStatus, lastSyncTime } = webDAVHook;
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    saveConfig(localConfig);
    // 尝试立即同步一次验证
    if (localConfig.enabled) {
        // 这里只是保存配置，实际同步由用户点击或自动触发
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <SettingsIcon className="text-gray-300 w-6 h-6" />
            <h2 className="text-xl font-bold">设置与同步</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <Cloud className="w-4 h-4 text-calm" />
                WebDAV 同步 (坚果云等)
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={localConfig.enabled}
                  onChange={e => setLocalConfig({...localConfig, enabled: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-calm rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-calm"></div>
              </label>
            </div>

            {localConfig.enabled && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">服务器地址 (URL)</label>
                  <input
                    type="text"
                    value={localConfig.url}
                    onChange={e => setLocalConfig({...localConfig, url: e.target.value})}
                    placeholder="https://dav.jianguoyun.com/dav/"
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-calm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">账号 / 邮箱</label>
                  <input
                    type="text"
                    value={localConfig.username}
                    onChange={e => setLocalConfig({...localConfig, username: e.target.value})}
                    placeholder="example@email.com"
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-calm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">应用密码 (非登录密码)</label>
                  <input
                    type="password"
                    value={localConfig.password}
                    onChange={e => setLocalConfig({...localConfig, password: e.target.value})}
                    placeholder="应用专用密码"
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-calm focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">推荐使用坚果云：安全设置 &rarr; 第三方应用管理 &rarr; 生成密码</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              保存配置
            </button>
            
            {localConfig.enabled && (
                <>
                <button
                onClick={() => syncToCloud()}
                disabled={syncStatus === 'syncing'}
                className="flex-1 bg-calm hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                {syncStatus === 'syncing' ? '同步中...' : '立即同步'}
                </button>
                 <button
                 onClick={() => pullFromCloud()}
                 disabled={syncStatus === 'syncing'}
                 className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                 >
                 <Cloud className="w-4 h-4" />
                 拉取
                 </button>
                 </>
            )}
          </div>
          
          {syncStatus === 'success' && <p className="text-green-500 text-xs text-center">同步成功</p>}
          {syncStatus === 'error' && <p className="text-red-500 text-xs text-center">同步失败，请检查配置</p>}
          {lastSyncTime && <p className="text-gray-600 text-xs text-center">上次同步: {lastSyncTime}</p>}

        </div>
      </div>
    </div>
  );
}
