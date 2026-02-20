import { Subscriber, NewsletterGroup, sequelize } from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';
import crypto from 'crypto';
import { Op } from 'sequelize';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
export const subscribe = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, source } = req.body;

        if (!email) return res.status(400).json({ error: 'Email is required' });

        // Check if exists
        const existing = await Subscriber.findOne({ where: { email } });
        if (existing && existing.status === 'Subscribed') {
            await t.rollback();
            return res.status(400).json({ message: 'Already subscribed' });
        }

        const verifyToken = crypto.randomBytes(32).toString('hex');
        const unsubscribeToken = crypto.randomBytes(32).toString('hex');

        let subscriber;
        if (existing) {
            subscriber = await existing.update({
                verify_token: verifyToken,
                status: 'Pending', // Re-verify if re-subscribing
                source: source || existing.source
            }, { transaction: t });
        } else {
            subscriber = await Subscriber.create({
                email,
                source,
                status: 'Pending',
                verify_token: verifyToken,
                unsubscribe_token: unsubscribeToken,
                ip_address: req.ip
            }, { transaction: t });
        }

        // Send Confirmation Email
        const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/confirm?token=${verifyToken}`;
        await sendEmail({
            to: email,
            subject: 'Confirm your subscription',
            html: `<p>Please click the link below to verify your email:</p><a href="${confirmUrl}">Confirm Subscription</a>`
        });

        await t.commit();
        res.status(201).json({ message: 'Confirmation email sent' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

// @desc    Confirm subscription
// @route   POST /api/newsletter/confirm
export const confirm = async (req, res) => {
    try {
        const { token } = req.body;
        const subscriber = await Subscriber.findOne({ where: { verify_token: token } });

        if (!subscriber) return res.status(400).json({ error: 'Invalid token' });

        await subscriber.update({
            status: 'Subscribed',
            verified_at: new Date(),
            verify_token: null
        });

        res.json({ message: 'Subscription confirmed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Unsubscribe
// @route   POST /api/newsletter/unsubscribe
export const unsubscribe = async (req, res) => {
    try {
        const { token } = req.body;
        const subscriber = await Subscriber.findOne({ where: { unsubscribe_token: token } });

        if (!subscriber) return res.status(400).json({ error: 'Invalid token' });

        await subscriber.update({ status: 'Unsubscribed' });
        res.json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all subscribers (Admin)
// @route   GET /api/admin/newsletter/subscribers
export const getSubscribers = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status && status !== 'All') where.status = status;
        if (search) where.email = { [Op.like]: `%${search}%` };

        const { count, rows } = await Subscriber.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({ subscribers: rows, total: count, pages: Math.ceil(count / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Import subscribers (Admin)
// @route   POST /api/admin/newsletter/subscribers/import
export const importSubscribers = async (req, res) => {
    try {
        const { emails } = req.body; // Array of emails
        if (!Array.isArray(emails)) return res.status(400).json({ error: 'Invalid format' });

        const inputs = emails.map(email => ({
            email: email,
            status: 'Subscribed', // Auto verify imported
            source: 'Import',
            ip_address: '0.0.0.0',
            unsubscribe_token: crypto.randomBytes(32).toString('hex')
        }));

        await Subscriber.bulkCreate(inputs, { ignoreDuplicates: true });
        res.json({ message: 'Imported successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
