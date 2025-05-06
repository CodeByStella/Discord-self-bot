# Discord Self-Bot (Node.js Version)

Auto posting & watch group self-bot with customized Windows notifications for Discord forums and chats.

## Overview

This Discord self-bot automatically posts predefined messages to specified chat and forum channels, monitors new messages and forum posts, and displays Windows toast notifications for relevant updates, such as new job postings. It also uses OpenAI GPT to detect job-related messages and filters messages accordingly.

## Features

- Auto posting scheduled messages to multiple chat and forum channels
- Monitors forum threads and messages for job posts using AI content detection
- Displays Windows toast notifications for new relevant messages and forum replies
- Supports filtering and ignoring own posts
- Configurable delay times between posts
- Uses Discord API and OpenAI GPT-3.5 Turbo for message classification
- Telegram integration for notifications

## Prerequisites

- Node.js 16.x or higher
- Windows OS (for toast notifications)
- Discord account
- OpenAI API key
- Telegram bot token

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd discord-bot-node
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your credentials:
```env
DISCORD_TOKEN=your_discord_user_token_here
OPENAI_API_KEY=your_openai_api_key_here
TELEGRAM_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
MIN_DELAY=60        # minimum delay in minutes between posts
MAX_DELAY=90        # maximum delay in minutes between posts
```

4. Create configuration files:
- Create `config/chat_channel_ids.cfg` with Discord channel IDs (one per line)
- Create `config/forum_channel_ids.cfg` with Discord forum channel IDs (one per line)

5. Configure message templates in `src/constants.js`

## Usage

Start the bot:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Configuration

- Edit `src/constants.js` to configure:
  - Message templates
  - Forum tag mappings
  - Notification settings

- Edit `.env` to configure:
  - API keys and tokens
  - Posting delays
  - Other environment variables

## Important Notes

- This is a **self-bot**: it uses a user token, which is against Discord's Terms of Service and can result in account termination. Use at your own risk.
- Requires Windows OS for toast notifications.
- Make sure your OpenAI API key has access to GPT-3.5 Turbo.

## License

This project is open source. Use and modify as you wish. 