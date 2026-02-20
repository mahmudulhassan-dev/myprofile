import express from 'express';
import {
    getOverviewStats, getFinancialStats, getSystemStats, getActivityLogs
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/overview', protect, authorize('admin', 'superadmin'), getOverviewStats);
router.get('/financials', protect, authorize('admin', 'superadmin'), getFinancialStats);
router.get('/system', protect, authorize('admin', 'superadmin'), getSystemStats);
router.get('/activity', protect, authorize('admin', 'superadmin'), getActivityLogs);

export default router;
