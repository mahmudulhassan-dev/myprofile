import { FooterSection, Setting, sequelize } from '../models/index.js';

export const getFooterSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll({
            where: { group: 'footer' }
        });
        const sections = await FooterSection.findAll({
            order: [['order', 'ASC']]
        });

        const settingsMap = {};
        settings.forEach(s => settingsMap[s.key] = s.value);

        res.json({ settings: settingsMap, sections });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateFooterSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        const promises = Object.keys(settings).map(key =>
            Setting.upsert({ key, value: settings[key], group: 'footer' })
        );
        await Promise.all(promises);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addFooterSection = async (req, res) => {
    try {
        const section = await FooterSection.create(req.body);
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateFooterSection = async (req, res) => {
    try {
        const { id } = req.params;
        const section = await FooterSection.findByPk(id);
        if (!section) return res.status(404).json({ error: 'Not found' });
        await section.update(req.body);
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteFooterSection = async (req, res) => {
    try {
        const { id } = req.params;
        await FooterSection.destroy({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSectionOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const transaction = await sequelize.transaction();
        try {
            for (const item of items) {
                await FooterSection.update(
                    { order: item.order },
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
