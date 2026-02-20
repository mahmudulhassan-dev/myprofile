import express from 'express';
import { initPayment, paymentSuccess, paymentFail, paymentCancel } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/init', initPayment);
router.post('/success/:tran_id', paymentSuccess); // Method depends on SSLCommerz, usually POST
router.post('/fail/:tran_id', paymentFail);
router.post('/cancel/:tran_id', paymentCancel);

export default router;
