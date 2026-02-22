import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    deadline: DataTypes.DATEONLY,
    meta_title: DataTypes.STRING,
    meta_description: DataTypes.TEXT,
    meta_keywords: DataTypes.STRING,
    category: DataTypes.STRING,
    tags: { type: DataTypes.JSON, defaultValue: [] },
    userId: { type: DataTypes.INTEGER, allowNull: true }
}, { paranoid: true });

export default Project;
