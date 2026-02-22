import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
    refresh_token: DataTypes.STRING,
    reset_password_token: DataTypes.STRING,
    reset_password_expire: DataTypes.DATE,
    last_login: DataTypes.DATE,
    skills: { type: DataTypes.JSON, defaultValue: [] },
    social_links: { type: DataTypes.JSON, defaultValue: [] },
    location: DataTypes.STRING
});

const UserRole = sequelize.define('UserRole', {});

const UserLog = sequelize.define('UserLog', {
    action: DataTypes.STRING,
    details: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.STRING,
    device_info: DataTypes.JSON
});

export { User, UserRole, UserLog };
