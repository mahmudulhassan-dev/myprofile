import express from 'express';
import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getPermissions
} from '../controllers/roleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin')); // Ensure only Admins manage roles

router.route('/')
    .get(getRoles)
    .post(createRole);

router.get('/permissions', getPermissions);

router.route('/:id')
    .put(updateRole)
    .delete(deleteRole);

export default router;
