import express from 'express';
import {
    subscribe, confirm, unsubscribe,
    getSubscribers, importSubscribers
} from '../controllers/newsletterController.js';
import {
    getCampaigns, createCampaign, updateCampaign, sendCampaign, trackOpen
} from '../controllers/campaignController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.post('/subscribe', subscribe);
router.post('/confirm', confirm);
router.post('/unsubscribe', unsubscribe);
router.get('/track/open/:logId', trackOpen);

// Admin - Subscribers
router.get('/admin/subscribers', protect, authorize('Admin'), getSubscribers);
router.post('/admin/subscribers/import', protect, authorize('Admin'), importSubscribers);

// Admin - Campaigns
router.get('/admin/campaigns', protect, authorize('Admin'), getCampaigns);
router.post('/admin/campaigns', protect, authorize('Admin'), createCampaign);
router.put('/admin/campaigns/:id', protect, authorize('Admin'), updateCampaign);
router.post('/admin/campaigns/:id/send', protect, authorize('Admin'), sendCampaign);

export default router;
