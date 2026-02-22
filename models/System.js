import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Setting = sequelize.define('Setting', {
    key: { type: DataTypes.STRING, unique: true },
    value: DataTypes.TEXT,
    group: DataTypes.STRING
});

const Page = sequelize.define('Page', {
    title: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true },
    content: DataTypes.TEXT('long'),
    meta_description: DataTypes.TEXT
});

const FAQ = sequelize.define('FAQ', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    category: DataTypes.STRING
});

const Appearance = sequelize.define('Appearance', {
    key: { type: DataTypes.STRING, unique: true },
    value: DataTypes.TEXT,
    type: { type: DataTypes.ENUM('color', 'text', 'number', 'json', 'boolean', 'file'), defaultValue: 'text' },
    category: DataTypes.STRING
});

const Widget = sequelize.define('Widget', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    position: DataTypes.STRING,
    settings: { type: DataTypes.JSON, defaultValue: {} },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const MenuItem = sequelize.define('MenuItem', {
    title: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    isOpenNewTab: { type: DataTypes.BOOLEAN, defaultValue: false },
    isVisible: { type: DataTypes.BOOLEAN, defaultValue: true },
    children: { type: DataTypes.JSON }
});

const FooterSection = sequelize.define('FooterSection', {
    title: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM('links', 'social', 'html', 'text'), defaultValue: 'text' },
    content: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    isVisible: { type: DataTypes.BOOLEAN, defaultValue: true },
    columnSpan: { type: DataTypes.INTEGER, defaultValue: 1 }
});

const Contact = sequelize.define('Contact', {
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    project_type: DataTypes.STRING,
    budget_range: DataTypes.STRING,
    attachment: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    browser: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

const ContactNote = sequelize.define('ContactNote', {
    note: DataTypes.TEXT
});

const Skill = sequelize.define('Skill', {
    key: DataTypes.STRING,
    title: DataTypes.STRING,
    level: DataTypes.INTEGER,
    color: DataTypes.STRING,
    icon: DataTypes.STRING,
    category: DataTypes.STRING
});

const ActivityLog = sequelize.define('ActivityLog', {
    action: DataTypes.STRING,
    details: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING
});

const SystemMetric = sequelize.define('SystemMetric', {
    cpu_pct: DataTypes.FLOAT,
    mem_pct: DataTypes.FLOAT,
    disk_pct: DataTypes.FLOAT,
    db_status: DataTypes.STRING
});

const AutomationWorkflow = sequelize.define('AutomationWorkflow', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    trigger_event: DataTypes.STRING,
    webhook_url: DataTypes.STRING,
    last_triggered: DataTypes.DATE
});

const AutomationTrigger = sequelize.define('AutomationTrigger', {
    type: DataTypes.STRING,
    config: { type: DataTypes.JSON, defaultValue: {} }
});

const AutomationAction = sequelize.define('AutomationAction', {
    type: DataTypes.STRING,
    config: { type: DataTypes.JSON, defaultValue: {} },
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const AutomationLog = sequelize.define('AutomationLog', {
    status: DataTypes.STRING,
    details: DataTypes.TEXT
});

export { Setting, Page, FAQ, Appearance, Widget, MenuItem, FooterSection, Contact, ContactNote, ActivityLog, SystemMetric, Skill, AutomationWorkflow, AutomationTrigger, AutomationAction, AutomationLog };
