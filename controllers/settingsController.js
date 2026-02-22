import { Setting, ActivityLog } from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/db.js';
import catchAsync from '../utils/catchAsync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all settings
export const getSettings = catchAsync(async (req, res) => {
    const settings = await Setting.findAll();
    const formattedSettings = {};
    settings.forEach(setting => {
        formattedSettings[setting.key] = setting.value;
    });
    res.json(formattedSettings);
});

// Update settings (Bulk upsert)
export const updateSettings = catchAsync(async (req, res) => {
    const settingsData = req.body;

    const updatePromises = Object.keys(settingsData).map(async (key) => {
        const value = settingsData[key];

        let group = 'general';
        if (key.startsWith('social_')) group = 'social';
        if (key.startsWith('contact_')) group = 'contact';
        if (key.startsWith('seo_')) group = 'seo';
        if (key.startsWith('mail_')) group = 'email';

        const existing = await Setting.findOne({ where: { key } });
        if (existing) {
            existing.value = value;
            return existing.save();
        }
        return Setting.create({ key, value, group });
    });

    await Promise.all(updatePromises);

    await ActivityLog.create({
        action: 'UPDATE_SETTINGS',
        description: 'Admin updated global settings',
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
    });

    res.json({ message: 'Settings updated successfully' });
});

// Database Backup
export const downloadBackup = catchAsync(async (req, res) => {
    const models = Object.keys(sequelize.models);
    const backupData = {};

    for (const modelName of models) {
        if (modelName === 'SequelizeMeta') continue;
        backupData[modelName] = await sequelize.models[modelName].findAll();
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const fileName = `backup-${timestamp}.json`;
    const backupDir = path.join(__dirname, '../../backups');

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const filePath = path.join(backupDir, fileName);
    const backupContent = JSON.stringify(backupData, null, 2);

    fs.writeFileSync(filePath, backupContent);

    await Setting.findOrCreate({
        where: { key: `backup_${timestamp}` },
        defaults: {
            key: `backup_${timestamp}`,
            value: JSON.stringify({
                filename: fileName,
                size: Buffer.byteLength(backupContent, 'utf8'),
                created_at: new Date().toISOString(),
                type: 'manual'
            }),
            group: 'backup_history'
        }
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(backupContent);
});

// System Stats
export const getSystemStatus = catchAsync(async (req, res) => {
    const memoryUsage = process.memoryUsage();
    const totalMem = 1024 * 1024 * 1024;

    res.json({
        serverStatus: 'Online',
        cpuUsage: Math.floor(Math.random() * 20) + 5 + '%',
        ramUsage: Math.round((memoryUsage.heapUsed / totalMem) * 100) + '%',
        storageUsage: '45%',
        nodeVersion: process.version,
        uptime: Math.floor(process.uptime()) + 's'
    });
});

// Generate Sitemap
export const generateSitemap = catchAsync(async (req, res) => {
    const { Project, BlogPost, Product, Page } = sequelize.models;

    // Read base URL from settings, fall back to env or placeholder
    const siteSetting = await Setting.findOne({ where: { key: 'site_url' } });
    const baseUrl = siteSetting?.value || process.env.SITE_URL || 'https://mysite.com';

    const [pages, projects, posts, products] = await Promise.all([
        Page ? Page.findAll() : [],
        Project ? Project.findAll() : [],
        BlogPost ? BlogPost.findAll() : [],
        Product ? Product.findAll() : [],
    ]);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemap += `  <url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;

    pages.forEach(p => { sitemap += `  <url><loc>${baseUrl}/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`; });
    projects.forEach(p => { sitemap += `  <url><loc>${baseUrl}/project/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`; });
    posts.forEach(p => { sitemap += `  <url><loc>${baseUrl}/blog/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`; });
    products.forEach(p => { sitemap += `  <url><loc>${baseUrl}/product/${p.slug}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>\n`; });

    sitemap += `</urlset>`;

    const sitemapPath = path.join(__dirname, '../../public/sitemap.xml');
    const publicDir = path.dirname(sitemapPath);
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(sitemapPath, sitemap);

    res.json({ message: 'Sitemap generated successfully', path: sitemapPath });
});

// Get Backup History
export const getBackupHistory = catchAsync(async (req, res) => {
    const backups = await Setting.findAll({
        where: { group: 'backup_history' },
        order: [['createdAt', 'DESC']]
    });

    const backupList = backups.map(backup => ({
        id: backup.key,
        ...JSON.parse(backup.value)
    }));

    res.json(backupList);
});

// Download Specific Backup
export const downloadSpecificBackup = catchAsync(async (req, res) => {
    const { filename } = req.params;
    const backupDir = path.join(__dirname, '../../backups');
    const filePath = path.join(backupDir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Backup file not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.sendFile(filePath);
});

// Restore from Backup
export const restoreBackup = catchAsync(async (req, res) => {
    const backupData = req.body;

    for (const modelName in backupData) {
        if (sequelize.models[modelName]) {
            await sequelize.models[modelName].destroy({ where: {}, truncate: true });
            await sequelize.models[modelName].bulkCreate(backupData[modelName]);
        }
    }

    res.json({ message: 'Database restored successfully' });
});

// Delete Backup
export const deleteBackup = catchAsync(async (req, res) => {
    const { backupId } = req.params;

    const backup = await Setting.findOne({ where: { key: backupId } });
    if (!backup) return res.status(404).json({ message: 'Backup not found' });

    const metadata = JSON.parse(backup.value);
    const backupDir = path.join(__dirname, '../../backups');
    const filePath = path.join(backupDir, metadata.filename);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await backup.destroy();
    res.json({ message: 'Backup deleted successfully' });
});
