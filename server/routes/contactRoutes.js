import express from 'express';
import {
    submitContact,
    getContacts,
    getContact,
    replyContact,
    updateStatus,
    deleteContact,
    bulkDelete,
    exportContacts
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config for attachment (using standard config logic if shared, or simple here)
// Assuming global upload middleware or use specific one.
// Let's reuse the logic from fileRoutes or plain multer for simplicity here as we just need basic storage.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });


// Public
router.post('/submit', upload.single('attachment'), submitContact);

// Admin
router.post('/bulk-delete', protect, authorize('Admin', 'Super Admin'), bulkDelete);
router.get('/export', protect, authorize('Admin', 'Super Admin'), exportContacts);
router.get('/', protect, authorize('Admin', 'Super Admin'), getContacts);
router.get('/:id', protect, authorize('Admin', 'Super Admin'), getContact);
router.post('/:id/reply', protect, authorize('Admin', 'Super Admin'), replyContact);
router.put('/:id/status', protect, authorize('Admin', 'Super Admin'), updateStatus);
router.delete('/:id', protect, authorize('Admin', 'Super Admin'), deleteContact);

export default router;
