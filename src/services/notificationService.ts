import notifier from 'node-notifier';
import TelegramBot from 'node-telegram-bot-api';
import { NOTIFICATION_SETTINGS } from '../constants';
import { logger } from '../utils';

type NotificationType = 'info' | 'warning' | 'error' | 'success';

class NotificationService {
    private telegramBot: TelegramBot;

    constructor() {
        this.telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
        this.setupTelegramHandlers();
    }

    private setupTelegramHandlers(): void {
        this.telegramBot.on('message', (msg) => {
            logger.info(`Received Telegram message: ${msg.text}`);
        });
    }

    async sendWindowsNotification(title: string, message: string): Promise<void> {
        try {
            notifier.notify({
                title,
                message,
                sound: NOTIFICATION_SETTINGS.sound,
                icon: NOTIFICATION_SETTINGS.icon || undefined,
                timeout: NOTIFICATION_SETTINGS.duration
            });
            logger.info(`Windows notification sent: ${title}`);
        } catch (error) {
            logger.error(`Error sending Windows notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async sendTelegramNotification(message: string): Promise<void> {
        try {
            await this.telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID!, message);
            logger.info('Telegram notification sent');
        } catch (error) {
            logger.error(`Error sending Telegram notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async sendNotification(title: string, message: string, type: NotificationType = 'info'): Promise<void> {
        await Promise.all([
            this.sendWindowsNotification(title, message),
            this.sendTelegramNotification(`${title}\n${message}`)
        ]);
    }
}

export default new NotificationService(); 