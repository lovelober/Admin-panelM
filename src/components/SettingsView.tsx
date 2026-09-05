import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, Key, Users, Bell, 
  Download, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2, Eye, EyeOff
} from 'lucide-react';
import { TelegramBot } from '../types';

interface SettingsViewProps {
  bot: TelegramBot;
  onUpdateBot: (updated: Partial<TelegramBot>) => void;
}

export default function SettingsView({ bot, onUpdateBot }: SettingsViewProps) {
  const [showToken, setShowToken] = useState(false);
  const [tokenInput, setTokenInput] = useState(bot.token);
  const [antiFloodLimit, setAntiFloodLimit] = useState(25);
  const [enableAutoBackup, setEnableAutoBackup] = useState(true);
  const [notifyOnErrors, setNotifyOnErrors] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin whitelist
  const [adminIds, setAdminIds] = useState<string[]>(['92837110', '109283741']);
  const [newAdminId, setNewAdminId] = useState('');

  const handleAddAdmin = () => {
    if (!newAdminId.trim() || adminIds.includes(newAdminId.trim())) return;
    setAdminIds([...adminIds, newAdminId.trim()]);
    setNewAdminId('');
  };

  const handleRemoveAdmin = (id: string) => {
    setAdminIds(adminIds.filter(a => a !== id));
  };

  const handleSaveSettings = () => {
    onUpdateBot({ token: tokenInput });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const data = {
      botInfo: bot,
      adminIds,
      antiFloodLimit,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bot-adminpanel-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings size={22} className="text-indigo-400" />
            <span>تنظیمات عمومی و امنیت پنل مدیریت</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پیکربندی امنیت، توکن دسترسی، لیست ادمین‌های مجاز و نسخه‌های پشتیبان
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <CheckCircle2 size={16} />
          <span>ذخیره تغییرات</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>تنظیمات با موفقیت ذخیره گردید.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Bot Token & Access */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key size={16} className="text-indigo-400" />
            <span>توکن احراز هویت ربات (Bot Token)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            توکن محرمانه تلگرام برای دسترسی به متدهای Telegram Bot API. این توکن را هرگز در اختیار افراد غیرمجاز قرار ندهید.
          </p>

          <div>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                dir="ltr"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span>شناسه ربات: <strong className="font-mono text-slate-200">{bot.id}</strong></span>
            <span className="text-emerald-400 font-medium">وضعیت: معتبر و فعال</span>
          </div>
        </div>

        {/* 2. Admin Whitelist */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-purple-400" />
            <span>لیست ادمین‌های مجاز (Admin Whitelist)</span>
          </h3>
          <p className="text-xs text-slate-400">
            تنها کاربرانی که شناسه‌ی عددی آنها در این لیست باشد اجازه دستورات مدیریتی را خواهند داشت.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              dir="ltr"
              value={newAdminId}
              onChange={(e) => setNewAdminId(e.target.value)}
              placeholder="شناسه عددی تلگرام (مثال: 92837110)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddAdmin}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-purple-600/30"
            >
              <Plus size={14} />
              <span>افزودن</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {adminIds.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span className="font-mono text-slate-200">{id}</span>
                  {id === '92837110' && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-medium">
                      مدیر کل (مالک)
                    </span>
                  )}
                </div>
                {id !== '92837110' && (
                  <button
                    onClick={() => handleRemoveAdmin(id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Anti-Flood & Limits */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>تنظیمات ضد اسپم و Anti-Flood</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-2">
              <span>حداکثر پیام ارسالی در هر ثانیه:</span>
              <span className="font-mono text-emerald-400 font-bold">{antiFloodLimit} پیام/ثانیه</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={antiFloodLimit}
              onChange={(e) => setAntiFloodLimit(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              محدودیت پیش‌فرض تلگرام ۳۰ پیام در ثانیه است. انتخاب مقادیر زیر ۲۸ خطر بلاک شدن را به صفر می‌رساند.
            </span>
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-800/80 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">مسدودسازی خودکار کاربران در صورت ارسال اسپم</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 4. Backup and Export */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Download size={16} className="text-amber-400" />
              <span>پشتیبان‌گیری و خروجی اطلاعات</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              دانلود فایل نسخه پشتیبان شامل تمامی تنظیمات کانال‌ها، دکمه‌های شیشه‌ای، دستورات و پیکربندی ربات در قالب یک فایل استاندارد JSON.
            </p>
          </div>

          <div className="space-y-3 pt-3">
            <button
              onClick={handleExportBackup}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download size={15} className="text-amber-400" />
              <span>دانلود فایل پشتیبان (Backup JSON)</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              آخرین همگام‌سازی ابری: امروز ساعت ۲۱:۳۰
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
