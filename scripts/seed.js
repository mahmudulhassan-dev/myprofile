import sequelize from '../config/db.js';
import {
    Profile, Project, Skill, Service, Product, Page, Setting, User, ActivityLog,
    Role, Permission, BlogPost, Category, Testimonial
} from '../models/index.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    try {
        console.log('🚀 Starting Amanaflow Enterprise Seeder...');
        await sequelize.sync({ force: true });
        console.log('✅ Database synchronized (Force: True).');

        // 1. Roles & Permissions
        const adminRole = await Role.create({ name: 'Super Admin', slug: 'super-admin', is_system: true });
        const editorRole = await Role.create({ name: 'Editor', slug: 'editor', is_system: true });
        console.log('✅ Roles created.');

        // 2. Demo Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('amanaflow123', salt);

        const admin = await User.create({
            username: 'admin',
            email: 'admin@amanaflow.com',
            password: hashedPassword,
            role: 'Admin',
            status: 'Active',
            avatar: '/profile.jpg',
            is_verified: true
        });
        await admin.addRole(adminRole);

        const demoUser = await User.create({
            username: 'mahmud',
            email: 'mahmud@amanaflow.com',
            password: hashedPassword,
            role: 'User',
            status: 'Active',
            avatar: '/profile.jpg'
        });
        console.log('✅ Demo Users created (Password: amanaflow123).');

        // 3. Profile Data
        await Profile.create({
            fullName: 'Mahmudul Hassan',
            username: 'mahmudulhassan',
            designation: 'Enterprise Automation Expert & Full Stack Developer',
            title: 'I build systems that bridge the gap between ideas and reality.',
            shortBio: 'Specialized in Web Development, Business Automation, and Pixel Tracking solutions.',
            longBio: 'With over 5 years of experience in the tech industry, I have helped numerous businesses scale using custom automation tools and high-performance web applications. My expertise lies in React, Node.js, and complex integration patterns.',
            email: ['hello@amanaflow.com', 'support@amanaflow.com'],
            phone: ['+880123456789'],
            whatsapp: '+880123456789',
            website: 'https://botpori.amanaflow.com',
            avatar: '/profile.jpg',
            experience_years: 5.5,
            completed_projects: 120,
            happy_clients: 85,
            work_status: 'Available'
        });
        console.log('✅ Profile seeded.');

        // 4. Skills & Services
        await Skill.bulkCreate([
            { title: 'React.js', level: 95, category: 'Frontend', color: '#61dbfb' },
            { title: 'Node.js', level: 90, category: 'Backend', color: '#68a063' },
            { title: 'MySQL', level: 85, category: 'Database', color: '#00758f' },
            { title: 'Automation', level: 98, category: 'Logic', color: '#ff9900' }
        ]);

        await Service.bulkCreate([
            { title: 'Custom CRM Development', description: 'Tailor-made CRM systems to manage your business effectively.', icon: 'Layout' },
            { title: 'E-commerce Solutions', description: 'High-speed online stores built with React and Node.js.', icon: 'ShoppingBag' },
            { title: 'Pixel & Tracking Setup', description: 'Server-side tracking for Facebook, Google, and TikTok.', icon: 'Activity' }
        ]);
        console.log('✅ Skills and Services seeded.');

        // 5. Projects
        await Project.bulkCreate([
            {
                title: 'Amanaflow Portfolio System',
                slug: 'amanaflow-portfolio',
                status: 'completed',
                type: 'website',
                short_description: 'An enterprise-grade portfolio system for developers.',
                description: 'Full-featured system with automation widgets and SEO management.',
                technologies: ['React', 'Node.js', 'Sequelize'],
                live_url: 'https://botpori.amanaflow.com'
            },
            {
                title: 'BotPori AI Agent',
                slug: 'botpori-ai',
                status: 'in-progress',
                type: 'app',
                short_description: 'AI-driven customer support agent for agencies.',
                description: 'Deep integration with AnyChat API for seamless communication.',
                technologies: ['Python', 'OpenAI', 'Socket.io']
            }
        ]);
        console.log('✅ Projects seeded.');

        // 6. Blog & Categories
        const techCat = await Category.create({ name: 'Technology', slug: 'technology' });
        await BlogPost.create({
            title: 'The Future of Business Automation',
            slug: 'future-of-automation',
            content: '<p>Automation is no longer a luxury...</p>',
            excerpt: 'How AI and automation are changing the landscape of online business.',
            status: 'published',
            CategoryId: techCat.id
        });

        // 7. System Settings
        await Setting.bulkCreate([
            { key: 'site_name', value: 'Amanaflow', group: 'general' },
            { key: 'site_description', value: 'Professional Portfolio & Automation Expert', group: 'general' },
            { key: 'footer_text', value: '© 2026 Mahmudul Hassan | Amanaflow', group: 'general' }
        ]);

        console.log('🌟 Seeding complete! Amanaflow is ready.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
