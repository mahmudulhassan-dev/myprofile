import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { File, Folder } from '../models/index.js';
import sequelize from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.join(__dirname, '../../public/uploads');

const syncFiles = async () => {
    try {
        console.log("Syncing Files from Disk to DB...");

        // 1. Ensure Root Folder
        let root = await Folder.findOne({ where: { parentId: null, name: 'Root' } });
        if (!root) {
            root = await Folder.create({ name: 'Root', is_system: true, path: '/' });
            console.log("Created Root Folder");
        }

        // 2. Read Files
        if (!fs.existsSync(UPLOAD_ROOT)) return;
        const files = fs.readdirSync(UPLOAD_ROOT);

        for (const filename of files) {
            const filePath = path.join(UPLOAD_ROOT, filename);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) continue; // Skip subdirectories for now in flat sync

            // Check if exists
            const existing = await File.findOne({ where: { name: filename } });
            if (!existing) {
                await File.create({
                    name: filename,
                    original_name: filename,
                    path: filePath,
                    url: `/uploads/${filename}`,
                    type: getFileType(filename),
                    size: stat.size,
                    folderId: root.id,
                    createdAt: stat.birthtime
                });
                console.log(`Imported: ${filename}`);
            }
        }
        console.log("Sync Complete.");
    } catch (e) {
        console.error("Sync Error:", e);
    }
};

const getFileType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    if (['.jpg', '.png', '.jpeg', '.gif', '.webp'].includes(ext)) return 'image';
    if (['.mp4', '.webm'].includes(ext)) return 'video';
    if (['.pdf', '.doc', '.docx'].includes(ext)) return 'document';
    return 'file';
};

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    sequelize.sync().then(syncFiles);
}

export default syncFiles;
