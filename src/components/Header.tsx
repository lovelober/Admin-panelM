import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, Moon, Sun, Search, Check, Trash2, ExternalLink, X, User
} from 'lucide-react';
import { SystemNotification, ActiveTab } from '../types';

interface HeaderProps {
  notifications: SystemNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onNavigate: (tab: ActiveTab) => void;
  systemStatus: 'online' | 'busy' | 'maintenance';
}

export default function Header({
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onNavigate,
  systemStatus,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isDimMode, setIsDimMode] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === '' ? [] : [
    { title: 'ارسال پیام همگانی به همه کاربران', tab: 'broadcast' as ActiveTab, type: 'ویژگی' },
    { title: 'مدیریت کانال‌های تلگرام متصل', tab: 'channels' as ActiveTab, type: 'کانال‌ها' },
    { title: 'طراحی دکمه‌های شیشه‌ای (Inline)', tab: 'button_builder' as ActiveTab, type: 'ابزار' },
    { title: 'دستور /start و پیام خوش‌آمدگویی', tab: 'commands' as ActiveTab, type: 'دستورات' },
    { title: 'تنظیمات توکن و امنیت ادمین‌ها', tab: 'settings' as ActiveTab, type: 'تنظیمات' },
    { title: 'وضعیت وب‌هوک و سرور ابری', tab: 'cloud' as ActiveTab, type: 'سرور' },
  ].filter(item => item.title.includes(searchQuery.trim()));

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/50 backdrop-blur-sm z-30 shrink-0">
      {/* Right side (in RTL): User info & quick indicators */}
      <div className="flex items-center gap-5">
        {/* User Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-bold border border-slate-700 shadow-lg shadow-indigo-500/20 hover:border-indigo-400 transition-all cursor-pointer"
            title="پروفایل مدیر سیستم"
          >
            AD
          </button>

          {showProfile && (
            <div className="absolute top-12 right-0 w-64 bg-[#111827]/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-right animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">مدیر ارشد ربات</h4>
                  <span className="text-xs text-indigo-400">سطح دسترسی: SuperAdmin</span>
                </div>
              </div>
              <div className="py-2.5 text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>شناسه تلگرام:</span>
                  <span className="text-slate-200 font-mono">92837110</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>مدت جلسه کاری:</span>
                  <span className="text-slate-200">۱ ساعت و ۲۰ دقیقه</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>وضعیت اتصال:</span>
                  <span className="text-emerald-400">ایمن (2FA)</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowProfile(false);
                  onNavigate('settings');
                }}
                className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-700/50"
              >
                تنظیمات حساب کاربری
              </button>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3 text-slate-400">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors relative cursor-pointer"
              title="اعلان‌ها"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-[#111827]/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 text-right backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-white">اعلان‌های سیستم</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/30 font-medium">
                        {unreadCount} جدید
                      </span>
                    )}
                  </div>
                  <button
                    onClick={onClearNotifications}
                    className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>پاکسازی</span>
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 my-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">اعلان جدیدی وجود ندارد.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`py-2.5 px-2 cursor-pointer transition-colors hover:bg-slate-800/40 rounded-xl ${
                          !n.isRead ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-slate-200">{n.title}</h5>
                          <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Night / Moon Mode toggle */}
          <button
            onClick={() => setIsDimMode(!isDimMode)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isDimMode ? 'حالت تم روشن‌تر' : 'حالت تیره'}
          >
            {isDimMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-700 mx-1"></div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider">
            V 2.5.1
          </span>

          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            آنلاین
          </span>
        </div>
      </div>

      {/* Left side (in RTL): Search Bar with Geometric styling */}
      <div className="relative w-72">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی سریع..." 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors pr-10 text-slate-300 placeholder:text-slate-500"
        />
        <Search size={16} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={15} />
          </button>
        )}

        {/* Search results dropdown */}
        {searchQuery.trim() !== '' && (
          <div className="absolute top-11 left-0 w-full bg-[#111827] border border-slate-700 rounded-xl p-2 shadow-2xl z-50 text-right backdrop-blur-xl">
            <p className="text-[11px] text-slate-400 px-2 py-1">نتایج جستجو:</p>
            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-400 p-2 text-center">موردی یافت نشد.</p>
            ) : (
              searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.tab);
                    setSearchQuery('');
                  }}
                  className="w-full text-right p-2 rounded-lg hover:bg-indigo-600/20 hover:text-white text-slate-300 text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="truncate">{item.title}</span>
                  <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                    {item.type}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
