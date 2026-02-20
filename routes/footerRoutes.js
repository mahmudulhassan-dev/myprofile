import express from 'express';
import {
    getFooterSettings, updateFooterSettings,
    addFooterSection, updateFooterSection, deleteFooterSection, updateSectionOrder
} from '../controllers/footerController.js';

const router = express.Router();

router.get('/', getFooterSettings);
router.post('/update', updateFooterSettings);
router.post('/section/add', addFooterSection);
router.post('/section/update-order', updateSectionOrder);
router.put('/section/:id', updateFooterSection);
router.delete('/section/:id', deleteFooterSection);

export default router;
