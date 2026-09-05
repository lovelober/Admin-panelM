import React, { useState } from 'react';
import { 
  TerminalSquare, Plus, Check, Edit3, Trash2, 
  Send, Bot, User, Sparkles, X, MessageSquare
} from 'lucide-react';
import { BotCommand } from '../types';

interface CommandsViewProps {
  commands: BotCommand[];
  onUpdateCommand: (cmd: BotCommand) => void;
  onAddCommand: (cmd: BotCommand) => void;
  onDeleteCommand: (id: string) => void;
}

export default function CommandsView({
  commands,
  onUpdateCommand,
  onAddCommand,
  onDeleteCommand,
}: CommandsViewProps) {
  const [editingCmd, setEditingCmd] = useState<BotCommand | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCommandText, setNewCommandText] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newResponse, setNewResponse] = useState('');

  // Interactive Test Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: 'سلام! می‌توانید هر دستوری مانند /start یا /help را تست کنید.', time: '۱۲:۰۰' },
  ]);
  const [chatInput, setChatInput] = useState('/start');

  const handleTestSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const now = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: userText, time: now }];
    setChatMessages(newMsgs);
    setChatInput('');

    // Check if command exists
    const matched = commands.find(c => c.command.toLowerCase() === userText.toLowerCase() && c.enabled);
    setTimeout(() => {
      if (matched) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot' as const, text: matched.response, time: now },
        ]);
      } else if (userText.startsWith('/')) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot' as const, text: `دستور «${userText}» در سیستم تعریف نشده یا غیرفعال است. برای راهنما /help را ارسال کنید.`, time: now },
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot' as const, text: 'پیام دریافت شد. جهت راهنمایی از منوی دستورات تلگرام استفاده کنید.', time: now },
        ]);
      }
    }, 400);
  };

  const handleSaveEdit = () => {
    if (!editingCmd) return;
    onUpdateCommand(editingCmd);
    setEditingCmd(null);
  };

  const handleCreateCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommandText || !newResponse) return;

    const formatted = newCommandText.startsWith('/') ? newCommandText : `/${newCommandText}`;
    const newCmd: BotCommand = {
      id: `cmd-${Date.now()}`,
      command: formatted,
      description: newDescription || 'دستور سفارشی',
      response: newResponse,
      type: 'text',
      enabled: true,
      usageCount: 0,
    };
    onAddCommand(newCmd);
    setNewCommandText('');
    setNewDescription('');
    setNewResponse('');
    setIsNewModalOpen(false);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TerminalSquare size={22} className="text-emerald-400" />
            <span>مدیریت دستورات و پاسخ‌های خودکار (Bot Commands)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعریف و ویرایش پاسخ‌های خودکار به دستورات تلگرام نظیر /start ، /help و پاسخ‌های سفارشی
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن دستور جدید</span>
        </button>
      </div>

      {/* Main Grid: Commands list (7 cols) + Test Sandbox (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Commands List */}
        <div className="lg:col-span-7 space-y-4">
          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all shadow-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl shadow-sm">
                    {cmd.command}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{cmd.description}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      تعداد دفعات اجرا: {cmd.usageCount.toLocaleString('fa-IR')} بار
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Enable/Disable Toggle */}
                  <button
                    onClick={() => onUpdateCommand({ ...cmd, enabled: !cmd.enabled })}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      cmd.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cmd.enabled ? 'فعال' : 'غیرفعال'}
                  </button>
                  <button
                    onClick={() => setEditingCmd(cmd)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="ویرایش پاسخ"
                  >
                    <Edit3 size={15} />
                  </button>
                  {cmd.command !== '/start' && (
                    <button
                      onClick={() => onDeleteCommand(cmd.id)}
                      className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="حذف دستور"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Response Preview */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed mt-3">
                {cmd.response}
              </div>
            </div>
          ))}
        </div>

        {/* Live Test Chat Simulator */}
        <div className="lg:col-span-5 bg-[#17212b] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
          {/* Top Bar */}
          <div className="bg-[#242f3d] px-4 py-3 border-b border-slate-700/50 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs shadow-md">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="font-bold text-xs">تست زنده چت با ربات</h4>
                <span className="text-[10px] text-emerald-400">شبیه‌ساز آنی پاسخ‌ها</span>
              </div>
            </div>
            <button
              onClick={() => setChatMessages([])}
              className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
            >
              پاک کردن چت
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1621]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tl-sm shadow-md'
                      : 'bg-[#182533] text-slate-200 border border-slate-700/40 rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] opacity-70 block text-left mt-1 font-mono">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Command Pills */}
          <div className="bg-[#17212b] px-3 py-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {commands.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setChatInput(c.command);
                }}
                className="px-2.5 py-1 bg-[#242f3d] hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap font-mono cursor-pointer transition-colors"
              >
                {c.command}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleTestSend} className="bg-[#242f3d] p-3 flex items-center gap-2 border-t border-slate-700/50">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="ارسال دستور یا پیام..."
              className="flex-1 bg-[#17212b] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer shadow-md"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>

      {/* Edit Command Modal */}
      {editingCmd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-right text-white relative">
            <button
              onClick={() => setEditingCmd(null)}
              className="absolute top-6 left-6 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold mb-1">ویرایش دستور {editingCmd.command}</h3>
            <p className="text-xs text-slate-400 mb-4">تغییر متن پاسخی که ربات به این دستور می‌دهد</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان و توضیح دستور</label>
                <input
                  type="text"
                  value={editingCmd.description}
                  onChange={(e) => setEditingCmd({ ...editingCmd, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">متن پاسخ خودکار ربات</label>
                <textarea
                  rows={5}
                  value={editingCmd.response}
                  onChange={(e) => setEditingCmd({ ...editingCmd, response: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  ذخیره تغییرات
                </button>
                <button
                  onClick={() => setEditingCmd(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Command Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#111827] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-right text-white relative">
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-6 left-6 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold mb-1">افزودن دستور تلگرامی جدید</h3>
            <p className="text-xs text-slate-400 mb-4">دستور جدید به همراه پاسخ خودکار آن را وارد کنید</p>

            <form onSubmit={handleCreateCommand} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">دستور (مثال: /price یا /gift)</label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={newCommandText}
                  onChange={(e) => setNewCommandText(e.target.value)}
                  placeholder="/custom_command"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">توضیح کوتاه</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="راهنمای نمایش داده شده در منوی ربات"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">متن پاسخ خودکار ربات</label>
                <textarea
                  rows={4}
                  required
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="هنگامی که کاربر این دستور را بفرستد، این پیام برای او ارسال می‌شود..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  ایجاد دستور
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
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
