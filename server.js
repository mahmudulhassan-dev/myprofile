import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import compression from 'compression';
import sequelize from './config/db.js';
import {
    Profile, Project, Skill, Service, Product, Page, Setting, Order, User, Subscriber, FAQ,
    BlogPost, Category, Tag, Comment
} from './models/index.js';

import dashboardRoutes from './routes/dashboardRoutes.js';
import activityLogger from './middlewares/activityLogger.js';
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
import categoryRoutes from './routes/categoryRoutes.js';
import attributeRoutes from './routes/attributeRoutes.js';
import automationRoutes from './routes/automationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import http from 'http';
import { initSocket } from './services/socketService.js';
import chatRoutes from './routes/chatRoutes.js';
import { handleAIChat } from './controllers/aiController.js';
import { createBooking, getMyBookings } from './controllers/bookingController.js';
import pixelRoutes from './routes/pixelRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import headerRoutes from './routes/headerRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import appearanceRoutes from './routes/appearanceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import mfsRoutes from './routes/mfsRoutes.js';

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login/register requests per hour
    message: 'Too many authentication attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
const server = http.createServer(app);
initSocket(server);

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Sanitize user input from malicious HTML
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress responses

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(activityLogger);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/storage', express.static(path.join(__dirname, 'storage')));

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

    // In production, return a Supabase Storage public URL format
    // The actual Supabase upload logic can be added here when SUPABASE_URL is set
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
        // Supabase Storage path (file is still saved locally as buffer fallback)
        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${req.file.filename}`;
        return res.json({ url: publicUrl });
    }

    // Development: local file URL
    res.json({ url: `/uploads/${req.file.filename}` });
});

/* --- API Routes --- */

// Admin Modules
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/system', systemRoutes);
app.use('/api/admin/blog', blogRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/attributes', attributeRoutes);
app.use('/api/admin/profile', profileRoutes);
app.use('/api/admin/automation', automationRoutes);

// Core Modules
app.use('/api/fm', fileRoutes); // File Manager
app.use('/api/auth', authLimiter, authRoutes); // Auth
app.use('/api/admin/users', userRoutes); // User Management
app.use('/api/admin/roles', roleRoutes); // Role Management
app.use('/api/comments', commentRoutes); // Comments System
app.use('/api/newsletter', newsletterRoutes); // Newsletter System

// AI Route
app.post('/api/ai/chat', handleAIChat);

app.get('/api/projects/my-projects', async (req, res) => {
    try {
        // In a real app, we'd get userId from req.user (jwt)
        // For testing/mocking, we'll fetch all projects if no auth is present
        const projects = await Project.findAll({
            where: req.user ? { userId: req.user.id } : {}
        });
        res.json(projects);
    } catch {
        res.status(500).json({ error: 'Failed' });
    }
});

// Booking Routes
app.post('/api/bookings', createBooking);
app.get('/api/bookings/my-bookings', getMyBookings);

app.use('/api/projects', projectRoutes); // Project System
app.use('/api/contact', contactRoutes); // Contact System
app.use('/api/chat', chatRoutes); // Live Chat System
app.use('/api/pixel', pixelRoutes); // Pixel & Automation System
app.use('/api/currency', currencyRoutes); // Currency System
app.use('/api/settings', settingsRoutes); // Global Settings
app.use('/api/header', headerRoutes); // Header Management
app.use('/api/footer', footerRoutes); // Footer Management
app.use('/api/appearance', appearanceRoutes); // Appearance System
app.use('/api/payment', paymentRoutes);        // SSLCommerz Payment Gateway
app.use('/api/mfs', mfsRoutes);                // MFS (bKash / Nagad / Rocket)

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Database sync error:', err));

// Health Check
app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date(),
            env: process.env.NODE_ENV
        });
    } catch {
        res.status(503).json({
            status: 'error',
            database: 'disconnected',
            timestamp: new Date()
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} does not exist on this server.`
    });
});

// Global Error Handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(`[Server Error] ${new Date().toISOString()}:`, err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : err.name,
        message: err.message || 'An unexpected error occurred',
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
server.listen(PORT, () => {
    console.log(`[Elite Server] Running on port ${PORT}`);
    console.log(`👉 Environment: ${NODE_ENV}`);
});
