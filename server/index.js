import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import sequelize from './config/db.js';
import {
    Profile, Project, Skill, Service, Product, Page, Setting, Order, Article, Testimonial, User, Subscriber, PricingPlan, FAQ,
    BlogPost, Category, Tag, Comment
} from './models/index.js';

import dashboardRoutes from './routes/dashboardRoutes.js';
import activityLogger from './middleware/activityLogger.js';
import systemRoutes from './routes/systemRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import productRoutes from './routes/productRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import http from 'http';
import { initSocket } from './services/socketService.js';
import chatRoutes from './routes/chatRoutes.js';
import pixelRoutes from './routes/pixelRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(activityLogger);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// File Upload Config (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ url: `/uploads/${req.file.filename}` });
});

/* --- API Routes --- */

// Admin Modules
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/system', systemRoutes);
app.use('/api/admin/blog', blogRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/profile', profileRoutes);

// Core Modules
app.use('/api/fm', fileRoutes); // File Manager
app.use('/api/auth', authRoutes); // Auth
app.use('/api/admin/users', userRoutes); // User Management
app.use('/api/admin/roles', roleRoutes); // Role Management
app.use('/api/comments', commentRoutes); // Comments System
app.use('/api/newsletter', newsletterRoutes); // Newsletter System
app.use('/api/projects', projectRoutes); // Project System
app.use('/api/contact', contactRoutes); // Contact System
app.use('/api/chat', chatRoutes); // Live Chat System
app.use('/api/pixel', pixelRoutes); // Pixel & Automation System
app.use('/api/currency', currencyRoutes); // Currency System

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Database sync error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
