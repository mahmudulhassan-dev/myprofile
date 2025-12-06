import dotenv from 'dotenv';
dotenv.config();
import { sequelize, Contact } from '../server/models/index.js';

const seedContacts = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const contacts = [
            {
                full_name: 'John Doe',
                email: 'john@example.com',
                phone: '123-456-7890',
                subject: 'Website Redesign',
                message: 'Hi, I need a complete redesign of my corporate website. Can you send a quote?',
                project_type: 'Website',
                budget_range: '$1000+',
                status: 'pending',
                ip_address: '192.168.1.1',
                createdAt: new Date()
            },
            {
                full_name: 'Sarah Smith',
                email: 'sarah.design@studio.com',
                subject: 'Partnership Opportunity',
                message: 'We are looking for a frontend developer partner. Are you available?',
                project_type: 'Other',
                budget_range: '$300-1000',
                status: 'replied',
                ip_address: '10.0.0.5',
                createdAt: new Date(Date.now() - 86400000) // 1 day ago
            },
            {
                full_name: 'Michael Brown',
                email: 'mike@tech.co',
                subject: 'Mobile App Bug Fix',
                message: 'Our React Native app is crashing on iOS 17. Need urgent help.',
                project_type: 'App Development',
                budget_range: '$100-300',
                status: 'pending',
                ip_address: '172.16.0.1',
                createdAt: new Date(Date.now() - 172800000) // 2 days ago
            },
            {
                full_name: 'Spam Bot',
                email: 'winner@lottery.com',
                subject: 'YOU WON $1M!!!',
                message: 'Click here to claim your prize now!',
                project_type: 'Marketing',
                budget_range: '$1000+',
                status: 'archived',
                ip_address: '0.0.0.0',
                createdAt: new Date(Date.now() - 500000000)
            },
            {
                full_name: 'Emma Watson',
                email: 'emma@hollywood.com',
                subject: 'Portfolio Site',
                message: 'I love your work! I need a minimal portfolio site.',
                project_type: 'Website',
                budget_range: '$300-1000',
                status: 'pending',
                ip_address: '192.168.1.10',
                createdAt: new Date()
            }
        ];

        for (const c of contacts) {
            await Contact.create(c);
        }

        console.log(`Seeded ${contacts.length} contacts.`);
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedContacts();
