export type ActiveTab = 
  | 'dashboard' 
  | 'broadcast' 
  | 'channels' 
  | 'button_builder' 
  | 'commands' 
  | 'cloud' 
  | 'settings';

export interface TelegramBot {
  id: string;
  name: string;
  username: string;
  token: string;
  avatarUrl?: string;
  isConnected: boolean;
  memberCount: number;
  channelsCount: number;
  pingMs: number;
  webhookUrl: string;
  connectedAt: string;
}

export interface TelegramChannel {
  id: string;
  title: string;
  username: string;
  members: number;
  category: string;
  canPost: boolean;
  canEdit: boolean;
  canDelete: boolean;
  status: 'active' | 'restricted' | 'pending';
  lastPostDate: string;
}

export interface InlineButton {
  id: string;
  text: string;
  type: 'url' | 'callback' | 'webapp' | 'share';
  value: string;
}

export interface ButtonRow {
  id: string;
  buttons: InlineButton[];
}

export interface BotCommand {
  id: string;
  command: string;
  description: string;
  response: string;
  type: 'text' | 'photo' | 'action';
  enabled: boolean;
  usageCount: number;
}

export interface BroadcastLog {
  id: string;
  title: string;
  recipientsCount: number;
  successCount: number;
  failedCount: number;
  status: 'completed' | 'in_progress' | 'failed';
  date: string;
  target: 'all' | 'channels' | 'users';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
}

export interface BotLog {
  id: string;
  timestamp: string;
  type: 'info' | 'message' | 'command' | 'error' | 'broadcast';
  text: string;
  user?: string;
}
