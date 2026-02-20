import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import { sequelize, Setting } from '../server/models/index.js';

const seedSettings = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Define default settings
        const settings = [
            { key: 'site_title', value: 'My Portfolio', group: 'general' },
            { key: 'site_description', value: 'Professional Portfolio and Service Showcase', group: 'general' },
            { key: 'contact_email', value: 'contact@amanmart.com', group: 'contact' },
            { key: 'contact_phone', value: '+880 1712 345 678', group: 'contact' },
            { key: 'contact_address', value: 'Dhaka, Bangladesh', group: 'contact' },
            { key: 'footer_copyright', value: '© 2025 Antigravity. All rights reserved.', group: 'footer' },
            { key: 'primary_color', value: '#4f46e5', group: 'appearance' }
        ];

        console.log('Seeding settings...');

        for (const setting of settings) {
            const [record, created] = await Setting.findOrCreate({
                where: { key: setting.key },
                defaults: setting
            });

            if (created) {
                console.log(`Created setting: ${setting.key}`);
            } else {
                console.log(`Updated setting: ${setting.key}`);
                await record.update(setting);
            }
        }

        console.log('Settings seeded successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedSettings();
