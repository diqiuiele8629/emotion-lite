import { useState } from 'react';
import { Wind, Send } from 'lucide-react';
import { UserData } from '../types';

interface SunkCostProps {
  onLetGo: () => void;
  data: UserData;
}

export default function SunkCost({ onLetGo, data }: SunkCostProps) {
  const [text, setText] = useState('');
  const [isFloating, setIsFloating] = useState(false);

  const handleLetGo = () => {
    if (!text.trim()) return;

    setIsFloating(true);
    
    setTimeout(() => {
      setText('');
      setIsFloating(false);
      onLetGo();
    }, 2000);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <Wind className="text-calm w-6 h-6" />
        <h2 className="text-xl font-light">放下沉没成本</h2>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        那件让你后悔的事，那个不再值得投入的人。写下它，然后让它飞走。
        <span className="ml-2 text-xs opacity-50">(已放下: {data.stats.letGoCount} 次)</span>
      </p>

      <div className="relative overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isFloating}
          placeholder={isFloating ? "它已经随风而去了..." : "我后悔投入了... 我很难过..."}
          className={`w-full h-24 bg-[#2c2c2c] border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-calm transition-all ${
            isFloating ? 'animate-float opacity-0' : 'opacity-100'
          }`}
        />
      </div>

      <button
        onClick={handleLetGo}
        disabled={isFloating || !text.trim()}
        className="w-full mt-4 bg-calm hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        放手，让它离开
      </button>
    </div>
  );
}
