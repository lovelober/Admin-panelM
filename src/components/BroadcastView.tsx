import React, { useState } from 'react';
import { 
  Send, Users, Radio, MessageSquare, Image, Paperclip, 
  Eye, CheckCircle2, Clock, Play, RotateCcw, AlertTriangle, 
  Sparkles, Check, ChevronDown, ListFilter, CornerDownRight
} from 'lucide-react';
import { BroadcastLog, ButtonRow } from '../types';

interface BroadcastViewProps {
  broadcasts: BroadcastLog[];
  buttonRows: ButtonRow[];
  onAddBroadcast: (newBc: BroadcastLog) => void;
}

export default function BroadcastView({
  broadcasts,
  buttonRows,
  onAddBroadcast,
}: BroadcastViewProps) {
  const [targetType, setTargetType] = useState<'all' | 'channels' | 'users'>('all');
  const [messageText, setMessageText] = useState(
    'سلام دوستان عزیز! 👋\nجشنواره ویژه پاییزی ما با تخفیف ۵۰٪ روی تمامی خدمات آغاز شد.\nبرای دریافت اطلاعات بیشتر روی دکمه‌های زیر کلیک کنید.'
  );
  const [includeButtons, setIncludeButtons] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');
  const [hasImage, setHasImage] = useState(true);

  // Sending simulation states
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const totalRecipients = targetType === 'all' ? 24850 : targetType === 'channels' ? 4 : 1200;

  const handleStartBroadcast = () => {
    if (!messageText.trim()) return;
    setIsSending(true);
    setSendProgress(0);
    setSentCount(0);

    const interval = setInterval(() => {
      setSendProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSending(false);
          setShowSuccessToast(true);

          onAddBroadcast({
            id: `bc-${Date.now()}`,
            title: messageText.substring(0, 35) + '...',
            recipientsCount: totalRecipients,
            successCount: Math.floor(totalRecipients * 0.995),
            failedCount: Math.floor(totalRecipients * 0.005),
            status: 'completed',
            date: 'هم‌اکنون',
            target: targetType,
          });

          setTimeout(() => setShowSuccessToast(false), 4000);
          return 100;
        }
        const next = prev + 10;
        setSentCount(Math.floor((next / 100) * totalRecipients));
        return next;
      });
    }, 250);
  };

  const insertFormat = (tagStart: string, tagEnd: string = tagStart) => {
    setMessageText(prev => prev + ` ${tagStart}متن نمونه${tagEnd} `);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send size={22} className="text-indigo-400" />
            <span>ارسال پیام همگانی (Broadcast)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ارسال سریع و زمان‌بندی شده پیام به کلیه کاربران یا کانال‌های متصل با قابلیت دکمه‌های شیشه‌ای
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
            محدودیت تلگرام: ۳۰ پیام در ثانیه (رعایت خودکار Anti-Flood)
          </span>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-emerald-300 text-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span>پیام همگانی با موفقیت به تمامی مخاطبان ارسال شد!</span>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-xs text-emerald-400 hover:underline">
            بستن
          </button>
        </div>
      )}

      {/* Main Grid: Form + Telegram Phone Simulator Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (8 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5 bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
          
          {/* 1. Target Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              ۱. انتخاب مخاطبان هدف
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTargetType('all')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  targetType === 'all'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <Users size={18} className="mx-auto mb-1 text-indigo-400" />
                <span className="text-xs block">همه کاربران ربات</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">۲۴,۸۵۰ نفر</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('channels')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  targetType === 'channels'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <Radio size={18} className="mx-auto mb-1 text-purple-400" />
                <span className="text-xs block">کانال‌های متصل</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">۴ کانال رسمی</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('users')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  targetType === 'users'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <MessageSquare size={18} className="mx-auto mb-1 text-emerald-400" />
                <span className="text-xs block">کاربران ممتاز (VIP)</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">۱,۲۰۰ نفر</span>
              </button>
            </div>
          </div>

          {/* 2. Message Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                ۲. متن پیام ارسالی (پشتیبانی از Markdown تلگرام)
              </label>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => insertFormat('**', '**')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 font-bold cursor-pointer transition-colors"
                  title="پررنگ (Bold)"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('_', '_')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 italic cursor-pointer transition-colors"
                  title="کج (Italic)"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('`', '`')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 font-mono text-[11px] cursor-pointer transition-colors"
                  title="کد (Monospace)"
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('||', '||')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 text-[10px] cursor-pointer transition-colors"
                  title="اسپویلر (Spoiler)"
                >
                  مخفی
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="متن مورد نظر خود را اینجا بنویسید..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>تعداد کاراکتر: {messageText.length}</span>
              <span>حداکثر ظرفیت: ۴۰۹۶ کاراکتر</span>
            </div>
          </div>

          {/* 3. Media Attachment */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image size={18} className="text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">افزودن عکس به بالای پیام</span>
              </div>
              <input
                type="checkbox"
                checked={hasImage}
                onChange={(e) => setHasImage(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {hasImage && (
              <div className="pt-2">
                <input
                  type="text"
                  dir="ltr"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* 4. Attach Buttons Toggle */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">پیوست دکمه‌های شیشه‌ای تعریف‌شده</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                (استفاده از ۳ سطر دکمه‌های طراحی شده در بخش دکمه‌ساز)
              </span>
            </div>
            <input
              type="checkbox"
              checked={includeButtons}
              onChange={(e) => setIncludeButtons(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              onClick={handleStartBroadcast}
              disabled={isSending || !messageText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send size={18} />
              <span>ارسال سراسری به {totalRecipients.toLocaleString('fa-IR')} گیرنده</span>
            </button>
          </div>

          {/* Sending Progress Bar Simulation */}
          {isSending && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                  در حال ارسال به کاربران تلگرام...
                </span>
                <span className="font-mono text-white">{sendProgress}٪</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-l from-indigo-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${sendProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>ارسال شده: {sentCount.toLocaleString('fa-IR')} از {totalRecipients.toLocaleString('fa-IR')}</span>
                <span>سرعت: ~۴۸۰ پیام/ثانیه</span>
              </div>
            </div>
          )}

        </div>

        {/* Right Preview: Telegram Mobile Phone Mockup (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm bg-[#17212b] border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
            {/* Phone Top Bar */}
            <div className="bg-[#242f3d] px-4 py-3 flex items-center justify-between text-white text-xs border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
                  🤖
                </div>
                <div>
                  <h4 className="font-bold text-xs">ProAdminHelperBot</h4>
                  <span className="text-[10px] text-indigo-300">bot</span>
                </div>
              </div>
              <span className="text-[10px] bg-[#17212b] px-2 py-0.5 rounded-full text-slate-400">پیش‌نمایش زنده</span>
            </div>

            {/* Telegram Chat Bubble Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1621]">
              <div className="flex flex-col items-start max-w-[92%] bg-[#182533] rounded-2xl rounded-tr-sm p-3.5 shadow-md border border-slate-700/40 text-right">
                
                {/* Photo if enabled */}
                {hasImage && imageUrl && (
                  <div className="w-full mb-3 rounded-xl overflow-hidden bg-slate-800 h-36">
                    <img 
                      src={imageUrl} 
                      alt="Telegram Attachment" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Message body */}
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {messageText || 'متن پیام در اینجا نمایش داده می‌شود...'}
                </p>

                {/* Time & status indicator */}
                <div className="w-full flex justify-end items-center gap-1 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>۱۲:۴۵</span>
                  <Check size={12} className="text-indigo-400" />
                </div>
              </div>

              {/* Inline Buttons Preview */}
              {includeButtons && buttonRows.length > 0 && (
                <div className="w-[92%] space-y-1.5">
                  {buttonRows.map((row) => (
                    <div key={row.id} className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${row.buttons.length}, minmax(0, 1fr))` }}>
                      {row.buttons.map((btn) => (
                        <button
                          key={btn.id}
                          type="button"
                          className="bg-[#2b5278] hover:bg-[#34628f] text-white py-2 px-2 rounded-xl text-center text-[11px] font-medium shadow-sm transition-colors truncate"
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Bottom Footer */}
            <div className="bg-[#242f3d] p-3 text-center text-[11px] text-slate-400 border-t border-slate-700/50">
              نمای دقیق نحوه نمایش پیام در اپلیکیشن تلگرام
            </div>
          </div>
        </div>

      </div>

      {/* Broadcast History Table */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={16} className="text-indigo-400" />
          <span>تاریخچه کمپین‌ها و پیام‌های ارسالی اخیر</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="py-2.5 px-3">عنوان / متن پیام</th>
                <th className="py-2.5 px-3">مخاطبان هدف</th>
                <th className="py-2.5 px-3">تعداد کل</th>
                <th className="py-2.5 px-3">ارسال موفق</th>
                <th className="py-2.5 px-3">وضعیت</th>
                <th className="py-2.5 px-3">تاریخ ارسال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {broadcasts.map((bc) => (
                <tr key={bc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-200 max-w-xs truncate">{bc.title}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {bc.target === 'all' ? 'همه کاربران' : bc.target === 'channels' ? 'کانال‌ها' : 'کاربران ممتاز'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{bc.recipientsCount.toLocaleString('fa-IR')}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">{bc.successCount.toLocaleString('fa-IR')}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                      تکمیل شده
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{bc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
