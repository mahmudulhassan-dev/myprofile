import { MenuItem, Setting, sequelize } from '../models/index.js';

export const getHeaderSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll({
            where: { group: 'header' }
        });
        const menuItems = await MenuItem.findAll({
            order: [['order', 'ASC']],
            include: [{ model: MenuItem, as: 'subItems', include: ['subItems'] }] // Deep nesting usually best handled by recursive frontend, but we can load flat or semi-nested.
        });

        // Convert settings array to object
        const settingsMap = {};
        settings.forEach(s => settingsMap[s.key] = s.value);

        // Build tree manually if needed, or send flat
        res.json({ settings: settingsMap, menu: menuItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateHeaderSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        // settings is { logo_url: '...', header_style: '...' }
        const promises = Object.keys(settings).map(key =>
            Setting.upsert({ key, value: settings[key], group: 'header' })
        );
        await Promise.all(promises);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItem.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        await item.update(req.body);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await MenuItem.destroy({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateMenuOrder = async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, order, parentId }
        const transaction = await sequelize.transaction();
        try {
            for (const item of items) {
                await MenuItem.update(
                    { order: item.order, parentId: item.parentId },
                    { where: { id: item.id }, transaction }
                );
            }
            await transaction.commit();
            res.json({ success: true });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
