
import express from 'express';
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '../controllers/attributeController.js';

const router = express.Router();

router.get('/', getAttributes);
router.post('/', createAttribute);
router.put('/:id', updateAttribute);
router.delete('/:id', deleteAttribute);

export default router;
