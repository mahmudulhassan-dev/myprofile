
import express from 'express';
console.log('Checkpoint 1: Express');
import cors from 'cors';
console.log('Checkpoint 2: Cors');
import path from 'path';
import { fileURLToPath } from 'url';
console.log('Checkpoint 3: Path/Url');
import multer from 'multer';
console.log('Checkpoint 4: Multer');
import fs from 'fs';
console.log('Checkpoint 5: FS');

import sequelize from './config/db.js';
console.log('Checkpoint 6: DB');

import {
    Profile, Project
} from './models/index.js';
console.log('Checkpoint 7: Models');

import dashboardRoutes from './routes/dashboardRoutes.js';
console.log('Checkpoint 8: Dashboard Routes');

import systemRoutes from './routes/systemRoutes.js';
console.log('Checkpoint 9: System Routes');

import blogRoutes from './routes/blogRoutes.js';
console.log('Checkpoint 10: Blog Routes');

import productRoutes from './routes/productRoutes.js';
console.log('Checkpoint 11: Product Routes');

import profileRoutes from './routes/profileRoutes.js';
console.log('Checkpoint 12: Profile Routes');

// import fileRoutes from './routes/fileRoutes.js';
console.log('Checkpoint 13: File Routes SKIPPED');

import authRoutes from './routes/authRoutes.js';
console.log('Checkpoint 14: Auth Routes');

import userRoutes from './routes/userRoutes.js';
console.log('Checkpoint 15: User Routes');

import roleRoutes from './routes/roleRoutes.js';
console.log('Checkpoint 16: Role Routes');

console.log('ALL IMPORTS PASSED');
