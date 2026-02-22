import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    refreshToken,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

// Phase 4 New Routes
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

export default router;
