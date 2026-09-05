import React, { useState } from 'react';
import { 
  ListVideo, Plus, CheckCircle2, ShieldCheck, ExternalLink, 
  Trash2, AlertTriangle, Send, RefreshCw, X, ShieldAlert, Users
} from 'lucide-react';
import { TelegramChannel } from '../types';

interface ChannelsViewProps {
  channels: TelegramChannel[];
  onAddChannel: (channel: TelegramChannel) => void;
  onRemoveChannel: (id: string) => void;
}

export default function ChannelsView({
  channels,
  onAddChannel,
  onRemoveChannel,
}: ChannelsViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [channelUsername, setChannelUsername] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [category, setCategory] = useState('عمومی');
  const [canPost, setCanPost] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelTitle || !channelUsername) return;

    const formattedUsername = channelUsername.startsWith('@') 
      ? channelUsername.slice(1) 
      : channelUsername;

    const newChan: TelegramChannel = {
      id: `-100${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      title: channelTitle,
      username: formattedUsername,
      members: Math.floor(1000 + Math.random() * 5000),
      category: category,
      canPost,
      canEdit,
      canDelete,
      status: 'active',
      lastPostDate: 'هم‌اکنون',
    };

    onAddChannel(newChan);
    setChannelTitle('');
    setChannelUsername('');
    setIsAddOpen(false);
  };

  const handleSendTestToChannel = (channel: TelegramChannel) => {
    setTestSuccessMessage(`پیام آزمایشی با موفقیت به کانال «${channel.title}» فرستاده شد.`);
    setTimeout(() => setTestSuccessMessage(''), 3500);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ListVideo size={22} className="text-indigo-400" />
            <span>مدیریت کانال‌ها و گروه‌های تلگرام</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            نظارت بر کانال‌های تحت مدیریت ربات، بررسی سطح دسترسی ادمین و ارسال خودکار پست‌ها
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن کانال جدید</span>
        </button>
      </div>

      {testSuccessMessage && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{testSuccessMessage}</span>
        </div>
      )}

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {channels.map((channel) => (
          <div 
            key={channel.id}
            className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg shadow-sm">
                    📢
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{channel.title}</h3>
                    <a
                      href={`https://t.me/${channel.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 font-mono hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      @{channel.username}
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-medium">
                  {channel.category}
                </span>
              </div>

              {/* Members and ID */}
              <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-y border-slate-800/80 my-3">
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-slate-500" />
                  اعضا: <strong className="text-white font-mono">{channel.members.toLocaleString('fa-IR')}</strong>
                </span>
                <span className="font-mono text-[11px] text-slate-500">ID: {channel.id}</span>
              </div>

              {/* Permissions */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[11px] text-slate-400 font-medium block">دسترسی‌های ربات در کانال:</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    channel.canPost ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700/40'
                  }`}>
                    <CheckCircle2 size={12} /> ارسال پست
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    channel.canEdit ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700/40'
                  }`}>
                    <CheckCircle2 size={12} /> ویرایش پست‌ها
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    channel.canDelete ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700/40'
                  }`}>
                    <CheckCircle2 size={12} /> حذف پیام‌ها
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500">آخرین فعالیت: {channel.lastPostDate}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendTestToChannel(channel)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="ارسال پست آزمایشی به این کانال"
                >
                  <Send size={13} />
                  <span>تست ارسال</span>
                </button>
                <button
                  onClick={() => onRemoveChannel(channel.id)}
                  className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                  title="حذف یا قطع اتصال کانال"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Channel Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-right text-white relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-6 left-6 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold mb-1">افزودن کانال تلگرام جدید</h3>
            <p className="text-xs text-slate-400 mb-5">
              ابتدا ربات را به کانال خود افزوده و دسترسی ادمین دهید، سپس اطلاعات زیر را تکمیل کنید.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">نام یا عنوان کانال</label>
                <input
                  type="text"
                  required
                  value={channelTitle}
                  onChange={(e) => setChannelTitle(e.target.value)}
                  placeholder="مثال: کانال اطلاعیه‌های فروشگاه"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">آیدی یا یوزرنیم کانال</label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={channelUsername}
                  onChange={(e) => setChannelUsername(e.target.value)}
                  placeholder="@MyChannel_ir"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">دسته‌بندی موضوعی</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="فناوری و نرم‌افزار">فناوری و نرم‌افزار</option>
                  <option value="فروشگاه و خدمات">فروشگاه و خدمات</option>
                  <option value="آموزشی و پژوهشی">آموزشی و پژوهشی</option>
                  <option value="سرگرمی و عمومی">سرگرمی و عمومی</option>
                  <option value="اخبار و رسانه">اخبار و رسانه</option>
                </select>
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300 block">دسترسی‌های تایید شده:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canPost}
                      onChange={(e) => setCanPost(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                    />
                    <span>ارسال پیام</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canEdit}
                      onChange={(e) => setCanEdit(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                    />
                    <span>ویرایش پیام</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canDelete}
                      onChange={(e) => setCanDelete(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-indigo-600"
                    />
                    <span>حذف پیام</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  ثبت کانال در ربات
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
