import express from 'express';
import { getSystemStats } from '../controllers/systemController.js';

const router = express.Router();

router.get('/stats', getSystemStats);

export default router;
