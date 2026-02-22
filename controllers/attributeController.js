
import { Attribute, sequelize } from '../models/index.js';
import slugify from '../utils/slugify.js';
import catchAsync from '../utils/catchAsync.js';

export const getAttributes = catchAsync(async (req, res) => {
    const attributes = await Attribute.findAll({ order: [['id', 'DESC']] });
    res.json(attributes);
});

export const createAttribute = catchAsync(async (req, res) => {
    const { name, type, values } = req.body;
    if (!name) return res.status(400).json({ error: 'Attribute name is required' });

    const slug = req.body.slug || slugify(name, { lower: true, strict: true });
    const existing = await Attribute.findOne({ where: { slug } });
    if (existing) return res.status(400).json({ error: 'Attribute with this slug already exists' });

    const attribute = await Attribute.create({
        name,
        slug,
        type: type || 'select',
        values: values || [],
        is_global: true
    });

    res.status(201).json(attribute);
});

export const updateAttribute = catchAsync(async (req, res) => {
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
            return res.status(400).json({ error: 'Slug already used by another attribute' });
        }
        attribute.slug = slug;
    }

    await attribute.save();
    res.json(attribute);
});

export const deleteAttribute = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Attribute.destroy({ where: { id } });
    if (!result) return res.status(404).json({ error: 'Attribute not found' });
    res.json({ message: 'Attribute deleted' });
});
