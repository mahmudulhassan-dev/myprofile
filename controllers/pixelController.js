import { PixelConfig, PixelEvent, CustomScript, PixelLog } from '../models/index.js';
import catchAsync from '../utils/catchAsync.js';

// --- Public Loader ---

export const getActivePixels = catchAsync(async (req, res) => {
    const configs = await PixelConfig.findAll({ where: { is_active: true } });
    const events = await PixelEvent.findAll({ where: { is_active: true } });
    const scripts = await CustomScript.findAll({ where: { is_active: true } });
    res.json({ pixels: configs, events, scripts });
});

export const logEvent = catchAsync(async (req, res) => {
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
});

// --- Admin Management ---

// 1. Pixel Configs
export const getConfigs = catchAsync(async (req, res) => {
    const configs = await PixelConfig.findAll();
    res.json(configs);
});

export const updateConfig = catchAsync(async (req, res) => {
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
});

// 2. Events
export const getEvents = catchAsync(async (req, res) => {
    const events = await PixelEvent.findAll();
    res.json(events);
});

export const createEvent = catchAsync(async (req, res) => {
    const event = await PixelEvent.create(req.body);
    res.json(event);
});

export const updateEvent = catchAsync(async (req, res) => {
    const event = await PixelEvent.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.update(req.body);
    res.json(event);
});

export const deleteEvent = catchAsync(async (req, res) => {
    await PixelEvent.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
});

// 3. Scripts
export const getScripts = catchAsync(async (req, res) => {
    const scripts = await CustomScript.findAll();
    res.json(scripts);
});

export const createScript = catchAsync(async (req, res) => {
    const script = await CustomScript.create(req.body);
    res.json(script);
});

export const updateScript = catchAsync(async (req, res) => {
    const script = await CustomScript.findByPk(req.params.id);
    if (!script) return res.status(404).json({ message: 'Script not found' });
    await script.update(req.body);
    res.json(script);
});

export const deleteScript = catchAsync(async (req, res) => {
    await CustomScript.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Script deleted' });
});

// 4. Logs
export const getLogs = catchAsync(async (req, res) => {
    const logs = await PixelLog.findAll({
        limit: 100,
        order: [['createdAt', 'DESC']]
    });
    res.json(logs);
});
