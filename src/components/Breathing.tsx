import { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

export default function Breathing() {
  const [text, setText] = useState('吸气...');

  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => prev === '吸气...' ? '呼气...' : '吸气...');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <Leaf className="text-green-400 w-6 h-6" />
        <h2 className="text-xl font-light">锚定当下</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-24 h-24 bg-calm rounded-full flex items-center justify-center text-white text-lg animate-breathe shadow-[0_0_20px_rgba(77,148,255,0.4)]">
          {text}
        </div>
        
        <p className="mt-8 text-center text-gray-400 text-sm max-w-xs">
          当你感到失控时，跟随圆圈的节奏呼吸。<br/>
          不需要解决所有问题，只需要过好这一秒。
        </p>
      </div>
    </div>
  );
}
