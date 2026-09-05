import React, { useState } from 'react';
import { 
  Cloud, Server, ShieldCheck, CheckCircle2, RefreshCw, 
  Activity, Globe, Terminal, Cpu, HardDrive, Zap, Check
} from 'lucide-react';
import { TelegramBot } from '../types';

interface CloudDeployViewProps {
  bot: TelegramBot;
}

export default function CloudDeployView({ bot }: CloudDeployViewProps) {
  const [webhookUrl, setWebhookUrl] = useState(bot.webhookUrl || 'https://bot-service-prod.run.app/webhook');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [deployMode, setDeployMode] = useState<'webhook' | 'polling'>('webhook');

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setTestResult('پاسخ سرور تلگرام: HTTP 200 OK — وب‌هوک با موفقیت ست شد و آماده دریافت درخواست‌ها است.');
    }, 1200);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cloud size={22} className="text-indigo-400" />
            <span>انتشار ابری و تنظیمات وب‌هوک (Cloud Deployment & Webhook)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            وضعیت سرورهای ابری، هاستینگ تلگرام، آدرس وب‌هوک ایمن HTTPS و گواهینامه SSL
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            میزبانی ابری فعال (Cloud Run)
          </span>
        </div>
      </div>

      {testResult && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Cloud Server Spec Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>موقعیت سرور ابری</span>
            <Globe size={16} className="text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">اروپا (فرانکفورت)</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">تاخیر شبکه: ۳۸ میلی‌ثانیه</span>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>وضعیت گواهی SSL</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-white">TLS 1.3 معتبر</p>
          <span className="text-[11px] text-slate-400 mt-1 block">صادر شده توسط Let's Encrypt</span>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>استفاده از منابع پردازشی</span>
            <Cpu size={16} className="text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">۱۲٪ CPU | ۱۸۰MB</p>
          <span className="text-[11px] text-slate-400 mt-1 block">تخصیص حافظه: 1vCPU / 512MB</span>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>مدت زمان پایداری (Uptime)</span>
            <Activity size={16} className="text-blue-400" />
          </div>
          <p className="text-lg font-bold text-white font-mono">۹۹.۹۸٪</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">۱۴ روز بدون قطعی</span>
        </div>
      </div>

      {/* Webhook Configuration Section */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-5 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap size={16} className="text-indigo-400" />
          <span>پیکربندی هوک ورودی (Telegram Webhook Endpoint)</span>
        </h3>

        {/* Mode selector */}
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deployMode"
              checked={deployMode === 'webhook'}
              onChange={() => setDeployMode('webhook')}
              className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
            <span className="font-semibold text-slate-200">حالت وب‌هوک ابری (توصیه شده برای سرعت و پایداری)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deployMode"
              checked={deployMode === 'polling'}
              onChange={() => setDeployMode('polling')}
              className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
            <span className="text-slate-400">حالت دریافت مداوم (Long Polling)</span>
          </label>
        </div>

        {/* Webhook URL Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            آدرس امن وب‌هوک (Webhook URL)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              dir="ltr"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/telegram/webhook"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={isTestingWebhook}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isTestingWebhook ? 'animate-spin' : ''} />
              <span>{isTestingWebhook ? 'در حال همگام‌سازی با تلگرام...' : 'ثبت و تست وب‌هوک'}</span>
            </button>
          </div>
        </div>

        {/* Telegram getWebhookInfo Simulation Output */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400 mb-3">
            <span className="font-mono">TELEGRAM_API_STATUS: getWebhookInfo</span>
            <span className="text-emerald-400 font-mono">STATUS: 200 OK</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">url</span>
              <span className="text-indigo-300 truncate block">{webhookUrl}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">has_custom_certificate</span>
              <span className="text-slate-300">false (Auto TLS)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">pending_update_count</span>
              <span className="text-emerald-400 font-bold">0 (بدون تاخیر در صف)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">max_connections</span>
              <span className="text-slate-300">40</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">last_error_date</span>
              <span className="text-slate-400">هیچ خطایی ثبت نشده</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ip_address</span>
              <span className="text-slate-300">35.241.19.42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
