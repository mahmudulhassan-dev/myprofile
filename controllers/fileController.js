import { File, Folder } from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.join(__dirname, '../../public/uploads');

// --- Helper to ensure root folder exists and is in DB ---
const getRootFolder = async () => {
    let root = await Folder.findOne({ where: { parentId: null, name: 'Root' } });
    if (!root) {
        root = await Folder.create({ name: 'Root', is_system: true, path: '/' });
        if (!fs.existsSync(UPLOAD_ROOT)) fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
    }
    return root;
};

export const listFiles = async (req, res) => {
    try {
        let { folderId } = req.body;

        // Default to root if no ID provided
        if (!folderId) {
            const root = await getRootFolder();
            folderId = root.id;
        }

        const folders = await Folder.findAll({ where: { parentId: folderId } });
        const files = await File.findAll({ where: { folderId } });

        // Format to match frontend expected structure { name, isDirectory, ... }
        // Or updated frontend to use new schema. For now, let's adapt to "Item" structure.
        const items = [
            ...folders.map(f => ({
                id: f.id,
                name: f.name,
                isDirectory: true,
                path: f.path,
                parentId: f.parentId,
                createdAt: f.createdAt
            })),
            ...files.map(f => ({
                id: f.id,
                name: f.name,
                isDirectory: false,
                url: f.url,
                size: f.size,
                type: f.type,
                parentId: f.folderId,
                createdAt: f.createdAt
            }))
        ];

        // Breadcrumbs (Chain of parents)
        // Simplified for now - can be recursive query

        res.json({ files: items, currentFolderId: folderId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createFolder = async (req, res) => {
    try {
        let { name, parentId } = req.body;
        if (!parentId) {
            const root = await getRootFolder();
            parentId = root.id;
        }

        const parent = await Folder.findByPk(parentId);
        if (!parent) return res.status(404).json({ error: "Parent folder not found" });

        // 1. Create in DB
        const newFolder = await Folder.create({
            name,
            parentId,
            path: path.join(parent.path || '', name)
        });

        // 2. Create on Disk (Optional structure, usually allow flat uploads or mimicking tree)
        // Let's mimic tree for organization
        /* 
           NOTE: syncing disk paths with DB IDs is complex if we rename. 
           For robustness, we might keep flat /uploads/ structure 
           OR separate logic. Let's try matching names for now.
        */
        // const fullPath = path.join(UPLOAD_ROOT, newFolder.path || '');
        // if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

        res.json({ success: true, folder: newFolder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Find Folder ID (passed as body)
        let { folderId } = req.body;
        if (!folderId || folderId === 'undefined' || folderId === 'null') {
            const root = await getRootFolder();
            folderId = root.id;
        }

        const fileData = req.file; // From Multer

        // Create DB Entry
        const newFile = await File.create({
            name: fileData.filename,
            original_name: fileData.originalname,
            path: fileData.path, // Full or Relative? Better relative
            url: `/uploads/${fileData.filename}`, // Assuming flat upload for now
            type: fileData.mimetype.split('/')[0], // image, video
            mime_type: fileData.mimetype,
            size: fileData.size,
            folderId: folderId
        });

        res.json({ success: true, file: newFile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteItems = async (req, res) => {
    try {
        const { items } = req.body; // Array of IDs? Or Objects?
        // Assuming array of { id, isDirectory }

        for (const item of items) {
            if (item.isDirectory) {
                // Recursive delete not implemented for safety yet, just delete empty
                await Folder.destroy({ where: { id: item.id } });
            } else {
                const file = await File.findByPk(item.id);
                if (file) {
                    // Try delete from disk
                    // fs.unlink...
                    await file.destroy();
                }
            }
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// File Operations (Move, Copy, Rename)
export const operateItems = async (req, res) => {
    try {
        const { action, items, destination, newName } = req.body;

        if (action === 'move') {
            // Move files/folders to new location
            for (const item of items) {
                if (item.isDirectory) {
                    const folder = await Folder.findByPk(item.id);
                    if (folder) {
                        folder.parentId = destination;
                        await folder.save();
                    }
                } else {
                    const file = await File.findByPk(item.id);
                    if (file) {
                        file.folderId = destination;
                        await file.save();
                    }
                }
            }
            res.json({ success: true, message: 'Items moved successfully' });
        } else if (action === 'copy') {
            // Copy files/folders
            for (const item of items) {
                if (!item.isDirectory) {
                    const file = await File.findByPk(item.id);
                    if (file) {
                        const newFile = await File.create({
                            name: `${file.name} (copy)`,
                            original_name: file.original_name,
                            path: file.path,
                            url: file.url,
                            type: file.type,
                            mime_type: file.mime_type,
                            size: file.size,
                            folderId: destination || file.folderId
                        });
                    }
                }
            }
            res.json({ success: true, message: 'Items copied successfully' });
        } else if (action === 'rename') {
            // Rename single item
            if (items.length === 1) {
                const item = items[0];
                if (item.isDirectory) {
                    await Folder.update({ name: newName }, { where: { id: item.id } });
                } else {
                    await File.update({ name: newName }, { where: { id: item.id } });
                }
                res.json({ success: true, message: 'Item renamed successfully' });
            } else {
                res.status(400).json({ error: 'Can only rename one item at a time' });
            }
        } else if (action === 'trash') {
            // Soft delete - mark as deleted
            for (const item of items) {
                if (item.isDirectory) {
                    await Folder.update({ deleted: true }, { where: { id: item.id } });
                } else {
                    await File.update({ deleted: true }, { where: { id: item.id } });
                }
            }
            res.json({ success: true, message: 'Items moved to trash' });
        } else {
            res.status(400).json({ error: 'Unknown action' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Storage Statistics
export const getStats = async (req, res) => {
    try {
        const fileCount = await File.count({ where: { deleted: false } });
        const folderCount = await Folder.count({ where: { deleted: false } });
        const totalSize = await File.sum('size', { where: { deleted: false } }) || 0;

        // Get size by file type
        const imageSize = await File.sum('size', {
            where: { type: 'image', deleted: false }
        }) || 0;
        const videoSize = await File.sum('size', {
            where: { type: 'video', deleted: false }
        }) || 0;
        const documentSize = await File.sum('size', {
            where: { type: 'application', deleted: false }
        }) || 0;

        res.json({
            used: totalSize,
            filesCount: fileCount,
            foldersCount: folderCount,
            byType: {
                images: imageSize,
                videos: videoSize,
                documents: documentSize,
                others: totalSize - imageSize - videoSize - documentSize
            },
            total: 10 * 1024 * 1024 * 1024 // 10GB mock limit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Trash Items
export const getTrash = async (req, res) => {
    try {
        const files = await File.findAll({ where: { deleted: true } });
        const folders = await Folder.findAll({ where: { deleted: true } });

        const items = [
            ...folders.map(f => ({
                id: f.id,
                name: f.name,
                isDirectory: true,
                deletedAt: f.updatedAt
            })),
            ...files.map(f => ({
                id: f.id,
                name: f.name,
                isDirectory: false,
                url: f.url,
                size: f.size,
                deletedAt: f.updatedAt
            }))
        ];

        res.json({ files: items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Restore from Trash
export const restoreItems = async (req, res) => {
    try {
        const { items } = req.body;

        for (const item of items) {
            if (item.isDirectory) {
                await Folder.update({ deleted: false }, { where: { id: item.id } });
            } else {
                await File.update({ deleted: false }, { where: { id: item.id } });
            }
        }

        res.json({ success: true, message: 'Items restored successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle Star/Favorite
export const toggleStar = async (req, res) => {
    try {
        const { itemId, isDirectory, starred } = req.body;

        if (isDirectory) {
            await Folder.update({ starred: !starred }, { where: { id: itemId } });
        } else {
            await File.update({ starred: !starred }, { where: { id: itemId } });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
