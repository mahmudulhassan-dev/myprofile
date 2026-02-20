import express from 'express';
import {
    getActivePixels, logEvent,
    getConfigs, updateConfig,
    getEvents, createEvent, updateEvent, deleteEvent,
    getScripts, createScript, updateScript, deleteScript,
    getLogs
} from '../controllers/pixelController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/active', getActivePixels);
router.post('/log', logEvent);

// Admin (Protected)
router.get('/admin/configs', protect, authorize('admin', 'superadmin'), getConfigs);
router.post('/admin/configs', protect, authorize('admin', 'superadmin'), updateConfig);

router.get('/admin/events', protect, authorize('admin', 'superadmin'), getEvents);
router.post('/admin/events', protect, authorize('admin', 'superadmin'), createEvent);
router.put('/admin/events/:id', protect, authorize('admin', 'superadmin'), updateEvent);
router.delete('/admin/events/:id', protect, authorize('admin', 'superadmin'), deleteEvent);

router.get('/admin/scripts', protect, authorize('admin', 'superadmin'), getScripts);
router.post('/admin/scripts', protect, authorize('admin', 'superadmin'), createScript);
router.put('/admin/scripts/:id', protect, authorize('admin', 'superadmin'), updateScript);
router.delete('/admin/scripts/:id', protect, authorize('admin', 'superadmin'), deleteScript);

router.get('/admin/logs', protect, authorize('admin', 'superadmin'), getLogs);

export default router;
