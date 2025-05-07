import 'dotenv/config';
import { Client, TextChannel, ForumChannel, Message, ThreadChannel, GuildForumTag } from 'discord.js-selfbot-v13';
import { loadChannelIds, getRandomMessage, sleep, updateStatus, logger } from './utils';
import notificationService from './services/notificationService';
import aiService from './services/aiService';
import { TAG_ID_BY_FORUM_CHANNEL } from './constants';

class DiscordSelfBot {
    private client: Client;
    private chatChannelIds: string[];
    private forumChannelIds: string[];
    private activeThreads: Set<string>;

    constructor() {
        this.client = new Client({
            checkUpdate: false
        });
        
        this.chatChannelIds = loadChannelIds('chat_channel_ids.cfg');
        this.forumChannelIds = loadChannelIds('forum_channel_ids.cfg');
        this.activeThreads = new Set();
        
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.client.on('ready', () => {
            updateStatus(`Logged in as ${this.client.user?.tag}`, 'success');
            notificationService.sendNotification('Bot Started', 'Discord self-bot is now running');
            this.startScheduledTasks();
        });

        this.client.on('messageCreate', async (message: Message) => {
            if (message.author.id === this.client.user?.id) return;
            
            const isJobRelated = await aiService.isJobRelated(message.content);
            if (isJobRelated && message.channel instanceof TextChannel) {
                await notificationService.sendNotification(
                    'New Job Post',
                    `Channel: ${message.channel.name}\nContent: ${message.content}\nLink: ${message.url}`
                );
            }
        });

        this.client.on('threadCreate', async (thread: ThreadChannel) => {
            const message = await thread.fetchStarterMessage();
            if (message && message.author.id !== this.client.user?.id) {
                const isJobRelated = await aiService.isJobRelated(message.content);
                if (isJobRelated) {
                    await notificationService.sendNotification(
                        'New Job Thread',
                        `Forum: ${thread.parent?.name}\nTitle: ${thread.name}\nContent: ${message.content}\nLink: ${message.url}`
                    );
                }
            }
        });
    }

    private async startScheduledTasks(): Promise<void> {
        while (true) {
            try {
                // Post to forum channels
                for (const channelId of this.forumChannelIds) {
                    const channel = await this.client.channels.fetch(channelId) as ForumChannel | null;
                    if (channel) {
                        await this.postToForum(channel);
                        await sleep(Number(process.env.MIN_DELAY), Number(process.env.MAX_DELAY));
                    }
                }

                // Post to chat channels
                for (const channelId of this.chatChannelIds) {
                    const channel = await this.client.channels.fetch(channelId) as TextChannel | null;
                    if (channel) {
                        await this.postToChat(channel);
                        await sleep(Number(process.env.MIN_DELAY), Number(process.env.MAX_DELAY));
                    }
                }
            } catch (error) {
                logger.error(`Error in scheduled tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
                await sleep(5, 10); // Wait 5-10 minutes before retrying
            }
        }
    }

    private async postToChat(channel: TextChannel): Promise<void> {
        try {
            const { title, content } = getRandomMessage();
            const message = await channel.send(content);
            updateStatus(`Posted to chat channel: ${channel.name}`, 'success');
            await notificationService.sendNotification(
                'New Post',
                `Posted to ${channel.name}\nContent: ${content}\nLink: ${message.url}`
            );
        } catch (error) {
            logger.error(`Error posting to chat channel ${channel.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async postToForum(channel: ForumChannel): Promise<void> {
        try {
            const { title, content } = getRandomMessage();
            const tagIds = TAG_ID_BY_FORUM_CHANNEL[channel.id] || [];
            const availableTags = channel.availableTags
                .filter(tag => tagIds.includes(tag.id))
                .map(tag => tag.id);
            
            const thread = await channel.threads.create({
                name: title,
                message: { content },
                appliedTags: availableTags
            });
            
            this.activeThreads.add(thread.id);
            updateStatus(`Posted to forum channel: ${channel.name}`, 'success');
            await notificationService.sendNotification(
                'New Forum Post',
                `Posted to ${channel.name}\nTitle: ${title}\nContent: ${content}\nLink: https://discord.com/channels/${channel.guild.id}/${thread.id}`
            );
        } catch (error) {
            logger.error(`Error posting to forum channel ${channel.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public start(): void {
        this.client.login(process.env.DISCORD_TOKEN);
    }
}

// Initialize and start the bot
const bot = new DiscordSelfBot();
bot.start(); 