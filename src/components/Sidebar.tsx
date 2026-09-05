import React from 'react';
import { 
  LayoutDashboard, Send, ListVideo, MousePointerClick, TerminalSquare, 
  Cloud, Settings, LogOut, CheckCircle2, AlertCircle
} from 'lucide-react';
import { ActiveTab, TelegramBot } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  bot: TelegramBot;
  onOpenConnectModal: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  bot,
  onOpenConnectModal,
  onLogout,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'داشبورد', icon: LayoutDashboard },
    { id: 'broadcast' as ActiveTab, label: 'پیام همگانی', icon: Send },
    { id: 'channels' as ActiveTab, label: 'مدیریت کانالها', icon: ListVideo },
    { id: 'button_builder' as ActiveTab, label: 'دکمهساز', icon: MousePointerClick },
    { id: 'commands' as ActiveTab, label: 'دستورات', icon: TerminalSquare },
    { id: 'cloud' as ActiveTab, label: 'انتشار ابری', icon: Cloud },
    { id: 'settings' as ActiveTab, label: 'تنظیمات', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] border-l border-slate-800 flex flex-col shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 p-6 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
          <Cloud size={18} className="text-white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-xl font-bold tracking-tight truncate">مدیریت هوشمند</h1>
          <span className="text-[11px] text-slate-400 block -mt-0.5">پنل ربات تلگرام</span>
        </div>
      </div>

      {/* Mini Bot Status pill in sidebar */}
      <div className="px-4 mb-4">
        <button
          onClick={onOpenConnectModal}
          className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
            bot.isConnected
              ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/60'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden text-right">
            {bot.isConnected ? (
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={15} className="text-amber-400 shrink-0" />
            )}
            <div className="truncate">
              <p className="font-semibold text-white truncate">
                {bot.isConnected ? `@${bot.username}` : 'رباتی متصل نیست'}
              </p>
              <p className="text-[10px] text-slate-400">
                {bot.isConnected ? 'وضعیت: آنلاین' : 'برای اتصال کلیک کنید'}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
            {bot.isConnected ? 'تغییر' : 'اتصال'}
          </span>
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all cursor-pointer text-right font-medium ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-6 mt-auto border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer text-right font-medium"
        >
          <LogOut size={20} />
          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>
  );
}
