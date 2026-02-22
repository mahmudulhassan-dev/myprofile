import express from 'express';
import { initMfsPayment, getMfsOrders, updateMfsOrderStatus } from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public – customer submits payment proof
router.post('/init', initMfsPayment);

// Admin-only – view and manage MFS orders
router.get('/orders', protect, authorize('admin', 'super-admin'), getMfsOrders);
router.patch('/orders/:id', protect, authorize('admin', 'super-admin'), updateMfsOrderStatus);

export default router;
