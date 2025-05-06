// Forum tag mappings
const TAG_ID_BY_FORUM_CHANNEL = {
    // Add your forum channel IDs and their corresponding tag IDs
    // Example:
    // '123456789': ['987654321', '123456789']
};

// Message templates
const MESSAGE_TEMPLATES = [
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
const NOTIFICATION_SETTINGS = {
    sound: true,
    duration: 5000, // 5 seconds
    icon: null // Path to notification icon
};

module.exports = {
    TAG_ID_BY_FORUM_CHANNEL,
    MESSAGE_TEMPLATES,
    NOTIFICATION_SETTINGS
}; 