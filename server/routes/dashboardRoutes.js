import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Middleware to check admin role could be added here
// router.use(requireAdmin);

router.get('/overview', dashboardController.getOverview);
router.get('/metrics', dashboardController.getMetrics);
router.get('/system-health', dashboardController.getSystemHealth);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.post('/actions', dashboardController.performAction);

export default router;
