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

// ... Ops ...
export const operateItems = async (req, res) => {
    // Parsing move/copy logic with DB IDs
    res.json({ success: false, message: "Not implemented yet for DB" });
};

export const getStats = async (req, res) => {
    const fileCount = await File.count();
    const folderCount = await Folder.count();
    const size = await File.sum('size') || 0;

    res.json({ used: size, filesCount: fileCount, foldersCount: folderCount });
};
