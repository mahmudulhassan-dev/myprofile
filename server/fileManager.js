import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const TRASH_DIR = path.join(__dirname, '../public/uploads/.trash');
const META_FILE = path.join(__dirname, '../public/uploads/.meta.json');
const zip = new AdmZip();
for (const itemPath of items) {
    const fullPath = path.join(UPLOADS_DIR, itemPath);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
        zip.addLocalFolder(fullPath, path.basename(itemPath));
    } else {
        zip.addLocalFile(fullPath);
    }
}
const zipName = name || `archive_${Date.now()}.zip`;
const outputPath = path.join(UPLOADS_DIR, zipName); // Save to root or specific folder? Default root for now
zip.writeZip(outputPath);
return { success: true, path: zipName };
};

export const extractFile = async (zipPath, destPath = '') => {
    const fullZipPath = path.join(UPLOADS_DIR, zipPath);
    const fullDestPath = path.join(UPLOADS_DIR, destPath, path.basename(zipPath, '.zip')); // Extract to folder named after zip
    fs.ensureDirSync(fullDestPath);

    const zip = new AdmZip(fullZipPath);
    zip.extractAllTo(fullDestPath, true);
    return { success: true };
};

export const toggleLock = async (itemPath, password) => {
    // If password provided, lock it. If null, unlock.
    await updateFileMeta(itemPath, {
        locked: !!password,
        password: password || null,
        lockedAt: password ? new Date() : null
    });
    return { success: true };
};

export const createShareLink = async (itemPath, options = {}) => {
    // Options: expiresIn, password
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const linkMeta = {
        token,
        path: itemPath,
        created: new Date(),
        expires: options.expiresIn ? new Date(Date.now() + options.expiresIn) : null,
        password: options.password || null
    };

    // Store links in a separate key or file? Let's use meta.shared
    const meta = await getMeta();
    if (!meta.shared) meta.shared = [];
    meta.shared.push(linkMeta);
    await saveMeta(meta);

    return { success: true, link: `/api/fm/shared/${token}` };
};
