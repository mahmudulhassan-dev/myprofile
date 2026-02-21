import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'portfolio_db';
const DB_HOST = process.env.DB_HOST || 'localhost';

const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `${DB_NAME}-backup-${timestamp}.sql`);

console.log(`🚀 Starting backup for database: ${DB_NAME}...`);

const command = `mysqldump -h ${DB_HOST} -u ${DB_USER} ${DB_PASS ? `-p${DB_PASS}` : ''} ${DB_NAME} > "${backupFile}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Backup failed: ${error.message}`);
        return;
    }
    if (stderr) {
        console.warn(`⚠️ Warning: ${stderr}`);
    }
    console.log(`✅ Backup successfully created at: ${backupFile}`);

    // Optional: Keep only last 7 backups
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith('.sql'))
        .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

    if (files.length > 7) {
        files.slice(7).forEach(f => {
            fs.unlinkSync(path.join(BACKUP_DIR, f.name));
            console.log(`♻️ Deleted old backup: ${f.name}`);
        });
    }
});
