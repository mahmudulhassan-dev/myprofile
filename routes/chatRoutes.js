import express from 'express';
import { startSession, getHistory, getSessions, getSession, createDoc, getDocs } from '../controllers/chatController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.post('/start', startSession);
router.get('/history', getHistory);

// Admin (Protected)
router.get('/admin/sessions', protect, authorize('Admin', 'Super Admin'), getSessions);
router.get('/admin/sessions/:id', protect, authorize('Admin', 'Super Admin'), getSession);
router.get('/admin/knowledge', protect, authorize('Admin', 'Super Admin'), getDocs);
router.post('/admin/knowledge', protect, authorize('Admin', 'Super Admin'), createDoc);

export default router;
