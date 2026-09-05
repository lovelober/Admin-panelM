import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import BroadcastView from './components/BroadcastView';
import ChannelsView from './components/ChannelsView';
import ButtonBuilderView from './components/ButtonBuilderView';
import CommandsView from './components/CommandsView';
import CloudDeployView from './components/CloudDeployView';
import SettingsView from './components/SettingsView';
import ConnectBotModal from './components/ConnectBotModal';
import LogoutModal from './components/LogoutModal';

import { 
  ActiveTab, TelegramBot, TelegramChannel, BotCommand, 
  ButtonRow, BroadcastLog, SystemNotification, BotLog 
} from './types';
import { 
  initialBot, sampleChannels, sampleCommands, 
  sampleButtonRows, sampleBroadcasts, sampleNotifications, initialLogs 
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [bot, setBot] = useState<TelegramBot>(initialBot);
  const [channels, setChannels] = useState<TelegramChannel[]>(sampleChannels);
  const [commands, setCommands] = useState<BotCommand[]>(sampleCommands);
  const [buttonRows, setButtonRows] = useState<ButtonRow[]>(sampleButtonRows);
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>(sampleBroadcasts);
  const [notifications, setNotifications] = useState<SystemNotification[]>(sampleNotifications);
  const [logs, setLogs] = useState<BotLog[]>(initialLogs);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Handlers
  const handleConnectBot = (updatedInfo: Partial<TelegramBot>) => {
    setBot((prev) => ({
      ...prev,
      ...updatedInfo,
      isConnected: true,
    }));
    // Add success notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'اتصال موفق ربات تلگرام',
      message: `ربات @${updatedInfo.username || bot.username} با موفقیت متصل شد و وب‌هوک فعال گردید.`,
      time: 'هم‌اکنون',
      type: 'success',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Add to logs
    const newLog: BotLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'info',
      text: `ربات با شناسه ${updatedInfo.id || bot.id} به پنل متصل شد.`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleDisconnectBot = () => {
    setBot((prev) => ({ ...prev, isConnected: false }));
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setBot((prev) => ({ ...prev, isConnected: false }));
    setActiveTab('dashboard');
  };

  const handleAddSampleLog = () => {
    const samplePool: Array<{ type: 'info' | 'message' | 'error'; text: string; user?: string }> = [
      {
        type: 'message',
        text: 'دستور /start را ارسال کرد و منو برای وی لود شد.',
        user: 'Mohammad_Dev',
      },
      {
        type: 'message',
        text: 'روی دکمه شیشه‌ای «عضویت در VIP» کلیک کرد.',
        user: 'Sara_Marketing',
      },
      {
        type: 'info',
        text: 'همگام‌سازی دیتابیس کانال‌ها با سرور تلگرام با موفقیت انجام شد.',
      },
      {
        type: 'error',
        text: 'خطای ۴۰۰ تلگرام: پیام خالی مجاز نیست (Bad Request: message text is empty).',
        user: 'Ali_Tehran',
      },
      {
        type: 'info',
        text: 'گواهی امنیتی SSL وب‌هوک برای ۳۰ روز آینده اعتبارسنجی شد.',
      },
      {
        type: 'error',
        text: 'خطای ۴۰۳ تلگرام: ربات دسترسی ارسال پیام در کانال مربوطه را ندارد.',
      },
      {
        type: 'message',
        text: 'دستور /support را ارسال کرد و تیکت پشتیبانی شماره #۲۸۴ ثبت شد.',
        user: 'Crypto_Hunter',
      },
    ];

    const item = samplePool[Math.floor(Math.random() * samplePool.length)];

    const newLog: BotLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: item.type,
      text: item.text,
      user: item.user,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="flex h-screen bg-[#0b1120] text-white font-sans overflow-hidden" dir="rtl">
      {/* 1. منوی کناری (Sidebar) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bot={bot}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* 2. بخش اصلی صفحه (Main Content) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* نوار بالایی (Header) */}
        <Header
          notifications={notifications}
          onMarkNotificationRead={(id) => {
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
          }}
          onClearNotifications={() => setNotifications([])}
          onNavigate={(tab) => setActiveTab(tab)}
          systemStatus="online"
        />

        {/* محتوای تب‌ها */}
        {activeTab === 'dashboard' && (
          <DashboardView
            bot={bot}
            logs={logs}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            onAddSampleLog={handleAddSampleLog}
            onClearLogs={() => setLogs([])}
          />
        )}

        {activeTab === 'broadcast' && (
          <BroadcastView
            broadcasts={broadcasts}
            buttonRows={buttonRows}
            onAddBroadcast={(newBc) => setBroadcasts([newBc, ...broadcasts])}
          />
        )}

        {activeTab === 'channels' && (
          <ChannelsView
            channels={channels}
            onAddChannel={(newChan) => setChannels([newChan, ...channels])}
            onRemoveChannel={(id) => setChannels(channels.filter(c => c.id !== id))}
          />
        )}

        {activeTab === 'button_builder' && (
          <ButtonBuilderView
            buttonRows={buttonRows}
            onUpdateRows={setButtonRows}
          />
        )}

        {activeTab === 'commands' && (
          <CommandsView
            commands={commands}
            onUpdateCommand={(updated) => setCommands(commands.map(c => c.id === updated.id ? updated : c))}
            onAddCommand={(newCmd) => setCommands([...commands, newCmd])}
            onDeleteCommand={(id) => setCommands(commands.filter(c => c.id !== id))}
          />
        )}

        {activeTab === 'cloud' && (
          <CloudDeployView bot={bot} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            bot={bot}
            onUpdateBot={(updated) => setBot((prev) => ({ ...prev, ...updated }))}
          />
        )}
      </main>

      {/* Modals */}
      <ConnectBotModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        bot={bot}
        onConnect={handleConnectBot}
        onDisconnect={handleDisconnectBot}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
