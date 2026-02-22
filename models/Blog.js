import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
    banner: { type: DataTypes.STRING },
    parentId: { type: DataTypes.INTEGER, defaultValue: null },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    seo_title: { type: DataTypes.STRING },
    seo_desc: { type: DataTypes.TEXT },
    count: { type: DataTypes.INTEGER, defaultValue: 0 }
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

export { BlogPost, Category, Tag, Comment };
