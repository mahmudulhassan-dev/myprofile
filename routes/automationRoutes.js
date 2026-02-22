import express from 'express';
import { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow, testWorkflow } from '../controllers/automationController.js';

const router = express.Router();

router.get('/', getWorkflows);
router.post('/', createWorkflow);
router.put('/:id', updateWorkflow);
router.delete('/:id', deleteWorkflow);
router.post('/:id/test', testWorkflow);

export default router;
