// Forum tag mappings
interface TagMappings {
    [key: string]: string[];
}

const TAG_ID_BY_FORUM_CHANNEL: TagMappings = {
    // Add your forum channel IDs and their corresponding tag IDs
    // Example:
    // '123456789': ['987654321', '123456789']
};

// Message templates
export interface MessageTemplate {
    title: string;
    content: string;
}

const MESSAGE_TEMPLATES: MessageTemplate[] = [
    {
        title: "Template 1",
        content: "Message content 1"
    },
    {
        title: "Template 2",
        content: "Message content 2"
    }
    // Add more templates as needed
];

// Notification settings
interface NotificationSettings {
    sound: boolean;
    duration: number;
    icon: string | null;
}

const NOTIFICATION_SETTINGS: NotificationSettings = {
    sound: true,
    duration: 5000, // 5 seconds
    icon: null // Path to notification icon
};

export {
    TAG_ID_BY_FORUM_CHANNEL,
    MESSAGE_TEMPLATES,
    NOTIFICATION_SETTINGS
}; 