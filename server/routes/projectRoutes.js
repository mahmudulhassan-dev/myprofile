import express from 'express';
import {
    getProjects, getProject, createProject, updateProject, deleteProject, restoreProject, getProjectStats
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public (or Protected depending on requirements, let's keep all admin protected for now as requested)
router.get('/', protect, getProjects); // List
router.get('/stats', protect, getProjectStats); // Stats
router.get('/:id', protect, getProject); // Show

// Modification Only
router.post('/', protect, authorize('Admin', 'Super Admin'), createProject);
router.put('/:id', protect, authorize('Admin', 'Super Admin'), updateProject);
router.delete('/:id', protect, authorize('Admin', 'Super Admin'), deleteProject);

// Restore
router.post('/:id/restore', protect, authorize('Super Admin'), restoreProject);

export default router;
