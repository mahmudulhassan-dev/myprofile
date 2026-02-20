import express from 'express';
import {
    getComments,
    postComment,
    moderateComment,
    deleteComment,
    getAllComments
} from '../controllers/commentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public / Hybrid endpoints
router.get('/post/:postId', getComments);
router.post('/', postComment);

// Admin endpoints
router.use(protect);
router.use(authorize('Admin')); // or Moderator

router.get('/', getAllComments);
router.put('/:id', moderateComment);
router.delete('/:id', deleteComment);

export default router;
