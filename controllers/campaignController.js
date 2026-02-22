import { NewsletterCampaign, Subscriber, NewsletterLog } from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';
import { Op } from 'sequelize';
import catchAsync from '../utils/catchAsync.js';
import process from 'process';

// @desc    Get Campaigns
// @route   GET /api/admin/newsletter/campaigns
export const getCampaigns = catchAsync(async (req, res) => {
    const campaigns = await NewsletterCampaign.findAll({ order: [['createdAt', 'DESC']] });
    res.json(campaigns);
});

// @desc    Create Campaign
// @route   POST /api/admin/newsletter/campaigns
export const createCampaign = catchAsync(async (req, res) => {
    if (!req.body.subject || !req.body.content) {
        return res.status(400).json({ error: 'Subject and Content are required' });
    }
    const campaign = await NewsletterCampaign.create(req.body);
    res.json(campaign);
});

// @desc    Update Campaign
// @route   PUT /api/admin/newsletter/campaigns/:id
export const updateCampaign = catchAsync(async (req, res) => {
    const campaign = await NewsletterCampaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    await campaign.update(req.body);
    res.json(campaign);
});

// @desc    Send Campaign
// @route   POST /api/admin/newsletter/campaigns/:id/send
export const sendCampaign = catchAsync(async (req, res) => {
    const campaign = await NewsletterCampaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    if (campaign.status === 'Sent') return res.status(400).json({ error: 'Already sent' });

    const subscribers = await Subscriber.findAll({ where: { status: 'Subscribed' } });
    await campaign.update({ status: 'Sending', sent_at: new Date() });

    let sentCount = 0;
    let failedCount = 0;

    for (const sub of subscribers) {
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
        const footer = `<hr/><small><a href="${unsubscribeUrl}">Unsubscribe</a></small>`;

        const result = await sendEmail({
            to: sub.email,
            subject: campaign.subject,
            html: campaign.content + footer
        });

        if (result.success) {
            sentCount++;
            await NewsletterLog.create({
                NewsletterCampaignId: campaign.id,
                SubscriberId: sub.id,
                status: 'Sent'
            });
        } else {
            failedCount++;
            await NewsletterLog.create({
                NewsletterCampaignId: campaign.id,
                SubscriberId: sub.id,
                status: 'Failed',
                error_message: result.error
            });
        }
    }

    await campaign.update({
        status: 'Sent',
        stats: {
            ...campaign.stats,
            sent: sentCount,
            failed: failedCount
        }
    });

    res.json({ message: `Campaign sent to ${sentCount} subscribers` });
});

// @desc    Track Open (Pixel)
// @route   GET /api/newsletter/track/open/:logId
export const trackOpen = catchAsync(async (req, res) => {
    const log = await NewsletterLog.findByPk(req.params.logId);
    if (log && log.status !== 'Opened') {
        await log.update({ status: 'Opened', opened_at: new Date() });
        const campaign = await NewsletterCampaign.findByPk(log.NewsletterCampaignId);
        if (campaign) {
            await campaign.update({ stats: { ...campaign.stats, opened: (campaign.stats.opened || 0) + 1 } });
        }
    }

    const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': img.length,
    });
    res.end(img);
});
