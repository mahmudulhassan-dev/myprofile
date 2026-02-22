import { Contact, ContactNote, User } from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';
import automationService from '../services/automationService.js';
import { Op } from 'sequelize';
import process from 'process';
import catchAsync from '../utils/catchAsync.js';

// @desc    Submit Contact Form (Public)
// @route   POST /api/contact/submit
export const submitContact = catchAsync(async (req, res) => {
    const { full_name, email, phone, subject, message, project_type, budget_range } = req.body;

    if (!full_name || !email || !subject || !message) {
        return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic Rate Limit
    const cutoff = new Date(Date.now() - 10 * 60 * 1000); // 10 mins
    const recent = await Contact.count({
        where: {
            ip_address: req.ip,
            createdAt: { [Op.gt]: cutoff }
        }
    });

    if (recent >= 5) {
        return res.status(429).json({ status: 'error', message: 'Too many requests. Please try again later.' });
    }

    const ua = req.get('User-Agent') || '';
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

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
        user_agent: ua,
        browser,
        status: 'pending'
    });

    // Notify Admin & User (Non-blocking)
    sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: `New Inquiry: ${subject}`,
        html: `<h3>New Contact Message</h3><p><strong>From:</strong> ${full_name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p>${message}</p>`
    }).catch(err => console.error('Admin notification failed:', err));

    sendEmail({
        to: email,
        subject: 'Inquiry Received',
        html: `<p>Hi ${full_name}, we received your message regarding "${subject}" and will respond soon.</p>`
    }).catch(err => console.error('User auto-reply failed:', err));

    // Fire Automation
    automationService.trigger('new_contact', {
        id: contact.id,
        fullName: full_name,
        email,
        subject,
        message,
        projectType: project_type
    });

    res.status(201).json({ status: 'success', message: 'Message sent successfully', id: contact.id });
});

export const getContacts = catchAsync(async (req, res) => {
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

    res.json({ status: 'success', data: { contacts: rows, total: count, pages: Math.ceil(count / limit) } });
});

export const getContact = catchAsync(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id, {
        include: [{ model: ContactNote, include: [User] }]
    });
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
});

export const replyContact = catchAsync(async (req, res) => {
    const { subject, message } = req.body;
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });

    await sendEmail({
        to: contact.email,
        subject: subject || `Re: ${contact.subject}`,
        html: message
    });

    await ContactNote.create({
        ContactId: contact.id,
        UserId: req.user.id,
        note: `Replied: ${subject}`
    });

    await contact.update({ status: 'replied' });
    res.json({ message: 'Reply sent' });
});

export const updateStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    await contact.update({ status });
    res.json(contact);
});

export const deleteContact = catchAsync(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Not found' });
    await contact.destroy();
    res.json({ message: 'Deleted' });
});

export const bulkDelete = catchAsync(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: 'Invalid IDs' });
    await Contact.destroy({ where: { id: ids } });
    res.json({ message: `Deleted ${ids.length} contacts` });
});

export const exportContacts = catchAsync(async (req, res) => {
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

    const fields = ['id', 'full_name', 'email', 'phone', 'subject', 'project_type', 'budget_range', 'status', 'createdAt'];
    const csv = [
        fields.join(','),
        ...contacts.map(c => fields.map(f => `"${String(c[f] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`contacts_${Date.now()}.csv`);
    res.send(csv);
});
