import { Contact, ContactNote, User, sequelize } from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @desc    Submit Contact Form (Public)
// @route   POST /api/contact/submit
export const submitContact = async (req, res) => {
    try {
        const { full_name, email, phone, subject, message, project_type, budget_range } = req.body;
        const attachment = req.file ? `/uploads/${req.file.filename}` : null;

        // Basic Rate Limit (Simple check)
        const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 mins
        const recent = await Contact.count({
            where: {
                ip_address: req.ip,
                createdAt: { [Op.gt]: cutoff }
            }
        });

        if (recent >= 5) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }

        const contact = await Contact.create({
            full_name,
            email,
            phone,
            subject,
            message,
            project_type,
            budget_range,
            attachment,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            status: 'pending'
        });

        // Notify Admin
        // In a real app, get admin email from settings or DB
        // await sendEmail({
        //     to: process.env.ADMIN_EMAIL || 'admin@example.com',
        //     subject: `New Inquiry: ${subject}`,
        //     html: `<p>From: ${full_name} (${email})</p><p>${message}</p>`
        // });

        // Auto-reply (Optional)
        // await sendEmail({ to: email, subject: 'We received your message', html: '...' });

        res.status(201).json({ message: 'Message sent successfully', id: contact.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get All Contacts (Admin)
// @route   GET /api/admin/contacts
export const getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status && status !== 'All') where.status = status;
        if (search) {
            where[Op.or] = [
                { full_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { subject: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Contact.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({ contacts: rows, total: count, pages: Math.ceil(count / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get Single Contact (Admin)
// @route   GET /api/admin/contacts/:id
export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id, {
            include: [{ model: ContactNote, include: [User] }]
        });
        if (!contact) return res.status(404).json({ error: 'Not found' });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Reply to Contact (Admin)
// @route   POST /api/admin/contacts/:id/reply
export const replyContact = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const contact = await Contact.findByPk(req.params.id);

        if (!contact) return res.status(404).json({ error: 'Not found' });

        // Send Email
        await sendEmail({
            to: contact.email,
            subject: subject || `Re: ${contact.subject}`,
            html: message
        });

        // Log Note
        await ContactNote.create({
            ContactId: contact.id,
            UserId: req.user.id,
            note: `Replied: ${subject}`
        });

        // Update Status
        await contact.update({ status: 'replied' });

        res.json({ message: 'Reply sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update Status (Admin)
// @route   PUT /api/admin/contacts/:id/status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Not found' });

        await contact.update({ status });

        // Log Note (Optional)
        // await ContactNote.create({ ... });

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete Contact (Admin)
// @route   DELETE /api/admin/contacts/:id
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Not found' });

        await contact.destroy();
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Bulk Delete Contacts (Admin)
// @route   POST /api/admin/contacts/bulk-delete
export const bulkDelete = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: 'Invalid IDs' });

        await Contact.destroy({ where: { id: ids } });
        res.json({ message: `Deleted ${ids.length} contacts` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Export Contacts (Admin)
// @route   GET /api/admin/contacts/export
export const exportContacts = async (req, res) => {
    try {
        const { status, search } = req.query;
        const where = {};

        if (status && status !== 'All') where.status = status;
        if (search) {
            where[Op.or] = [
                { full_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { subject: { [Op.like]: `%${search}%` } }
            ];
        }

        const contacts = await Contact.findAll({ where, order: [['createdAt', 'DESC']] });

        // Simple CSV generation
        const fields = ['id', 'full_name', 'email', 'phone', 'subject', 'project_type', 'budget_range', 'status', 'createdAt'];
        const csv = [
            fields.join(','),
            ...contacts.map(c => fields.map(f => `"${String(c[f] || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment(`contacts_${Date.now()}.csv`);
        res.send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
