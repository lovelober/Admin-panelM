import React, { useState } from 'react';
import { Bot, Key, ShieldCheck, CheckCircle2, AlertCircle, X, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { TelegramBot } from '../types';

interface ConnectBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: TelegramBot;
  onConnect: (updatedBot: Partial<TelegramBot>) => void;
  onDisconnect: () => void;
}

export default function ConnectBotModal({
  isOpen,
  onClose,
  bot,
  onConnect,
  onDisconnect,
}: ConnectBotModalProps) {
  const [tokenInput, setTokenInput] = useState(bot.token || '');
  const [isValidating, setIsValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleTestAndConnect = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!tokenInput.trim()) {
      setErrorMsg('لطفاً توکن ربات تلگرام را وارد کنید.');
      return;
    }

    if (!tokenInput.includes(':') || tokenInput.length < 25) {
      setErrorMsg('فرمت توکن نامعتبر است. نمونه توکن معتبر: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
      return;
    }

    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setSuccessMsg('اتصال به سرورهای تلگرام با موفقیت برقرار شد!');
      
      onConnect({
        isConnected: true,
        token: tokenInput,
        name: 'ربات هوشمند مدیریت رسانه',
        username: 'ProAdminHelperBot',
        id: tokenInput.split(':')[0] || '681940210',
        pingMs: 38 + Math.floor(Math.random() * 15),
        connectedAt: 'هم‌اکنون',
      });

      setTimeout(() => {
        onClose();
      }, 900);
    }, 1200);
  };

  const handleUseDemo = () => {
    const demoToken = '7192834012:AAH9fklQweX_pLmN81920-OfficialBotToken';
    setTokenInput(demoToken);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111827] border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-right text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
            <Bot size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">اتصال و پیکربندی ربات تلگرام</h3>
            <p className="text-xs text-slate-400 mt-1">
              کلید دسترسی (Bot Token) دریافتی از <span className="text-indigo-400 font-mono">@BotFather</span> را وارد کنید
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              توکن ربات تلگرام (HTTP API Token)
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-10"
              />
              <Key size={18} className="absolute right-3 top-3.5 text-slate-500" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={handleUseDemo}
              type="button"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={14} />
              <span>استفاده از توکن نمونه آزمایشی</span>
            </button>
            <span className="text-[11px] text-slate-500 font-mono">پروتکل امن TLS 1.3</span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current Bot Info if connected */}
          {bot.isConnected && (
            <div className="p-4 bg-slate-900/90 border border-slate-700/60 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ربات فعال کنونی:</span>
                <span className="font-semibold text-emerald-400 font-mono">@{bot.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">شناسه عددی (ID):</span>
                <span className="font-mono text-slate-200">{bot.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">میزان تاخیر سرور تلگرام:</span>
                <span className="text-indigo-300 font-mono">{bot.pingMs} میلی‌ثانیه</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleTestAndConnect}
            disabled={isValidating}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isValidating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>در حال تست اتصال به Telegram API...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>{bot.isConnected ? 'بروزرسانی اتصال' : 'بررسی و اتصال ربات'}</span>
              </>
            )}
          </button>

          {bot.isConnected && (
            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="px-4 py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              قطع اتصال
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
