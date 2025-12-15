import { useState, useRef } from 'react';
import { Flame, Trash2 } from 'lucide-react';
import { UserData } from '../types';

const QUOTES = [
  "愤怒是火焰，烧掉杂质后，留给自己的是纯粹的力量。",
  "你已经宣泄了毒素。现在，这个瞬间是全新的。",
  "那些话已经消失在虚空中。你安全了。",
  "深呼吸。你比你的情绪更强大。",
  "过去的已经死去，现在的你正活着。",
  "不要让那些人租住在你的脑子里，把他们赶出去。",
  "沉没成本不是成本，那是成长的学费。不用退款，向前看。",
  "世界很吵，但此刻你的内心可以安静下来。"
];

interface VentProps {
  onVent: () => void;
  data: UserData;
}

export default function Vent({ onVent, data }: VentProps) {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isShattering, setIsShattering] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDestroy = () => {
    if (!text.trim()) {
      setFeedback("输入点什么吧，别憋在心里。");
      return;
    }

    setIsShattering(true);

    // 震动反馈 (Mobile)
    if (navigator.vibrate) navigator.vibrate(200);

    setTimeout(() => {
      setText('');
      setIsShattering(false);
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setFeedback("✨ " + randomQuote);
      onVent();
    }, 600);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg mb-8 transition-transform">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <Flame className="text-accent w-6 h-6" />
        <h2 className="text-xl font-light">情绪熔炉</h2>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        把你想骂的话、愤怒、委屈全部写在这里。系统不会记录，它们只存在于这一秒。
        <span className="ml-2 text-xs opacity-50">(已粉碎: {data.stats.ventCount} 次)</span>
      </p>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="去他X的... 我受够了..."
        className={`w-full h-32 bg-[#2c2c2c] border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-accent transition-all ${
          isShattering ? 'animate-shatter' : ''
        }`}
      />

      <button
        onClick={handleDestroy}
        disabled={isShattering}
        className="w-full mt-4 bg-accent hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
      >
        <Trash2 className="w-5 h-5" />
        彻底粉碎负能量
      </button>

      {feedback && (
        <div className="mt-4 text-center text-gray-400 italic text-sm animate-pulse">
          {feedback}
        </div>
      )}
    </div>
  );
}
