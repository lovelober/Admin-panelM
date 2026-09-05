import React, { useState } from 'react';
import { 
  MousePointerClick, Plus, Trash2, Link as LinkIcon, 
  Code2, Sparkles, Copy, Check, ExternalLink, MessageSquare, 
  Smartphone, Layers, RefreshCw
} from 'lucide-react';
import { ButtonRow, InlineButton } from '../types';

interface ButtonBuilderViewProps {
  buttonRows: ButtonRow[];
  onUpdateRows: (rows: ButtonRow[]) => void;
}

export default function ButtonBuilderView({
  buttonRows,
  onUpdateRows,
}: ButtonBuilderViewProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<'json' | 'python' | 'aiogram'>('json');
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatedClickAlert, setSimulatedClickAlert] = useState<string | null>(null);

  const handleAddRow = () => {
    const newRow: ButtonRow = {
      id: `row-${Date.now()}`,
      buttons: [
        {
          id: `btn-${Date.now()}-1`,
          text: 'دکمه جدید',
          type: 'url',
          value: 'https://example.com',
        },
      ],
    };
    onUpdateRows([...buttonRows, newRow]);
  };

  const handleRemoveRow = (rowId: string) => {
    onUpdateRows(buttonRows.filter((r) => r.id !== rowId));
  };

  const handleAddButtonToRow = (rowId: string) => {
    const updated = buttonRows.map((r) => {
      if (r.id === rowId) {
        if (r.buttons.length >= 4) return r; // Telegram limit practical UX
        return {
          ...r,
          buttons: [
            ...r.buttons,
            {
              id: `btn-${Date.now()}-${r.buttons.length + 1}`,
              text: 'دکمه ' + (r.buttons.length + 1),
              type: 'callback' as const,
              value: `callback_action_${r.buttons.length + 1}`,
            },
          ],
        };
      }
      return r;
    });
    onUpdateRows(updated);
  };

  const handleUpdateButton = (
    rowId: string,
    btnId: string,
    field: keyof InlineButton,
    val: string
  ) => {
    const updated = buttonRows.map((r) => {
      if (r.id === rowId) {
        return {
          ...r,
          buttons: r.buttons.map((b) => {
            if (b.id === btnId) {
              return { ...b, [field]: val };
            }
            return b;
          }),
        };
      }
      return r;
    });
    onUpdateRows(updated);
  };

  const handleRemoveButton = (rowId: string, btnId: string) => {
    const updated = buttonRows
      .map((r) => {
        if (r.id === rowId) {
          return {
            ...r,
            buttons: r.buttons.filter((b) => b.id !== btnId),
          };
        }
        return r;
      })
      .filter((r) => r.buttons.length > 0);
    onUpdateRows(updated);
  };

  const handleSimulateButtonClick = (btn: InlineButton) => {
    if (btn.type === 'url') {
      setSimulatedClickAlert(`🌐 باز کردن پیوند بیرونی: ${btn.value}`);
    } else if (btn.type === 'callback') {
      setSimulatedClickAlert(`⚡ کالبک ارسال شد به سرور: ${btn.value}`);
    } else {
      setSimulatedClickAlert(`📱 اجرای مینی‌اپ وب‌اپ: ${btn.value}`);
    }
    setTimeout(() => setSimulatedClickAlert(null), 3000);
  };

  // Generate code representations
  const getTelegramJson = () => {
    const keyboard = buttonRows.map((row) =>
      row.buttons.map((btn) => {
        if (btn.type === 'url') return { text: btn.text, url: btn.value };
        if (btn.type === 'webapp') return { text: btn.text, web_app: { url: btn.value } };
        return { text: btn.text, callback_data: btn.value };
      })
    );
    return JSON.stringify({ reply_markup: { inline_keyboard: keyboard } }, null, 2);
  };

  const getPythonSnippet = () => {
    return `# python-telegram-bot
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

keyboard = [
` + buttonRows.map(r => `    [` + r.buttons.map(b => 
      b.type === 'url' ? `InlineKeyboardButton("${b.text}", url="${b.value}")` :
      b.type === 'webapp' ? `InlineKeyboardButton("${b.text}", web_app=WebAppInfo(url="${b.value}"))` :
      `InlineKeyboardButton("${b.text}", callback_data="${b.value}")`
    ).join(', ') + `]`).join(',\n') + `
]
reply_markup = InlineKeyboardMarkup(keyboard)`;
  };

  const getAiogramSnippet = () => {
    return `# aiogram 3.x
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

keyboard = InlineKeyboardMarkup(inline_keyboard=[
` + buttonRows.map(r => `    [` + r.buttons.map(b => 
      b.type === 'url' ? `InlineKeyboardButton(text="${b.text}", url="${b.value}")` :
      b.type === 'webapp' ? `InlineKeyboardButton(text="${b.text}", web_app={"url": "${b.value}"})` :
      `InlineKeyboardButton(text="${b.text}", callback_data="${b.value}")`
    ).join(', ') + `]`).join(',\n') + `
])`;
  };

  const handleCopyCode = () => {
    let code = getTelegramJson();
    if (activeCodeTab === 'python') code = getPythonSnippet();
    if (activeCodeTab === 'aiogram') code = getAiogramSnippet();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MousePointerClick size={22} className="text-amber-400" />
            <span>دکمه‌ساز شیشه‌ای (Telegram Inline Keyboard Builder)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            طراحی سطرها و ستون‌های دکمه‌های شیشه‌ای همراه با پیش‌نمایش تعاملی و خروجی کد آماده برای تلگرام
          </p>
        </div>

        <button
          onClick={handleAddRow}
          className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>افزودن سطر جدید دکمه</span>
        </button>
      </div>

      {simulatedClickAlert && (
        <div className="p-3 bg-indigo-950/70 border border-indigo-500/40 rounded-xl text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <span>{simulatedClickAlert}</span>
        </div>
      )}

      {/* Main workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual editor list (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {buttonRows.length === 0 ? (
            <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-10 text-center text-slate-400 backdrop-blur-xl shadow-xl">
              <Layers size={40} className="mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">هیچ سطری برای دکمه‌ها وجود ندارد</p>
              <button
                onClick={handleAddRow}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                ایجاد اولین سطر دکمه
              </button>
            </div>
          ) : (
            buttonRows.map((row, rowIdx) => (
              <div
                key={row.id}
                className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 space-y-3.5 shadow-xl"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs">
                  <span className="font-bold text-slate-200">
                    سطر شماره {rowIdx + 1} ({row.buttons.length} دکمه در این سطر)
                  </span>
                  <div className="flex items-center gap-2">
                    {row.buttons.length < 4 && (
                      <button
                        onClick={() => handleAddButtonToRow(row.id)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>افزودن دکمه به سطر</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                      title="حذف کل سطر"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Buttons in this row */}
                <div className="space-y-3">
                  {row.buttons.map((btn) => (
                    <div
                      key={btn.id}
                      className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs"
                    >
                      {/* Text input */}
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-400 block mb-1 font-medium">متن روی دکمه</label>
                        <input
                          type="text"
                          value={btn.text}
                          onChange={(e) => handleUpdateButton(row.id, btn.id, 'text', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Type select */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400 block mb-1 font-medium">نوع عملکرد</label>
                        <select
                          value={btn.type}
                          onChange={(e) => handleUpdateButton(row.id, btn.id, 'type', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="url">لینک وب (URL)</option>
                          <option value="callback">کالبک (Callback)</option>
                          <option value="webapp">وب‌اپ (WebApp)</option>
                        </select>
                      </div>

                      {/* Value input */}
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-400 block mb-1 font-medium">
                          {btn.type === 'url' ? 'آدرس URL' : btn.type === 'webapp' ? 'آدرس وب‌اپ' : 'شناسه کالبک دیتا'}
                        </label>
                        <input
                          type="text"
                          dir="ltr"
                          value={btn.value}
                          onChange={(e) => handleUpdateButton(row.id, btn.id, 'value', e.target.value)}
                          placeholder={btn.type === 'url' ? 'https://...' : 'action_name'}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Remove Button */}
                      <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                        <button
                          onClick={() => handleRemoveButton(row.id, btn.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Telegram Preview & Code Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Interactive Chat Preview Card */}
          <div className="bg-[#182533] border border-slate-700/50 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-3 text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                پیش‌نمایش زنده در پیام تلگرام
              </span>
              <span className="text-[10px] text-slate-400">روی دکمه‌ها کلیک کنید</span>
            </div>

            <div className="bg-[#0e1621] p-4 rounded-xl space-y-3">
              <div className="bg-[#242f3d] p-3 rounded-xl rounded-tr-sm text-xs text-slate-200 leading-relaxed text-right border border-slate-700/40">
                این یک پیام نمونه است که دکمه‌های شیشه‌ای زیر آن به کاربر نمایش داده می‌شوند.
                <div className="text-[10px] text-slate-400 text-left mt-1 font-mono">۱۲:۴۰ ✓✓</div>
              </div>

              {/* Dynamic Buttons rendered */}
              <div className="space-y-1.5">
                {buttonRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-1.5"
                    style={{ gridTemplateColumns: `repeat(${row.buttons.length}, minmax(0, 1fr))` }}
                  >
                    {row.buttons.map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleSimulateButtonClick(btn)}
                        className="bg-[#2b5278] hover:bg-[#386a9a] active:scale-95 text-white py-2 px-2.5 rounded-xl text-center text-xs font-medium transition-all shadow-sm truncate cursor-pointer"
                      >
                        {btn.text}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Code Box */}
          <div className="bg-[#111827]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-indigo-400" />
                <span className="text-xs font-bold text-white">خروجی کد برنامه‌نویسی</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3.5 py-1.5 rounded-xl border border-slate-700/50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedCode ? 'کپی شد!' : 'کپی کد'}</span>
              </button>
            </div>

            {/* Language tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 mb-3 text-xs">
              <button
                onClick={() => setActiveCodeTab('json')}
                className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                  activeCodeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Telegram JSON
              </button>
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                  activeCodeTab === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                python-telegram-bot
              </button>
              <button
                onClick={() => setActiveCodeTab('aiogram')}
                className={`px-3 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                  activeCodeTab === 'aiogram' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                aiogram 3
              </button>
            </div>

            <pre
              dir="ltr"
              className="bg-slate-950 p-3.5 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-800/80 leading-relaxed"
            >
              {activeCodeTab === 'json' && getTelegramJson()}
              {activeCodeTab === 'python' && getPythonSnippet()}
              {activeCodeTab === 'aiogram' && getAiogramSnippet()}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
