
import { Attribute, sequelize } from '../models/index.js';
import slugify from 'slugify';

export const getAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.findAll({ order: [['id', 'DESC']] });
        res.json(attributes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attributes' });
    }
};

export const createAttribute = async (req, res) => {
    try {
        const { name, type, values } = req.body;
        const slug = req.body.slug || slugify(name, { lower: true, strict: true });

        // Ensure unique slug
        const existing = await Attribute.findOne({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: 'Attribute slug already exists' });
        }

        const attribute = await Attribute.create({
            name,
            slug,
            type: type || 'select',
            values: values || [],
            is_global: true
        });

        res.status(201).json(attribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create attribute' });
    }
};

export const updateAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, type, values } = req.body;

        const attribute = await Attribute.findByPk(id);
        if (!attribute) return res.status(404).json({ error: 'Attribute not found' });

        if (name) attribute.name = name;
        if (type) attribute.type = type;
        if (values) attribute.values = values;

        if (slug && slug !== attribute.slug) {
            const existing = await Attribute.findOne({ where: { slug } });
            if (existing && existing.id !== parseInt(id)) {
                return res.status(400).json({ error: 'Slug already used' });
            }
            attribute.slug = slug;
        }

        await attribute.save();
        res.json(attribute);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update attribute' });
    }
};

export const deleteAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const attribute = await Attribute.findByPk(id);
        if (!attribute) return res.status(404).json({ error: 'Attribute not found' });

        await attribute.destroy();
        res.json({ message: 'Attribute deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete attribute' });
    }
};
