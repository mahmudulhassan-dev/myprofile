import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { ChatSession, ChatMessage, ChatSettings, KnowledgeDoc } from './chatModels.js';
import { PixelConfig, PixelEvent, CustomScript, PixelLog } from './pixelModels.js';
import { Currency, CurrencyLog, CurrencySetting } from './currencyModels.js';
import { Folder, File } from './fileModels.js';

// --- Portfolio Models ---

const Profile = sequelize.define('Profile', {
    fullName: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    designation: DataTypes.STRING,
    title: DataTypes.STRING,
    shortBio: DataTypes.TEXT,
    longBio: DataTypes.TEXT('long'),
    gender: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    nationality: DataTypes.STRING,
    email: { type: DataTypes.JSON, defaultValue: [] },
    phone: { type: DataTypes.JSON, defaultValue: [] },
    whatsapp: DataTypes.STRING,
    website: DataTypes.STRING,
    address: { type: DataTypes.JSON, defaultValue: {} },
    avatar: DataTypes.STRING,
    cover_photo: DataTypes.STRING,
    resume_url: DataTypes.STRING,
    intro_video_url: DataTypes.STRING,
    promo_video_url: DataTypes.STRING,
    experience_years: { type: DataTypes.FLOAT, defaultValue: 0 },
    completed_projects: { type: DataTypes.INTEGER, defaultValue: 0 },
    happy_clients: { type: DataTypes.INTEGER, defaultValue: 0 },
    ongoing_projects: { type: DataTypes.INTEGER, defaultValue: 0 },
    work_status: { type: DataTypes.ENUM('Available', 'Busy', 'Not Taking Clients'), defaultValue: 'Available' },
    is_visible: { type: DataTypes.BOOLEAN, defaultValue: true },
    verified_badge: { type: DataTypes.BOOLEAN, defaultValue: false },
    theme_config: { type: DataTypes.JSON, defaultValue: {} }
});

const ProfileSocial = sequelize.define('ProfileSocial', {
    platform: DataTypes.STRING,
    url: DataTypes.STRING,
    icon: DataTypes.STRING,
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const ProfileExperience = sequelize.define('ProfileExperience', {
    company: DataTypes.STRING,
    designation: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
    description: DataTypes.TEXT,
    location: DataTypes.STRING
});

const ProfileEducation = sequelize.define('ProfileEducation', {
    institution: DataTypes.STRING,
    degree: DataTypes.STRING,
    field: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    grade: DataTypes.STRING
});

const ProfileAward = sequelize.define('ProfileAward', {
    title: DataTypes.STRING,
    issuer: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
});

const Project = sequelize.define('Project', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('website', 'app', 'brand', 'design', 'marketing', 'other'), defaultValue: 'website' },
    status: { type: DataTypes.ENUM('draft', 'published', 'archived', 'in-progress', 'completed', 'cancelled'), defaultValue: 'draft' },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    short_description: DataTypes.STRING(300),
    description: DataTypes.TEXT('long'),
    client_name: DataTypes.STRING,
    client_email: DataTypes.STRING,
    client_country: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    gallery: { type: DataTypes.JSON, defaultValue: [] },
    video_url: DataTypes.STRING,
    attachments: { type: DataTypes.JSON, defaultValue: [] },
    technologies: { type: DataTypes.JSON, defaultValue: [] },
    live_url: DataTypes.STRING,
    github_url: DataTypes.STRING,
    source_included: { type: DataTypes.BOOLEAN, defaultValue: false },
    cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    expense: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    revenue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    profit: { type: DataTypes.VIRTUAL, get() { return this.revenue - this.expense; } },
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    deadline: DataTypes.DATEONLY,
    duration: { type: DataTypes.VIRTUAL, get() { if (!this.start_date) return 0; const end = this.end_date ? new Date(this.end_date) : new Date(); const start = new Date(this.start_date); return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)); } },
    meta_title: DataTypes.STRING,
    meta_description: DataTypes.TEXT,
    meta_keywords: DataTypes.STRING,
    category: DataTypes.STRING,
    tags: { type: DataTypes.JSON, defaultValue: [] }
}, { paranoid: true });

const Skill = sequelize.define('Skill', {
    key: DataTypes.STRING,
    title: DataTypes.STRING,
    level: DataTypes.INTEGER,
    color: DataTypes.STRING,
    icon: DataTypes.STRING,
    category: DataTypes.STRING
});

const Service = sequelize.define('Service', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    icon: DataTypes.STRING
});

const Testimonial = sequelize.define('Testimonial', {
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    company: DataTypes.STRING,
    message: DataTypes.TEXT,
    image: DataTypes.STRING,
    rating: DataTypes.INTEGER
});

const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true },
    excerpt: DataTypes.TEXT,
    content: DataTypes.TEXT('long'),
    image: DataTypes.STRING,
    tags: { type: DataTypes.JSON, defaultValue: [] },
    status: { type: DataTypes.STRING, defaultValue: 'Published' },
    views: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('simple', 'variable', 'digital', 'service'), defaultValue: 'simple' },
    status: { type: DataTypes.ENUM('draft', 'active', 'archived', 'hidden'), defaultValue: 'draft' },
    sku: { type: DataTypes.STRING, unique: true },
    short_description: DataTypes.TEXT,
    description: DataTypes.TEXT('long'),
    featured_image: DataTypes.STRING,
    gallery: { type: DataTypes.JSON, defaultValue: [] },
    video_url: DataTypes.STRING,
    regular_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    sale_price: { type: DataTypes.DECIMAL(10, 2) },
    sale_start_date: DataTypes.DATE,
    sale_end_date: DataTypes.DATE,
    manage_stock: { type: DataTypes.BOOLEAN, defaultValue: false },
    stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_status: { type: DataTypes.ENUM('instock', 'outofstock', 'onbackorder'), defaultValue: 'instock' },
    meta_title: DataTypes.STRING,
    meta_desc: DataTypes.TEXT,
    focus_keyword: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    tags: { type: DataTypes.JSON, defaultValue: [] },
    view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    sales_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    average_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    review_count: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Attribute = sequelize.define('Attribute', {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.ENUM('text', 'color', 'image', 'button'), defaultValue: 'text' },
    values: { type: DataTypes.JSON, defaultValue: [] }
});

const ProductVariation = sequelize.define('ProductVariation', {
    sku: { type: DataTypes.STRING, unique: true },
    price: { type: DataTypes.DECIMAL(10, 2) },
    sale_price: { type: DataTypes.DECIMAL(10, 2) },
    stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    attributes: { type: DataTypes.JSON, allowNull: false },
    image: DataTypes.STRING
});

const ProductReview = sequelize.define('ProductReview', {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: DataTypes.TEXT,
    status: { type: DataTypes.ENUM('pending', 'approved', 'spam'), defaultValue: 'pending' },
    guest_name: DataTypes.STRING,
    guest_email: DataTypes.STRING
});

const Order = sequelize.define('Order', {
    productId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    amount: DataTypes.STRING,
    customerName: DataTypes.STRING,
    customerPhone: DataTypes.STRING,
    customerEmail: DataTypes.STRING,
    address: DataTypes.TEXT,
    paymentMethod: DataTypes.STRING,
    transactionID: { type: DataTypes.STRING, unique: true },
    val_id: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    payment_status: { type: DataTypes.STRING, defaultValue: 'Unpaid' }
});

const Page = sequelize.define('Page', {
    title: DataTypes.STRING,
    slug: { type: DataTypes.STRING, unique: true },
    content: DataTypes.TEXT('long'),
    meta_description: DataTypes.TEXT
});

const Setting = sequelize.define('Setting', {
    key: { type: DataTypes.STRING, unique: true },
    value: DataTypes.TEXT,
    group: DataTypes.STRING
});

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

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bio: DataTypes.TEXT,
    status: { type: DataTypes.ENUM('Active', 'Suspended', 'Pending'), defaultValue: 'Active' },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    two_factor_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    two_factor_secret: DataTypes.STRING,
    last_login: DataTypes.DATE,
    skills: { type: DataTypes.JSON, defaultValue: [] },
    social_links: { type: DataTypes.JSON, defaultValue: [] },
    location: DataTypes.STRING
});

const UserRole = sequelize.define('UserRole', {});
const RolePermission = sequelize.define('RolePermission', {});

const UserLog = sequelize.define('UserLog', {
    action: DataTypes.STRING,
    details: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    device_info: DataTypes.JSON
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

const NewsletterGroup = sequelize.define('NewsletterGroup', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    slug: { type: DataTypes.STRING, unique: true }
});

const NewsletterCampaign = sequelize.define('NewsletterCampaign', {
    subject: { type: DataTypes.STRING, allowNull: false },
    preheader: DataTypes.STRING,
    content: DataTypes.TEXT('long'),
    status: { type: DataTypes.ENUM('Draft', 'Scheduled', 'Sending', 'Sent'), defaultValue: 'Draft' },
    scheduled_at: DataTypes.DATE,
    sent_at: DataTypes.DATE,
    stats: { type: DataTypes.JSON, defaultValue: { sent: 0, opened: 0, clicked: 0, failed: 0 } }
});

const NewsletterLog = sequelize.define('NewsletterLog', {
    status: { type: DataTypes.ENUM('Sent', 'Failed', 'Opened', 'Clicked'), defaultValue: 'Sent' },
    opened_at: DataTypes.DATE,
    clicked_at: DataTypes.DATE,
    error_message: DataTypes.STRING
});

const PricingPlan = sequelize.define('PricingPlan', {
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    period: DataTypes.STRING,
    features: { type: DataTypes.JSON, defaultValue: [] },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    button_text: DataTypes.STRING,
    button_link: DataTypes.STRING
});

const FAQ = sequelize.define('FAQ', {
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    category: DataTypes.STRING
});

const File = sequelize.define('File', {
    path: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    size: DataTypes.INTEGER,
    mime: DataTypes.STRING,
    starred: { type: DataTypes.BOOLEAN, defaultValue: false },
    object_type: DataTypes.STRING,
    object_id: DataTypes.STRING,
    details: { type: DataTypes.JSON, defaultValue: {} },
    ip_address: DataTypes.STRING
});

const Contact = sequelize.define('Contact', {
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT('long'), allowNull: false },
    project_type: DataTypes.STRING,
    budget_range: DataTypes.STRING,
    attachment: DataTypes.STRING,
    status: { type: DataTypes.ENUM('pending', 'replied', 'archived', 'spam'), defaultValue: 'pending' },
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    country_code: DataTypes.STRING
});

const ContactNote = sequelize.define('ContactNote', {
    note: { type: DataTypes.TEXT, allowNull: false }
});

const SystemMetric = sequelize.define('SystemMetric', {
    cpu_pct: DataTypes.FLOAT,
    mem_pct: DataTypes.FLOAT,
    disk_pct: DataTypes.FLOAT,
    queue_length: DataTypes.INTEGER,
    db_status: DataTypes.STRING
});

const DashboardAggregate = sequelize.define('DashboardAggregate', {
    date: { type: DataTypes.DATEONLY, unique: true },
    pageviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    projects_count: DataTypes.INTEGER,
    users_count: DataTypes.INTEGER
});

const ActivityLog = sequelize.define('ActivityLog', {
    action: DataTypes.STRING,
    description: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING
});

const BlogPost = sequelize.define('BlogPost', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    content: { type: DataTypes.TEXT('long') },
    excerpt: { type: DataTypes.TEXT },
    featured_image: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('draft', 'published', 'scheduled', 'archived'), defaultValue: 'draft' },
    published_at: { type: DataTypes.DATE },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    read_time: { type: DataTypes.INTEGER, defaultValue: 0 },
    seo_title: { type: DataTypes.STRING },
    seo_desc: { type: DataTypes.TEXT },
    seo_keywords: { type: DataTypes.STRING },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    allow_comments: { type: DataTypes.BOOLEAN, defaultValue: true },
    priority: { type: DataTypes.INTEGER, defaultValue: 0 },
    meta: { type: DataTypes.JSON }
});

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT },
    icon: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    seo_title: { type: DataTypes.STRING },
    seo_desc: { type: DataTypes.TEXT }
});

const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT },
    color: { type: DataTypes.STRING }
});

const Comment = sequelize.define('Comment', {
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    parentId: { type: DataTypes.INTEGER, defaultValue: 0 },
    ip_address: { type: DataTypes.STRING },
    user_agent: { type: DataTypes.STRING }
});

// Relationships
BlogPost.belongsTo(Category);
Category.hasMany(BlogPost);
BlogPost.belongsToMany(Tag, { through: 'PostTags' });
Tag.belongsToMany(BlogPost, { through: 'PostTags' });
BlogPost.hasMany(Comment);
Comment.belongsTo(BlogPost);
Comment.belongsTo(User);
User.hasMany(Comment);

Product.belongsTo(Category);
Category.hasMany(Product);
Product.belongsToMany(Tag, { through: 'ProductTags' });
Tag.belongsToMany(Product, { through: 'ProductTags' });
Product.hasMany(ProductVariation, { as: 'variations' });
ProductVariation.belongsTo(Product);
Product.hasMany(ProductReview, { as: 'reviews' });
ProductReview.belongsTo(Product);

NewsletterGroup.belongsToMany(Subscriber, { through: 'SubscriberGroups' });
Subscriber.belongsToMany(NewsletterGroup, { through: 'SubscriberGroups' });
NewsletterCampaign.hasMany(NewsletterLog);
NewsletterLog.belongsTo(NewsletterCampaign);
Subscriber.hasMany(NewsletterLog);
NewsletterLog.belongsTo(Subscriber);

User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });
User.hasMany(UserLog);
UserLog.belongsTo(User);
Contact.hasMany(ContactNote);
ContactNote.belongsTo(Contact);
ContactNote.belongsTo(User);

// Chat Associations
ChatSession.hasMany(ChatMessage, { foreignKey: 'session_id', onDelete: 'CASCADE' });
ChatMessage.belongsTo(ChatSession, { foreignKey: 'session_id' });
ChatSession.belongsTo(User, { foreignKey: 'agent_id', as: 'Agent' });

export {
    sequelize,
    Profile, ProfileSocial, ProfileExperience, ProfileEducation, ProfileAward,
    Project, Skill, Service, Product, Page, Setting, Order, Article, Testimonial,
    User, Role, Permission, UserLog,
    Subscriber, PricingPlan, FAQ,
    NewsletterGroup, NewsletterCampaign, NewsletterLog,
    BlogPost, Category, Tag, Comment,
    File,
    Contact, ContactNote,
    DashboardAggregate, SystemMetric, ActivityLog,
    Attribute, ProductVariation, ProductReview,
    ChatSession, ChatMessage, ChatSettings, KnowledgeDoc,
    PixelConfig, PixelEvent, CustomScript, PixelLog,
    Currency, CurrencyLog, CurrencySetting,
    Folder, File
};
