import express from 'express';
import { getSystemStats, getSettingsByGroup, updateSettings } from '../controllers/systemController.js';

const router = express.Router();

router.get('/stats', getSystemStats);
router.get('/settings/:group', getSettingsByGroup);
router.post('/settings', updateSettings);

export default router;
