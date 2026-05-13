import React, { useState } from 'react';
import { 
  User, 
  Smartphone, 
  Monitor, 
  Bell, 
  Shield, 
  CircleUser, 
  ChevronRight, 
  Moon, 
  Sun,
  Layout,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Palette
} from 'lucide-react';

const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  const menuItems = [
    { id: 'profile', label: '个人中心', icon: User, color: 'text-blue-500' },
    { id: 'appearance', label: '外观与主题', icon: Palette, color: 'text-indigo-500' },
    { id: 'multitasking', label: '多任务偏好', icon: Layout, color: 'text-emerald-500' },
    { id: 'notifications', label: '通知设置', icon: Bell, color: 'text-amber-500' },
    { id: 'security', label: '安全与隐私', icon: Shield, color: 'text-rose-500' },
  ];

  return (
    <div className="flex h-full bg-slate-50/50">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200/60 bg-white p-6 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <SettingsIcon size={20} />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">系统设置</h2>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={activeTab === item.id ? 'text-blue-500' : item.color} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {activeTab === item.id && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-slate-100">
           <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 transition-colors group">
             <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
             <span className="text-sm font-bold">退出登录</span>
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-10">
        <div className="max-w-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">个人中心</h1>
                <p className="text-slate-500 font-medium">管理您的个人资料及账号安全</p>
              </header>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 transition-all hover:shadow-xl hover:shadow-slate-200/20">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl"
                    />
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                       <HelpCircle size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">Tian Cheng Xi</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">tianchengxi354@gmail.com</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">关联手机号码</p>
                        <p className="text-sm font-bold text-slate-800">+86 138 **** 9527</p>
                      </div>
                    </div>
                    <button className="text-xs font-black text-blue-500 uppercase tracking-widest px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">修改</button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                        <CircleUser size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">账号状态</p>
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                           已实名认证
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">外观与主题</h1>
                <p className="text-slate-500 font-medium">定制您的 Nexus 系统个性化体验</p>
              </header>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">色彩模式</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: '浅色', icon: Sun, color: 'from-orange-50 to-amber-100' },
                    { id: 'dark', label: '深色', icon: Moon, color: 'from-slate-800 to-indigo-950' },
                    { id: 'auto', label: '自动', icon: Monitor, color: 'from-blue-50 to-indigo-100' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id as any)}
                      className={`relative aspect-[4/3] rounded-3xl p-4 flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                        theme === item.id 
                          ? 'border-blue-500 bg-blue-50/20 shadow-lg shadow-blue-500/10' 
                          : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md`}>
                        <item.icon size={24} className={item.id === 'dark' ? 'text-white' : 'text-slate-400'} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      {theme === item.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 mt-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">强调色</h3>
                <div className="flex gap-4">
                   {['#0873FF', '#FB719A', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
                     <button 
                       key={color}
                       className="w-10 h-10 rounded-full border-4 border-white shadow-lg transition-transform hover:scale-110" 
                       style={{ backgroundColor: color }}
                     />
                   ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'multitasking' || activeTab === 'notifications' || activeTab === 'security') && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                 <SettingsIcon size={40} className="animate-spin-slow" />
               </div>
               <h3 className="text-lg font-black text-slate-800 mb-2">更多设置正在开发中</h3>
               <p className="text-slate-400 text-sm max-w-xs font-medium">Nexus 系统持续进化中，此功能模块将在下个版本上线。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
