import express from 'express';
import { getAppearance, updateAppearance } from '../controllers/appearanceController.js';

const router = express.Router();

router.get('/theme', getAppearance);
router.post('/theme', updateAppearance);

export default router;
