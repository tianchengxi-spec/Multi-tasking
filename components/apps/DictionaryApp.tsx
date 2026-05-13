import React, { useState } from 'react';
import { Search, Volume2, Bookmark, History, ChevronRight, Star } from 'lucide-react';

interface DictionaryAppProps {
  state?: string;
}

const DictionaryApp: React.FC<DictionaryAppProps> = ({ state }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'favorite'>('translate');

  const isSmall = state === 'floating' || (state && state.includes('split-') && (state.includes('top') || state.includes('bottom')));
  
  const recentSearches = ['Multitasking', 'Pass', 'Paradigm', 'Cognitive', 'Efficiency'];
  
  const sampleResult = {
    word: 'Pass',
    phonetic: '/pæs/',
    definition: 'v. 通过，经过；传递；n. 通行证；及格',
    examples: [
      'The bill was passed by a large majority.',
      'You need a valid pass to enter the building.'
    ]
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Header */}
      <div className={`${isSmall ? 'p-2' : 'p-6'} bg-orange-50/50 border-b border-orange-100 transition-all`}>
        <div className={`relative ${isSmall ? 'mb-2' : 'mb-6'}`}>
          <Search size={isSmall ? 14 : 18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isSmall ? "搜词..." : "搜词、译句、百科..."}
            className={`w-full bg-white border border-orange-200 rounded-2xl ${isSmall ? 'py-1.5 pl-9 pr-3 text-[10px]' : 'py-4 pl-12 pr-6 text-slate-800'} font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-sm`}
          />
        </div>

        <div className="flex gap-2">
          {['translate', 'history', 'favorite'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${isSmall ? 'px-2 py-1' : 'px-4 py-2'} rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
              }`}
            >
              {tab === 'translate' ? '查词' : tab === 'history' ? '历史' : '收藏'}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isSmall ? 'p-3' : 'p-6'} space-y-4`}>
        {activeTab === 'translate' && (
          <>
            {/* Word Detail */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`flex items-center justify-between ${isSmall ? 'mb-2' : 'mb-4'}`}>
                <div>
                  <h1 className={`${isSmall ? 'text-xl' : 'text-4xl'} font-black text-slate-900 tracking-tight transition-all`}>{sampleResult.word}</h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`${isSmall ? 'text-[10px]' : 'text-orange-500'} font-mono font-bold text-orange-500`}>{sampleResult.phonetic}</span>
                    <button className="p-1 hover:bg-orange-100 rounded-full text-orange-400 transition-colors">
                      <Volume2 size={isSmall ? 12 : 16} />
                    </button>
                  </div>
                </div>
                <button className={`${isSmall ? 'w-8 h-8' : 'w-12 h-12'} bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:text-orange-500 transition-all`}>
                  <Star size={isSmall ? 16 : 20} />
                </button>
              </div>

              <div className={`${isSmall ? 'space-y-2' : 'space-y-4'}`}>
                <div className={`${isSmall ? 'p-3' : 'p-6'} bg-slate-50 rounded-2xl border border-slate-100 transition-all`}>
                  <p className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-slate-800 leading-relaxed`}>
                    {sampleResult.definition}
                  </p>
                </div>

                {!isSmall && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">例句库</h3>
                    {sampleResult.examples.map((ex, i) => (
                      <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                        <div className="w-1 h-auto bg-orange-200 rounded-full group-hover:bg-orange-400 transition-colors" />
                        <p className="text-sm font-medium text-slate-600 italic">"{ex}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Searches (Hidden on tiny height) */}
            {!isSmall && (
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近搜索</h3>
                  <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">清除</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((word) => (
                    <button key={word} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-600 transition-colors border border-slate-100/50">
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
           <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
               <History size={40} />
             </div>
             <h3 className="text-lg font-black text-slate-800 mb-2">暂无历史记录</h3>
             <p className="text-slate-400 text-sm max-w-xs font-medium">您的查词足迹将出现在这里</p>
          </div>
        )}

        {activeTab === 'favorite' && (
           <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
               <Bookmark size={40} />
             </div>
             <h3 className="text-lg font-black text-slate-800 mb-2">我的单词本</h3>
             <p className="text-slate-400 text-sm max-w-xs font-medium">收藏您感兴趣的单词，随时通过工具环进行复习</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryApp;
