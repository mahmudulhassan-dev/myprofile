import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    listFiles, createFolder, deleteItems, operateItems, getStats, uploadFile
} from '../controllers/fileController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Simplified Flat Storage - Hierarchy Managed in DB
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        // Ensure dir exists
        import('fs').then(fs => {
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'file-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/list', listFiles);
router.post('/folder', createFolder);
router.post('/delete', deleteItems);
router.post('/operate', operateItems);
router.get('/stats', getStats);
router.post('/upload', upload.single('image'), uploadFile);

export default router;
