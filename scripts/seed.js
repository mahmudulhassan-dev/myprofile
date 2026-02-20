import sequelize from './config/db.js';
import { Profile, Project, Skill, Service, Product, Page, Setting, User, ActivityLog } from './models/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_JSON_PATH = path.join(__dirname, 'db.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced. Seeding data...');

        // 1. Create Admin User
        await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin',
            role: 'Admin',
            status: 'Active',
            avatar: '/profile.jpg'
        });
        console.log('Admin user created (admin/admin).');

        // 2. Load other data from db.json
        let data = {};
        try {
            const rawData = await fs.readFile(DB_JSON_PATH, 'utf-8');
            data = JSON.parse(rawData);
        } catch (e) {
            console.log('No db.json found or invalid, skipping content seeding.');
        }

        if (data.profile) await Profile.create(data.profile);
        if (data.projects) await Project.bulkCreate(data.projects);
        if (data.skills) await Skill.bulkCreate(data.skills.map(s => ({ ...s, key: s.id || s.key })));
        if (data.services) await Service.bulkCreate(data.services);
        if (data.products) await Product.bulkCreate(data.products);
        if (data.pages) await Page.bulkCreate(data.pages);

        if (data.footer) {
            await Setting.create({ key: 'footer_config', value: JSON.stringify(data.footer), group: 'footer' });
            console.log('Footer settings seeded.');
        }

        // 3. Seed Mock Activity Logs
        await ActivityLog.bulkCreate([
            { actor_name: 'Admin', action: 'login', object_type: 'Auth', ip_address: '127.0.0.1', details: {} },
            { actor_name: 'Admin', action: 'create_project', object_type: 'Project', object_id: '1', ip_address: '127.0.0.1', details: { title: 'New Portfolio' } },
            { actor_name: 'System', action: 'backup_auto', object_type: 'Backup', ip_address: 'localhost', details: { status: 'success' } },
            { actor_name: 'Admin', action: 'clear_cache', object_type: 'System', ip_address: '127.0.0.1', details: {} }
        ]);
        console.log('Mock Activity Logs seeded.');

        console.log('Seeding complete.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
