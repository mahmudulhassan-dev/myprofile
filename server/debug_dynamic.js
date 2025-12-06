
import fs from 'fs';

const log = (msg) => {
    fs.appendFileSync('debug_dynamic_log.txt', msg + '\n');
};

fs.writeFileSync('debug_dynamic_log.txt', 'STARTING DEBUG\n');

(async () => {
    try {
        log('Importing express...');
        await import('express');
        log('PASS: express');

        log('Importing sequelize...');
        await import('./config/db.js');
        log('PASS: sequelize');

        log('Importing models...');
        await import('./models/index.js');
        log('PASS: models');

        log('Importing dashboardRoutes...');
        await import('./routes/dashboardRoutes.js');
        log('PASS: dashboardRoutes');

        log('Importing systemRoutes...');
        await import('./routes/systemRoutes.js');
        log('PASS: systemRoutes');

        log('Importing blogRoutes...');
        await import('./routes/blogRoutes.js');
        log('PASS: blogRoutes');

        log('Importing productRoutes...');
        await import('./routes/productRoutes.js');
        log('PASS: productRoutes');

        log('Importing profileRoutes...');
        await import('./routes/profileRoutes.js');
        log('PASS: profileRoutes');

        // log('Importing fileRoutes...');
        // await import('./routes/fileRoutes.js');
        // log('PASS: fileRoutes');

        log('Importing authRoutes...');
        await import('./routes/authRoutes.js');
        log('PASS: authRoutes');

        log('Importing userRoutes...');
        await import('./routes/userRoutes.js');
        log('PASS: userRoutes');

        log('Importing roleRoutes...');
        await import('./routes/roleRoutes.js');
        log('PASS: roleRoutes');

        log('Importing commentRoutes...');
        await import('./routes/commentRoutes.js');
        log('PASS: commentRoutes');

        log('Importing newsletterRoutes...');
        await import('./routes/newsletterRoutes.js');
        log('PASS: newsletterRoutes');

        log('Importing projectRoutes...');
        await import('./routes/projectRoutes.js');
        log('PASS: projectRoutes');

        log('Importing contactRoutes...');
        await import('./routes/contactRoutes.js');
        log('PASS: contactRoutes');

        log('ALL IMPORTS SUCCESSFUL');
    } catch (e) {
        log('CRASH AT IMPORT:\n' + e.message + '\n' + e.stack);
        process.exit(1);
    }
})();
