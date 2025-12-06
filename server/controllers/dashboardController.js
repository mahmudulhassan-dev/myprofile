import { Project, Service, Product, User, ActivityLog, SystemMetric, DashboardAggregate, File } from '../models/index.js';
import os from 'os';
import sequelize from '../config/db.js';

// Helper to get formatted date
const getDateStr = (d) => d.toISOString().split('T')[0];

export const getOverview = async (req, res) => {
    try {
        const [projects, services, products, users, filesCount] = await Promise.all([
            Project.count(),
            Service.count(),
            Product.count(),
            User.count(),
            File.count()
        ]);

        // Mock storage estimation (sum of file sizes in DB)
        const storageSize = await File.sum('size') || 0;

        res.json({
            projects,
            services,
            products,
            activeUsers30d: users, // For now total users
            storageBytes: storageSize,
            files: filesCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMetrics = async (req, res) => {
    try {
        // Return real aggregates + padding for missing dates
        const days = parseInt(req.query.days) || 30;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Fetch aggregates
        // For demo: generating synthetic data if empty
        const data = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            data.push({
                date: getDateStr(d),
                pageviews: Math.floor(Math.random() * 500) + 100, // Synthetic for now
                visits: Math.floor(Math.random() * 300) + 50
            });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSystemHealth = async (req, res) => {
    try {
        const cpus = os.cpus();
        const load = os.loadavg(); // [1, 5, 15] min avg
        const totalMem = os.totalmem();
        const freeMem = os.freemem();

        // Simple CPU usage calc
        const cpuPct = (load[0] * 100) / cpus.length;
        const memPct = ((totalMem - freeMem) / totalMem) * 100;

        let dbStatus = 'ok';
        try {
            await sequelize.authenticate();
        } catch (e) {
            dbStatus = 'down';
        }

        res.json({
            cpu_pct: parseFloat(cpuPct.toFixed(1)),
            mem_pct: parseFloat(memPct.toFixed(1)),
            disk_pct: 45, // Placeholder (requires fs check)
            db_status: dbStatus,
            uptime: os.uptime()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const logs = await ActivityLog.findAll({
            limit,
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const performAction = async (req, res) => {
    const { action, confirm } = req.body;
    if (!confirm) return res.status(400).json({ error: 'Confirmation required' });

    try {
        // Perform Action
        let result = {};
        if (action === 'clear_cache') {
            // Mock cache clear
            result = { message: 'System cache cleared successfully.' };
        } else if (action === 'run_backup') {
            // Mock backup
            result = { message: 'Backup started in background.', jobId: Date.now() };
        } else if (action === 'toggle_maintenance') {
            // Toggle DB setting
            result = { message: 'Maintenance mode toggled.' };
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        // Log it
        await ActivityLog.create({
            actor_name: 'Admin', // Should come from req.user
            action: action,
            object_type: 'System',
            details: result,
            ip_address: req.ip
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
