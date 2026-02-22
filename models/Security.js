import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, unique: true },
    slug: { type: DataTypes.STRING, unique: true },
    description: DataTypes.TEXT,
    color: { type: DataTypes.STRING, defaultValue: '#4f46e5' },
    is_system: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Permission = sequelize.define('Permission', {
    name: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true },
    module: DataTypes.STRING,
    description: DataTypes.TEXT
});

const Subscriber = sequelize.define('Subscriber', {
    email: { type: DataTypes.STRING, unique: true },
    status: { type: DataTypes.ENUM('Pending', 'Subscribed', 'Unsubscribed', 'Bounced'), defaultValue: 'Pending' },
    verify_token: DataTypes.STRING,
    verified_at: DataTypes.DATE,
    unsubscribe_token: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    source: { type: DataTypes.STRING, defaultValue: 'Footer' },
    meta: { type: DataTypes.JSON, defaultValue: {} }
});

const RolePermission = sequelize.define('RolePermission', {});

const NewsletterGroup = sequelize.define('NewsletterGroup', {
    name: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true },
    description: DataTypes.TEXT
});

const NewsletterCampaign = sequelize.define('NewsletterCampaign', {
    subject: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: { type: DataTypes.ENUM('Draft', 'Scheduled', 'Sending', 'Sent'), defaultValue: 'Draft' },
    scheduled_at: DataTypes.DATE,
    sent_at: DataTypes.DATE
});

const NewsletterTemplate = sequelize.define('NewsletterTemplate', {
    name: DataTypes.STRING,
    subject: DataTypes.STRING,
    content: DataTypes.TEXT
});

const NewsletterLog = sequelize.define('NewsletterLog', {
    email: DataTypes.STRING,
    status: { type: DataTypes.ENUM('Sent', 'Failed', 'Opened', 'Clicked'), defaultValue: 'Sent' },
    error: DataTypes.TEXT
});

export { Role, Permission, RolePermission, Subscriber, NewsletterGroup, NewsletterCampaign, NewsletterTemplate, NewsletterLog };
