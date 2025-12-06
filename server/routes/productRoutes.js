import express from 'express';
import {
    getProducts, createProduct, getProduct, updateProduct, deleteProduct,
    getAttributes, createAttribute, getDashboardStats
} from '../controllers/productController.js';

const router = express.Router();

// Dashboard Stats
router.get('/stats', getDashboardStats);

// Products CRUD
router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Attributes
router.get('/attributes', getAttributes);
router.post('/attributes', createAttribute);

export default router;
