import { NewsletterCampaign, Subscriber, NewsletterLog } from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';
import { Op } from 'sequelize';

// @desc    Get Campaigns
// @route   GET /api/admin/newsletter/campaigns
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await NewsletterCampaign.findAll({ order: [['createdAt', 'DESC']] });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create Campaign
// @route   POST /api/admin/newsletter/campaigns
export const createCampaign = async (req, res) => {
    try {
        const campaign = await NewsletterCampaign.create(req.body);
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update Campaign
// @route   PUT /api/admin/newsletter/campaigns/:id
export const updateCampaign = async (req, res) => {
    try {
        const campaign = await NewsletterCampaign.findByPk(req.params.id);
        if (!campaign) return res.status(404).json({ error: 'Not found' });
        await campaign.update(req.body);
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Send Campaign (Simple Loop)
// @route   POST /api/admin/newsletter/campaigns/:id/send
export const sendCampaign = async (req, res) => {
    try {
        const campaign = await NewsletterCampaign.findByPk(req.params.id);
        if (!campaign) return res.status(404).json({ error: 'Not found' });

        if (campaign.status === 'Sent') return res.status(400).json({ error: 'Already sent' });

        // Get Active Subscribers
        const subscribers = await Subscriber.findAll({ where: { status: 'Subscribed' } });

        // Update Status
        await campaign.update({ status: 'Sending', sent_at: new Date() });

        // Send Loop (Async in background in real production, simplified here)
        // We will do it in chunks or simple loop for now
        let sentCount = 0;
        let failedCount = 0;

        // Using simple iteration. For 1000s of emails, use a queue (Bull)
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Track Open (Pixel)
// @route   GET /api/newsletter/track/open/:logId
export const trackOpen = async (req, res) => {
    try {
        const log = await NewsletterLog.findByPk(req.params.logId);
        if (log && log.status !== 'Opened') {
            await log.update({ status: 'Opened', opened_at: new Date() });
            // Update Campaign Stats
            const campaign = await NewsletterCampaign.findByPk(log.NewsletterCampaignId);
            await campaign.update({ stats: { ...campaign.stats, opened: campaign.stats.opened + 1 } });
        }
        // Return 1x1 transparent gif
        const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': img.length,
        });
        res.end(img);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
};
