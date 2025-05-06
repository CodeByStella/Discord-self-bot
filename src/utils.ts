import fs from 'fs';
import path from 'path';
import winston from 'winston';
import chalk from 'chalk';
import { MESSAGE_TEMPLATES, MessageTemplate } from './constants';

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'bot.log' })
    ]
});

// Load channel IDs from config files
function loadChannelIds(filename: string): string[] {
    try {
        const filePath = path.join(__dirname, '..', 'config', filename);
        const content = fs.readFileSync(filePath, 'utf8');
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(id => id.trim());
    } catch (error) {
        logger.error(`Error loading ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return [];
    }
}

// Get random message template
function getRandomMessage(): MessageTemplate {
    const randomIndex = Math.floor(Math.random() * MESSAGE_TEMPLATES.length);
    return MESSAGE_TEMPLATES[randomIndex];
}

// Sleep function with random delay
function sleep(minDelay: number, maxDelay: number): Promise<void> {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay) * 60 * 1000;
    return new Promise(resolve => setTimeout(resolve, delay));
}

type StatusType = 'success' | 'error' | 'warning' | 'info';

// Update status with color
function updateStatus(message: string, type: StatusType = 'info'): void {
    const colors: Record<StatusType, (text: string) => string> = {
        success: chalk.green,
        error: chalk.red,
        warning: chalk.yellow,
        info: chalk.blue
    };
    
    const color = colors[type] || chalk.white;
    logger.log(type, color(message));
}

export {
    loadChannelIds,
    getRandomMessage,
    sleep,
    updateStatus,
    logger
}; 