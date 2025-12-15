import { useState, useEffect } from 'react';
import { createClient, AuthType } from 'webdav';
import { UserData, DEFAULT_DATA } from '../types';

const STORAGE_KEY = 'emotion_lite_data';
const WEBDAV_CONFIG_KEY = 'emotion_lite_webdav_config';

export interface WebDAVConfig {
  url: string;
  username: string;
  password: string;
  enabled: boolean;
}

export const useWebDAV = () => {
  const [data, setData] = useState<UserData>(DEFAULT_DATA);
  const [config, setConfig] = useState<WebDAVConfig>({
    url: '',
    username: '',
    password: '',
    enabled: false
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // 初始化加载
  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        setData(JSON.parse(localData));
      } catch (e) {
        console.error('Failed to parse local data', e);
      }
    }

    const localConfig = localStorage.getItem(WEBDAV_CONFIG_KEY);
    if (localConfig) {
      try {
        setConfig(JSON.parse(localConfig));
      } catch (e) {
        console.error('Failed to parse webdav config', e);
      }
    }
  }, []);

  // 保存数据到本地
  const saveData = (newData: UserData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    // 如果启用了同步，尝试自动同步
    if (config.enabled) {
      syncToCloud(newData);
    }
  };

  // 保存配置
  const saveConfig = (newConfig: WebDAVConfig) => {
    setConfig(newConfig);
    localStorage.setItem(WEBDAV_CONFIG_KEY, JSON.stringify(newConfig));
  };

  // 同步到云端
  const syncToCloud = async (currentData: UserData = data) => {
    if (!config.enabled || !config.url || !config.username) return;

    setSyncStatus('syncing');
    try {
      const client = createClient(config.url, {
        username: config.username,
        password: config.password,
        authType: AuthType.Password
      });

      // 1. 读取云端数据（用于合并）
      let cloudData = null;
      if (await client.exists('/emotion-data.json')) {
        const content = await client.getFileContents('/emotion-data.json', { format: 'text' });
        cloudData = JSON.parse(content as string);
      }

      // 2. 简单的合并策略：取数值较大的
      const mergedData: UserData = cloudData ? {
        stats: {
          ventCount: Math.max(currentData.stats.ventCount, cloudData.stats.ventCount),
          letGoCount: Math.max(currentData.stats.letGoCount, cloudData.stats.letGoCount),
          lastVisit: new Date().toISOString()
        },
        settings: { ...currentData.settings, ...cloudData.settings } // 偏向保留本地或云端皆可，这里简化处理
      } : currentData;

      // 3. 写回云端
      await client.putFileContents('/emotion-data.json', JSON.stringify(mergedData, null, 2));
      
      // 4. 更新本地
      setData(mergedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
      
      setSyncStatus('success');
      setLastSyncTime(new Date().toLocaleTimeString());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('WebDAV Sync Error:', error);
      setSyncStatus('error');
    }
  };

  // 从云端拉取
  const pullFromCloud = async () => {
     if (!config.enabled || !config.url || !config.username) return;
     setSyncStatus('syncing');
     try {
        const client = createClient(config.url, {
            username: config.username,
            password: config.password,
            authType: AuthType.Password
        });

        if (await client.exists('/emotion-data.json')) {
            const content = await client.getFileContents('/emotion-data.json', { format: 'text' });
            const cloudData = JSON.parse(content as string);
            setData(cloudData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
            setSyncStatus('success');
            setLastSyncTime(new Date().toLocaleTimeString());
        }
        setTimeout(() => setSyncStatus('idle'), 2000);
     } catch (error) {
        console.error('WebDAV Pull Error:', error);
        setSyncStatus('error');
     }
  };

  return {
    data,
    saveData,
    config,
    saveConfig,
    syncToCloud,
    pullFromCloud,
    syncStatus,
    lastSyncTime
  };
};
