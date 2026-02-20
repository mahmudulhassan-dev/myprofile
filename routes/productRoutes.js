import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkAction,
    getAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    getDashboardStats
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.post('/bulk', bulkAction);
router.get('/dashboard/stats', getDashboardStats);
router.get('/attributes', getAttributes);
router.post('/attributes', createAttribute);
router.put('/attributes/:id', updateAttribute);
router.delete('/attributes/:id', deleteAttribute);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
