import { PixelConfig, PixelEvent, CustomScript, PixelLog } from '../models/index.js';

// --- Public Loader ---

export const getActivePixels = async (req, res) => {
    try {
        const configs = await PixelConfig.findAll({ where: { is_active: true } });
        const events = await PixelEvent.findAll({ where: { is_active: true } });
        const scripts = await CustomScript.findAll({ where: { is_active: true } });

        res.json({
            pixels: configs,
            events: events,
            scripts: scripts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active pixels', error: error.message });
    }
};

export const logEvent = async (req, res) => {
    try {
        const { event_name, platform, status, details, url } = req.body;
        await PixelLog.create({
            event_name,
            platform,
            status,
            details: JSON.stringify(details),
            url,
            user_agent: req.headers['user-agent'],
            ip_address: req.ip
        });
        res.status(200).json({ message: 'Log saved' });
    } catch (error) {
        // Silent fail for logging
        res.status(500).json({ message: 'Error logging' });
    }
};

// --- Admin Management ---

// 1. Pixel Configs
export const getConfigs = async (req, res) => {
    try {
        const configs = await PixelConfig.findAll();
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateConfig = async (req, res) => {
    try {
        const { platform, pixel_id, is_active, settings } = req.body;
        let config = await PixelConfig.findOne({ where: { platform } });

        if (config) {
            config.pixel_id = pixel_id;
            config.is_active = is_active;
            config.settings = settings;
            await config.save();
        } else {
            config = await PixelConfig.create({ platform, pixel_id, is_active, settings });
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Events
export const getEvents = async (req, res) => {
    try {
        const events = await PixelEvent.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = await PixelEvent.create(req.body);
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await PixelEvent.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.update(req.body);
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await PixelEvent.destroy({ where: { id } });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Scripts
export const getScripts = async (req, res) => {
    try {
        const scripts = await CustomScript.findAll();
        res.json(scripts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createScript = async (req, res) => {
    try {
        const script = await CustomScript.create(req.body);
        res.json(script);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateScript = async (req, res) => {
    try {
        const { id } = req.params;
        const script = await CustomScript.findByPk(id);
        if (!script) return res.status(404).json({ message: 'Script not found' });
        await script.update(req.body);
        res.json(script);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteScript = async (req, res) => {
    try {
        const { id } = req.params;
        await CustomScript.destroy({ where: { id } });
        res.json({ message: 'Script deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Logs
export const getLogs = async (req, res) => {
    try {
        const logs = await PixelLog.findAll({
            limit: 100,
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
