import React, { useState } from 'react';
import { 
  Bot, Zap, ShieldCheck, Activity, ArrowLeft, Users, Radio, MessageSquare, 
  MousePointerClick, Send, PlusCircle, TerminalSquare, ExternalLink, RefreshCw, 
  CheckCircle2, Clock, Play, Pause, ChevronLeft, Info, AlertCircle, Filter,
  TrendingUp, BarChart3, LineChart
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TelegramBot, BotLog, ActiveTab } from '../types';

type LogFilter = 'all' | 'info' | 'error' | 'user';

interface DashboardViewProps {
  bot: TelegramBot;
  logs: BotLog[];
  onOpenConnectModal: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onAddSampleLog: () => void;
  onClearLogs: () => void;
}

export default function DashboardView({
  bot,
  logs,
  onOpenConnectModal,
  onNavigate,
  onAddSampleLog,
  onClearLogs,
}: DashboardViewProps) {
  const [isLogLive, setIsLogLive] = useState(true);
  const [logFilter, setLogFilter] = useState<LogFilter>('all');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [chartMetric, setChartMetric] = useState<'all' | 'messages' | 'clicks'>('all');

  // If bot is not connected yet, render the exact welcome box with Geometric Balance theme!
  if (!bot.isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
        {/* Glowing backdrop circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-2xl bg-[#111827]/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-10 text-center shadow-2xl relative z-10">
          
          <div className="w-20 h-20 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/30">
            <Bot size={42} className="text-white" />
          </div>

          <h2 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-l from-white via-slate-100 to-slate-400">
            خوش‌آمدید به مرکز فرماندهی
          </h2>
          
          <p className="text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto text-sm">
            برای مدیریت پیشرفته کانال‌ها، اتوماسیون پاسخگویی و مشاهده تحلیل‌های دقیق، همین حالا ربات تلگرامی خود را متصل کنید.
          </p>

          <div className="grid grid-cols-3 gap-5 mb-10">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-slate-700/50 transition-colors">
              <Zap size={26} className="text-[#fbbf24]" />
              <span className="text-xs font-semibold text-slate-200">سرعت آنی</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-slate-700/50 transition-colors">
              <ShieldCheck size={26} className="text-[#10b981]" />
              <span className="text-xs font-semibold text-slate-200">امنیت ارتقا یافته</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-slate-700/50 transition-colors">
              <Activity size={26} className="text-[#60a5fa]" />
              <span className="text-xs font-semibold text-slate-200">تحلیل داده‌ها</span>
            </div>
          </div>

          <button 
            onClick={onOpenConnectModal}
            className="bg-white text-slate-900 text-base font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2.5 mx-auto hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 group cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>اتصال ربات جدید</span>
          </button>

        </div>
      </div>
    );
  }

  // 7-day Activity Data for Recharts
  const weeklyActivityData = [
    { day: 'شنبه', fullDate: '۲۸ مرداد', messages: 2940, clicks: 1720, activeUsers: 1450 },
    { day: 'یکشنبه', fullDate: '۲۹ مرداد', messages: 3420, clicks: 2010, activeUsers: 1680 },
    { day: 'دوشنبه', fullDate: '۳۰ مرداد', messages: 3890, clicks: 2280, activeUsers: 1890 },
    { day: 'سه‌شنبه', fullDate: '۳۱ مرداد', messages: 3650, clicks: 2140, activeUsers: 1810 },
    { day: 'چهارشنبه', fullDate: '۱ شهریور', messages: 4520, clicks: 2890, activeUsers: 2240 },
    { day: 'پنج‌شنبه', fullDate: '۲ شهریور', messages: 5380, clicks: 3510, activeUsers: 2680 },
    { day: 'جمعه', fullDate: '۳ شهریور', messages: 4890, clicks: 3120, activeUsers: 2420 },
  ];

  const totalWeeklyMessages = weeklyActivityData.reduce((acc, curr) => acc + curr.messages, 0);
  const totalWeeklyClicks = weeklyActivityData.reduce((acc, curr) => acc + curr.clicks, 0);

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Bot Connected Header Banner */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Bot size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{bot.name}</h2>
              <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                @{bot.username}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>شناسه: <strong className="text-slate-300 font-mono">{bot.id}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={13} />
                وب‌هوک متصل ({bot.pingMs}ms)
              </span>
              <span>•</span>
              <span>زمان اتصال: {bot.connectedAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenConnectModal}
            className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
          >
            تنظیمات ربات
          </button>
          <a
            href={`https://t.me/${bot.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <span>مشاهده در تلگرام</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">کل کاربران ربات</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{bot.memberCount.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg font-mono border border-emerald-500/20">
              +۱۲.۴٪ این هفته
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">کاربران فعال ماهانه: ۲۱,۴۰۰</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">کانال‌های متصل</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Radio size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">۴ کانال</span>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
              همه آنلاین
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">مجموع ممبرهای کانال‌ها: ۳۰,۸۷۰</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">پیام‌های امروز</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">۱,۴۲۰</span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              ۱۰۰٪ پاسخ
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">میانگین سرعت پاسخ: ۰.۳ ثانیه</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">نرخ تعامل با دکمه‌ها</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <MousePointerClick size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">۶۸.۴٪</span>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              +۵.۲٪ تعامل
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">محبوب‌ترین دکمه: تعرفه‌ها و VIP</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => onNavigate('broadcast')}
          className="p-4 bg-[#111827]/80 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl flex items-center gap-3 text-right transition-all group cursor-pointer shadow-md backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
            <Send size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">ارسال پیام جدید</h4>
            <span className="text-[11px] text-slate-400">به همه اعضا یا کانال‌ها</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('channels')}
          className="p-4 bg-[#111827]/80 border border-slate-700/50 hover:border-purple-500/50 rounded-2xl flex items-center gap-3 text-right transition-all group cursor-pointer shadow-md backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
            <PlusCircle size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">افزودن کانال</h4>
            <span className="text-[11px] text-slate-400">اتصال کانال تلگرام</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('button_builder')}
          className="p-4 bg-[#111827]/80 border border-slate-700/50 hover:border-amber-500/50 rounded-2xl flex items-center gap-3 text-right transition-all group cursor-pointer shadow-md backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/30">
            <MousePointerClick size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">دکمه‌ساز شیشه‌ای</h4>
            <span className="text-[11px] text-slate-400">طراحی منوی زیر پیام</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('commands')}
          className="p-4 bg-[#111827]/80 border border-slate-700/50 hover:border-emerald-500/50 rounded-2xl flex items-center gap-3 text-right transition-all group cursor-pointer shadow-md backdrop-blur-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
            <TerminalSquare size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">مدیریت دستورات</h4>
            <span className="text-[11px] text-slate-400">تنظیم /start و دستورات</span>
          </div>
        </button>
      </div>

      {/* Charts & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Growth & Activity Chart (Recharts) */}
        <div className="lg:col-span-2 bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">روند رشد و تحلیل پیام‌های دریافتی (۷ روز گذشته)</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  <TrendingUp size={12} />
                  <span>+۱۸.۴٪ رشد</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">تعداد پیام‌های ورودی به ربات و کلیک روی دکمه‌های شیشه‌ای</p>
            </div>

            {/* Controls: Metric filter & Chart type switcher */}
            <div className="flex items-center gap-2">
              {/* Metric filter pills */}
              <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setChartMetric('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'all'
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  همه
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('messages')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'messages'
                      ? 'bg-indigo-600/30 text-indigo-300 font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  پیام‌ها
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('clicks')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'clicks'
                      ? 'bg-emerald-600/30 text-emerald-300 font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  کلیک‌ها
                </button>
              </div>

              {/* Chart type toggle */}
              <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setChartType('area')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    chartType === 'area'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="نمودار خطی/پوششی"
                >
                  <LineChart size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    chartType === 'bar'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="نمودار ستونی"
                >
                  <BarChart3 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Recharts Canvas */}
          <div className="w-full h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartColorMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="chartColorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => Number(val).toLocaleString('fa-IR')} 
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0]?.payload;
                        return (
                          <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-right font-sans text-xs min-w-[190px]">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                              <span className="font-bold text-white text-sm">{label}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{item?.fullDate}</span>
                            </div>
                            <div className="space-y-1.5">
                              {payload.map((entry: any, index: number) => {
                                const labelMap: Record<string, string> = {
                                  messages: 'پیام‌های دریافتی',
                                  clicks: 'کلیک دکمه‌ها',
                                };
                                return (
                                  <div key={`tip-${index}`} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                                      <span className="text-slate-300 text-[11px]">{labelMap[entry.dataKey] || entry.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-white text-xs">
                                      {Number(entry.value).toLocaleString('fa-IR')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {(chartMetric === 'all' || chartMetric === 'messages') && (
                    <Area 
                      type="monotone" 
                      dataKey="messages" 
                      name="پیام‌های دریافتی" 
                      stroke="#6366f1" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#chartColorMessages)" 
                    />
                  )}
                  {(chartMetric === 'all' || chartMetric === 'clicks') && (
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      name="کلیک دکمه‌ها" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#chartColorClicks)" 
                    />
                  )}
                </AreaChart>
              ) : (
                <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => Number(val).toLocaleString('fa-IR')} 
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0]?.payload;
                        return (
                          <div className="bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-right font-sans text-xs min-w-[190px]">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                              <span className="font-bold text-white text-sm">{label}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{item?.fullDate}</span>
                            </div>
                            <div className="space-y-1.5">
                              {payload.map((entry: any, index: number) => {
                                const labelMap: Record<string, string> = {
                                  messages: 'پیام‌های دریافتی',
                                  clicks: 'کلیک دکمه‌ها',
                                };
                                return (
                                  <div key={`tip-${index}`} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                                      <span className="text-slate-300 text-[11px]">{labelMap[entry.dataKey] || entry.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-white text-xs">
                                      {Number(entry.value).toLocaleString('fa-IR')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {(chartMetric === 'all' || chartMetric === 'messages') && (
                    <Bar 
                      dataKey="messages" 
                      name="پیام‌های دریافتی" 
                      fill="#6366f1" 
                      radius={[6, 6, 0, 0]} 
                    />
                  )}
                  {(chartMetric === 'all' || chartMetric === 'clicks') && (
                    <Bar 
                      dataKey="clicks" 
                      name="کلیک دکمه‌ها" 
                      fill="#10b981" 
                      radius={[6, 6, 0, 0]} 
                    />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Footer Metrics */}
          <div className="grid grid-cols-3 gap-3 text-[11px] pt-4 mt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 block mb-0.5">مجموع پیام‌های ۷ روز:</span>
              <span className="text-indigo-300 font-bold font-mono text-xs">
                {totalWeeklyMessages.toLocaleString('fa-IR')} پیام
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">کلیک منوها و دکمه‌ها:</span>
              <span className="text-emerald-400 font-bold font-mono text-xs">
                {totalWeeklyClicks.toLocaleString('fa-IR')} کلیک
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">اوج فعالیت هفتگی:</span>
              <span className="text-amber-400 font-bold text-xs">
                پنج‌شنبه (۵,۳۸۰ پیام)
              </span>
            </div>
          </div>
        </div>

        {/* Live Bot Events Stream */}
        <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-6 flex flex-col shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">لاگ رویدادهای زنده</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onAddSampleLog}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="تست ارسال لاگ جدید"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={onClearLogs}
                className="text-[11px] text-slate-400 hover:text-red-400 px-2 py-0.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                پاکسازی
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-3 overflow-x-auto">
            <button
              onClick={() => setLogFilter('all')}
              className={`flex-1 min-w-[62px] py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                logFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/70'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>همه</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                logFilter === 'all' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {logs.length}
              </span>
            </button>

            <button
              onClick={() => setLogFilter('info')}
              className={`flex-1 min-w-[72px] py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                logFilter === 'info'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info size={12} className={logFilter === 'info' ? 'text-indigo-400' : 'text-slate-500'} />
              <span>اطلاعات</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                logFilter === 'info' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {logs.filter((l) => l.type === 'info' || l.type === 'broadcast').length}
              </span>
            </button>

            <button
              onClick={() => setLogFilter('user')}
              className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                logFilter === 'user'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare size={12} className={logFilter === 'user' ? 'text-emerald-400' : 'text-slate-500'} />
              <span>پیام کاربر</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                logFilter === 'user' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {logs.filter((l) => l.type === 'message' || l.type === 'command').length}
              </span>
            </button>

            <button
              onClick={() => setLogFilter('error')}
              className={`flex-1 min-w-[62px] py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                logFilter === 'error'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertCircle size={12} className={logFilter === 'error' ? 'text-rose-400' : 'text-slate-500'} />
              <span>خطا</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                logFilter === 'error' ? 'bg-rose-500/30 text-rose-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {logs.filter((l) => l.type === 'error').length}
              </span>
            </button>
          </div>

          <div className="flex-1 max-h-60 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px]">
            {logs.filter((log) => {
              if (logFilter === 'all') return true;
              if (logFilter === 'info') return log.type === 'info' || log.type === 'broadcast';
              if (logFilter === 'error') return log.type === 'error';
              if (logFilter === 'user') return log.type === 'message' || log.type === 'command';
              return true;
            }).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 mb-2">
                  {logs.length === 0 
                    ? 'لاگی ثبت نشده است.' 
                    : 'هیچ لاگی در این دسته‌بندی یافت نشد.'}
                </p>
                {logs.length > 0 && logFilter !== 'all' && (
                  <button
                    onClick={() => setLogFilter('all')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-sans cursor-pointer"
                  >
                    مشاهده همه لاگ‌ها
                  </button>
                )}
              </div>
            ) : (
              logs
                .filter((log) => {
                  if (logFilter === 'all') return true;
                  if (logFilter === 'info') return log.type === 'info' || log.type === 'broadcast';
                  if (logFilter === 'error') return log.type === 'error';
                  if (logFilter === 'user') return log.type === 'message' || log.type === 'command';
                  return true;
                })
                .map((log) => {
                  let badgeLabel = 'اطلاعات';
                  let badgeClass = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
                  let icon = <Info size={11} className="shrink-0" />;

                  if (log.type === 'error') {
                    badgeLabel = 'خطا';
                    badgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
                    icon = <AlertCircle size={11} className="shrink-0" />;
                  } else if (log.type === 'message' || log.type === 'command') {
                    badgeLabel = log.type === 'command' ? 'دستور' : 'پیام کاربر';
                    badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                    icon = <MessageSquare size={11} className="shrink-0" />;
                  } else if (log.type === 'broadcast') {
                    badgeLabel = 'همگانی';
                    badgeClass = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
                    icon = <Send size={11} className="shrink-0" />;
                  }

                  return (
                    <div key={log.id} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl leading-relaxed">
                      <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold border ${badgeClass}`}>
                          {icon}
                          <span>{badgeLabel}</span>
                        </span>
                        <span className="font-mono text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs">{log.text}</p>
                      {log.user && (
                        <span className="text-[10px] text-slate-500 font-mono mt-1 block">کاربر: @{log.user}</span>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
