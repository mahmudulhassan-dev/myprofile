import express from 'express';
import {
    getPosts, createPost, updatePost, deletePost, getPost,
    getCategories, createCategory, updateCategory, deleteCategory,
    getTags, incrementView
} from '../controllers/blogController.js';

const router = express.Router();

// Posts
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.get('/posts/:id', getPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/view', incrementView);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Tags
router.get('/tags', getTags);

export default router;
