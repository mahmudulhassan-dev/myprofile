import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Folder = sequelize.define('Folder', {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING, defaultValue: '#fbbf24' }, // Folder icon color
    is_system: { type: DataTypes.BOOLEAN, defaultValue: false }, // Prevent deleting root/system folders
    path: DataTypes.STRING // Helper to store full breadcrumb path
});

const File = sequelize.define('File', {
    name: { type: DataTypes.STRING, allowNull: false },
    original_name: DataTypes.STRING,
    path: { type: DataTypes.STRING, allowNull: false }, // Disk path relative to uploads root
    url: DataTypes.STRING, // Public access URL
    type: { type: DataTypes.STRING, defaultValue: 'file' }, // image, video, code, archive
    mime_type: DataTypes.STRING,
    size: { type: DataTypes.INTEGER, defaultValue: 0 },
    dimensions: DataTypes.JSON, // For images (w, h)
    hash: DataTypes.STRING, // MD5 for duplicate detection (future proofing)
    is_favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Relationships
Folder.hasMany(Folder, { as: 'SubFolders', foreignKey: 'parentId' });
Folder.hasMany(File, { foreignKey: 'folderId' });
File.belongsTo(Folder, { foreignKey: 'folderId' });

export { Folder, File };
