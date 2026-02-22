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
    getDashboardStats,
    updateStock,
    getReviews,
    updateReviewStatus,
    deleteReview
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.post('/bulk', bulkAction);
router.get('/dashboard/stats', getDashboardStats);
router.put('/:id/stock', updateStock);

router.get('/reviews', getReviews);
router.put('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);
router.get('/attributes', getAttributes);
router.post('/attributes', createAttribute);
router.put('/attributes/:id', updateAttribute);
router.delete('/attributes/:id', deleteAttribute);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
