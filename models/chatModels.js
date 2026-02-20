
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ChatSession = sequelize.define('ChatSession', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    visitor_name: { type: DataTypes.STRING, allowNull: true },
    visitor_email: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('open', 'closed', 'active'), defaultValue: 'open' },
    last_seen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    metadata: { type: DataTypes.JSON, allowNull: true }, // Store user agent, ip, etc
    agent_id: { type: DataTypes.INTEGER, allowNull: true } // If assigned to human
});

const ChatMessage = sequelize.define('ChatMessage', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sender_type: { type: DataTypes.ENUM('visitor', 'agent', 'ai', 'system'), allowNull: false },
    sender_id: { type: DataTypes.STRING, allowNull: true }, // Agent ID or null
    content: { type: DataTypes.TEXT, allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true }, // Attachments, RAG sources
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const ChatSettings = sequelize.define('ChatSetting', {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: false }, // Stored as JSON string
    group: { type: DataTypes.STRING, defaultValue: 'general' }
});

const KnowledgeDoc = sequelize.define('KnowledgeDoc', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    embedding: { type: DataTypes.JSON, allowNull: true }, // Can be massive, use JSON
    tags: { type: DataTypes.STRING, allowNull: true },
    file_path: { type: DataTypes.STRING, allowNull: true }
});

export { ChatSession, ChatMessage, ChatSettings, KnowledgeDoc };
