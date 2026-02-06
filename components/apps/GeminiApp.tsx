
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Layout, Terminal } from 'lucide-react';
import { getGeminiResponse } from '../../services/geminiService';
import { AppInstance } from '../../types';

interface GeminiAppProps {
  apps: AppInstance[];
}

const GeminiApp: React.FC<GeminiAppProps> = ({ apps }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello! I'm Nexus AI. I can see you have several apps open. How can I assist your workflow today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const context = `The user has ${apps.length} apps open: ${apps.map(a => a.title).join(', ')}. Current layout focus: ${apps.find(a => a.zIndex === Math.max(...apps.map(x => x.zIndex)))?.title || 'None'}.`;
    
    const response = await getGeminiResponse(userText, context);
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full bg-slate-50">
      <div className="flex-1 flex flex-col max-w-3xl mx-auto shadow-sm bg-white overflow-hidden my-4 rounded-3xl border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white shadow-lg shadow-purple-200">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-slate-800">Nexus AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded-full text-slate-500 border border-slate-100 uppercase tracking-tighter font-bold">Smart Context Enabled</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-100 text-purple-600 border border-purple-200'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="relative flex items-center gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your apps or workflow..."
              className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all pr-12"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md shadow-purple-100"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="mt-3 flex gap-4 overflow-x-auto pb-1 no-scrollbar">
            <button className="whitespace-nowrap flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-purple-600 transition-colors uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              <Layout size={12} /> Tile Windows
            </button>
            <button className="whitespace-nowrap flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-purple-600 transition-colors uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
              <Terminal size={12} /> System Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiApp;
