const fs = require('fs');
const path = require('path');
const winston = require('winston');
const chalk = require('chalk');
const { MESSAGE_TEMPLATES } = require('./constants');

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
function loadChannelIds(filename) {
    try {
        const filePath = path.join(__dirname, '..', 'config', filename);
        const content = fs.readFileSync(filePath, 'utf8');
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .map(id => id.trim());
    } catch (error) {
        logger.error(`Error loading ${filename}: ${error.message}`);
        return [];
    }
}

// Get random message template
function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * MESSAGE_TEMPLATES.length);
    return MESSAGE_TEMPLATES[randomIndex];
}

// Sleep function with random delay
function sleep(minDelay, maxDelay) {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay) * 60 * 1000;
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Update status with color
function updateStatus(message, type = 'info') {
    const colors = {
        success: chalk.green,
        error: chalk.red,
        warning: chalk.yellow,
        info: chalk.blue
    };
    
    const color = colors[type] || chalk.white;
    logger.log(type, color(message));
}

module.exports = {
    loadChannelIds,
    getRandomMessage,
    sleep,
    updateStatus,
    logger
}; 