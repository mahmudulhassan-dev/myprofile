import express from 'express';
import {
    getSettings,
    updateSettings,
    downloadBackup,
    getSystemStatus,
    generateSitemap,
    getBackupHistory,
    downloadSpecificBackup,
    restoreBackup,
    deleteBackup
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Settings endpoints
router.get('/', getSettings);
router.post('/', updateSettings);

// Backup endpoints
router.get('/backup', downloadBackup);
router.get('/backup/history', getBackupHistory);
router.get('/backup/download/:filename', downloadSpecificBackup);
router.post('/backup/restore', restoreBackup);
router.delete('/backup/:backupId', deleteBackup);

// System endpoints
router.get('/status', getSystemStatus);
router.post('/generate-sitemap', generateSitemap);

export default router;
