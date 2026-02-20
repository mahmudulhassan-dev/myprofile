import {
    Product, Service, BlogPost, Project, Contact, User, Subscriber, Order,
    ActivityLog, SystemMetric, Currency
} from '../models/index.js';
import systeminformation from 'systeminformation';
import { Op } from 'sequelize';

// --- Aggregation ---
export const getOverviewStats = async (req, res) => {
    try {
        const [
            products, services, posts, projects,
            contacts, users, subscribers, orders
        ] = await Promise.all([
            Product.count(),
            Service.count(),
            BlogPost.count(),
            Project.count(),
            Contact.count(),
            User.count(),
            Subscriber.count(),
            Order.count()
        ]);

        res.json({
            products, services, posts, projects,
            contacts, users, subscribers, orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFinancialStats = async (req, res) => {
    try {
        // Aggregate Orders
        const orders = await Order.findAll({
            where: { payment_status: 'Paid' },
            attributes: ['amount', 'createdAt']
        });

        const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

        // Mock Expense (Can be expanded to real Expense model later)
        const totalExpense = totalRevenue * 0.2; // 20% mock expense
        const netProfit = totalRevenue - totalExpense;

        // Monthly Breakdown for Charts
        const monthlyData = {};
        orders.forEach(o => {
            const date = new Date(o.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!monthlyData[key]) monthlyData[key] = 0;
            monthlyData[key] += parseFloat(o.amount || 0);
        });

        const chartData = Object.keys(monthlyData).map(k => ({
            name: k,
            revenue: monthlyData[k],
            expense: monthlyData[k] * 0.2,
            profit: monthlyData[k] * 0.8
        }));

        res.json({
            totalRevenue,
            totalExpense,
            netProfit,
            chartData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- System ---
export const getSystemStats = async (req, res) => {
    try {
        const [cpu, mem, disk] = await Promise.all([
            systeminformation.currentLoad(),
            systeminformation.mem(),
            systeminformation.fsSize()
        ]);

        const stats = {
            cpu: Math.round(cpu.currentLoad),
            memory: Math.round((mem.active / mem.total) * 100),
            disk: Math.round(disk[0] ? disk[0].use : 0),
            uptime: systeminformation.time().uptime
        };

        // Log this metric for history (Optional, can be throttled)
        // await SystemMetric.create({ ... });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "System Monitor Error" });
    }
};

// --- Logs ---
export const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            limit: 50,
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
