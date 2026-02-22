import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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

export { Profile, ProfileSocial, ProfileExperience, ProfileEducation, ProfileAward };
