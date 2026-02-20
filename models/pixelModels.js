import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Configuration for Standard Platforms (FB, GA4, TikTok, etc.)
const PixelConfig = sequelize.define('PixelConfig', {
    platform: { type: DataTypes.STRING, unique: true, allowNull: false }, // facebook, tiktok, google-analytics, etc.
    pixel_id: { type: DataTypes.STRING }, // Main ID
    is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
    settings: { type: DataTypes.JSON, defaultValue: {} } // Extra settings (CAPI token, specific toggles)
});

// Automation Rules / Events
const PixelEvent = sequelize.define('PixelEvent', {
    name: { type: DataTypes.STRING, allowNull: false }, // Internal name
    trigger_type: { type: DataTypes.ENUM('page_view', 'click', 'form_submit', 'custom'), defaultValue: 'page_view' },
    trigger_value: { type: DataTypes.STRING }, // URL path, Button ID/Class, or Custom Event Name
    actions: { type: DataTypes.JSON, defaultValue: [] }, // Array of actions: [{ platform: 'facebook', event: 'Purchase', params: {} }]
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Custom Raw Scripts
const CustomScript = sequelize.define('CustomScript', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    script_content: { type: DataTypes.TEXT('long') },
    placement: { type: DataTypes.ENUM('header', 'footer', 'body'), defaultValue: 'header' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Debugging Logs
const PixelLog = sequelize.define('PixelLog', {
    event_name: DataTypes.STRING,
    platform: DataTypes.STRING,
    status: { type: DataTypes.ENUM('success', 'failed'), defaultValue: 'success' },
    details: DataTypes.TEXT, // or JSON
    url: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    ip_address: DataTypes.STRING
});

export { PixelConfig, PixelEvent, CustomScript, PixelLog };
