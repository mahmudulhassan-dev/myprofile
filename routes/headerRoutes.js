import express from 'express';
import {
    getHeaderSettings, updateHeaderSettings,
    addMenuItem, updateMenuItem, deleteMenuItem, updateMenuOrder
} from '../controllers/headerController.js';

const router = express.Router();

router.get('/', getHeaderSettings);
router.post('/update', updateHeaderSettings);
router.post('/menu/add', addMenuItem);
router.post('/menu/update-order', updateMenuOrder);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

export default router;
