const notifier = require('node-notifier');
const TelegramBot = require('node-telegram-bot-api');
const { NOTIFICATION_SETTINGS } = require('../constants');
const { logger } = require('../utils');

class NotificationService {
    constructor() {
        this.telegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
        this.setupTelegramHandlers();
    }

    setupTelegramHandlers() {
        this.telegramBot.on('message', (msg) => {
            logger.info(`Received Telegram message: ${msg.text}`);
        });
    }

    async sendWindowsNotification(title, message) {
        try {
            notifier.notify({
                title,
                message,
                sound: NOTIFICATION_SETTINGS.sound,
                icon: NOTIFICATION_SETTINGS.icon,
                timeout: NOTIFICATION_SETTINGS.duration
            });
            logger.info(`Windows notification sent: ${title}`);
        } catch (error) {
            logger.error(`Error sending Windows notification: ${error.message}`);
        }
    }

    async sendTelegramNotification(message) {
        try {
            await this.telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
            logger.info('Telegram notification sent');
        } catch (error) {
            logger.error(`Error sending Telegram notification: ${error.message}`);
        }
    }

    async sendNotification(title, message, type = 'info') {
        await Promise.all([
            this.sendWindowsNotification(title, message),
            this.sendTelegramNotification(`${title}\n${message}`)
        ]);
    }
}

module.exports = new NotificationService(); 