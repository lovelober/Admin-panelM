import { TelegramBot, TelegramChannel, BotCommand, BroadcastLog, SystemNotification, BotLog, ButtonRow } from '../types';

export const initialBot: TelegramBot = {
  id: '681940210',
  name: 'ربات هوشمند مدیریت رسانه',
  username: 'ProAdminHelperBot',
  token: '7192834012:AAH9fklQweX_pLmN81920-ExampleToken',
  isConnected: false, // Starts disconnected to match initial welcome screen, can be connected
  memberCount: 24850,
  channelsCount: 6,
  pingMs: 42,
  webhookUrl: 'https://api.telegram-admin.io/webhook/v1',
  connectedAt: '۱۴۰۳/۰۶/۱۵ - ۱۸:۳۰',
};

export const sampleChannels: TelegramChannel[] = [
  {
    id: '-1001892019482',
    title: 'کانال رسمی اخبار و تحلیل‌های فناوری',
    username: 'TechNews_Official',
    members: 14200,
    category: 'فناوری و هوش مصنوعی',
    canPost: true,
    canEdit: true,
    canDelete: true,
    status: 'active',
    lastPostDate: '۱۰ دقیقه پیش',
  },
  {
    id: '-1001928374619',
    title: 'کانال اطلاع‌رسانی تخفیفات ویژه VIP',
    username: 'VIP_Discounts_ir',
    members: 8950,
    category: 'فروشگاه و تخفیف',
    canPost: true,
    canEdit: true,
    canDelete: false,
    status: 'active',
    lastPostDate: '۱ ساعت پیش',
  },
  {
    id: '-1002019485721',
    title: 'پایگاه آموزشی برنامه‌نویسی و وب',
    username: 'DevAcademy_fa',
    members: 6300,
    category: 'آموزش',
    canPost: true,
    canEdit: false,
    canDelete: false,
    status: 'active',
    lastPostDate: 'امروز ۱۲:۴۵',
  },
  {
    id: '-1002194837261',
    title: 'گروه گفتگوی اعضای ممتاز و پشتیبانی',
    username: 'Community_VIP_Chat',
    members: 1420,
    category: 'گروه عمومی',
    canPost: true,
    canEdit: true,
    canDelete: true,
    status: 'active',
    lastPostDate: 'هم‌اکنون',
  },
];

export const sampleCommands: BotCommand[] = [
  {
    id: 'cmd-1',
    command: '/start',
    description: 'شروع کار با ربات و ارسال منوی اصلی خدمات',
    response: 'سلام کاربر گرامی! به ربات رسمی ما خوش آمدید 🌹\nلطفاً از دکمه‌های زیر برای دسترسی به بخش‌های مختلف استفاده کنید.',
    type: 'text',
    enabled: true,
    usageCount: 18450,
  },
  {
    id: 'cmd-2',
    command: '/help',
    description: 'راهنمای کاربری و دستورات در دسترس',
    response: 'راهنمای ربات:\nبرای ثبت سفارش /order\nبرای ارتباط با پشتیبانی /support\nبرای قوانین /rules را بفرستید.',
    type: 'text',
    enabled: true,
    usageCount: 4320,
  },
  {
    id: 'cmd-3',
    command: '/rules',
    description: 'مشاهده قوانین عضویت و استفاده از خدمات',
    response: 'قوانین استفاده از ربات و کانال‌های تابعه:\n۱. رعایت ادب و احترام متقابل\n۲. عدم ارسال تبلیغات غیرمجاز\n۳. مسئولیت هرگونه فعالیت مشکوک به عهده کاربر است.',
    type: 'text',
    enabled: true,
    usageCount: 1890,
  },
  {
    id: 'cmd-4',
    command: '/support',
    description: 'ارتباط مستقیم با تیم پشتیبانی فنی',
    response: 'پیام خود را همراه با توضیحات بنویسید تا در سریع‌ترین زمان ممکن پاسخگوی شما باشیم 💬',
    type: 'text',
    enabled: true,
    usageCount: 2950,
  },
];

export const sampleButtonRows: ButtonRow[] = [
  {
    id: 'row-1',
    buttons: [
      { id: 'btn-1', text: '🌐 ورود به وب‌سایت اصلی', type: 'url', value: 'https://example.com' },
      { id: 'btn-2', text: '💎 عضویت در کانال VIP', type: 'url', value: 'https://t.me/example_channel' },
    ],
  },
  {
    id: 'row-2',
    buttons: [
      { id: 'btn-3', text: '📊 مشاهده تعرفه‌ها و اشتراک', type: 'callback', value: 'view_plans' },
      { id: 'btn-4', text: '📞 ارتباط با پشتیبانی', type: 'callback', value: 'contact_support' },
    ],
  },
  {
    id: 'row-3',
    buttons: [
      { id: 'btn-5', text: '📱 مینی‌اپلیکیشن فروشگاهی', type: 'webapp', value: 'https://app.example.com' },
    ],
  },
];

export const sampleBroadcasts: BroadcastLog[] = [
  {
    id: 'bc-1',
    title: 'ارسال جشنواره تخفیفات پاییزه ۵۰٪',
    recipientsCount: 24850,
    successCount: 24690,
    failedCount: 160,
    status: 'completed',
    date: 'دیروز ساعت ۱۸:۳۰',
    target: 'all',
  },
  {
    id: 'bc-2',
    title: 'اطلاعیه مهم به‌روزرسانی زیرساخت و سرورها',
    recipientsCount: 4,
    successCount: 4,
    failedCount: 0,
    status: 'completed',
    date: '۳ روز پیش',
    target: 'channels',
  },
  {
    id: 'bc-3',
    title: 'ارسال کد هدیه اشتراک ۱ ماهه برای کاربران فعال',
    recipientsCount: 3200,
    successCount: 3180,
    failedCount: 20,
    status: 'completed',
    date: 'هفته گذشته',
    target: 'users',
  },
];

export const sampleNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'وب‌هوک با موفقیت فعال شد',
    message: 'اتصال امن SSL با سرور تلگرام برقرار شد (پینگ ۴۲ میلی‌ثانیه).',
    time: '۵ دقیقه پیش',
    type: 'success',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'عضو جدید در کانال فناوری',
    message: '۳۵ کاربر جدید در ۲۴ ساعت گذشته به کانال @TechNews_Official ملحق شدند.',
    time: '۴۵ دقیقه پیش',
    type: 'info',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'گزارش ارسال پیام همگانی',
    message: 'ارسال اطلاعیه به ۲۴,۶۹۰ کاربر با موفقیت انجام گردید.',
    time: 'دیروز',
    type: 'success',
    isRead: true,
  },
];

export const initialLogs: BotLog[] = [
  {
    id: 'log-1',
    timestamp: '۲۱:۴۵:۰۲',
    type: 'info',
    text: 'وب‌هوک تلگرام روی آدرس سرور ابری راه‌اندازی شد (TLS 1.3 - HTTP/2).',
  },
  {
    id: 'log-2',
    timestamp: '۲۱:۴۴:۱۸',
    type: 'command',
    text: 'دستور /start توسط کاربر [id: 92837119] دریافت شد و پاسخ داده شد.',
    user: 'Amir_Dev',
  },
  {
    id: 'log-3',
    timestamp: '۲۱:۴۳:۰۵',
    type: 'error',
    text: 'خطای ۴۰۳ تلگرام: ربات توسط کاربر [id: 7123984] مسدود (Forbidden: bot was blocked by the user) شده است.',
    user: 'User_7123',
  },
  {
    id: 'log-4',
    timestamp: '۲۱:۴۲:۳۰',
    type: 'message',
    text: 'پیام دکمه شیشه‌ای "view_plans" توسط ۵۴ کاربر در ۱ ساعت اخیر کلیک شد.',
    user: 'Sara_M',
  },
  {
    id: 'log-5',
    timestamp: '۲۱:۴۰:۵۰',
    type: 'error',
    text: 'خطای ۴۲۹ تلگرام: محدودیت ارسال پیام (Too Many Requests: retry after 2s). ارسال با تاخیر انجام شد.',
  },
  {
    id: 'log-6',
    timestamp: '۲۱:۳۹:۱۲',
    type: 'broadcast',
    text: 'صف ارسال پیام به اتمام رسید. وضعیت کلی: ۹۹.۳٪ موفقیت‌آمیز.',
  },
];
