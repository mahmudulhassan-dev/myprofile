
import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, updateCategoryOrder } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/reorder', updateCategoryOrder); // Specific route before :id to avoid conflict
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
