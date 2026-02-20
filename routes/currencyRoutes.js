import express from 'express';
import { getCurrencies, updateCurrency, forceUpdateRates, getLogs } from '../controllers/currencyController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getCurrencies);

// Admin
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCurrency);
router.post('/fetch', protect, authorize('admin', 'superadmin'), forceUpdateRates);
router.get('/logs', protect, authorize('admin', 'superadmin'), getLogs);

export default router;
