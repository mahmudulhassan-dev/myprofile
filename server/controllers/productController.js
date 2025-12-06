import { Product, ProductVariation, Category, Tag, Attribute, ProductReview, sequelize } from '../models/index.js';
import slugify from '../utils/slugify.js';
import { Op } from 'sequelize';

// --- Products ---

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, category, type, stock_status } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) where.title = { [Op.like]: `%${search}%` };
        if (status && status !== 'all') where.status = status;
        if (type && type !== 'all') where.type = type;
        if (stock_status && stock_status !== 'all') where.stock_status = stock_status;
        if (category && category !== 'all') where.category_id = category;

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            distinct: true // Important for count with includes
        });

        res.json({
            products: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const data = req.body;

        // Generate Slug
        if (!data.slug) data.slug = slugify(data.title, { lower: true, strict: true });

        // Check duplicate slug
        const exists = await Product.findOne({ where: { slug: data.slug } });
        if (exists) {
            data.slug = `${data.slug}-${Date.now()}`;
        }

        const product = await Product.create(data, { transaction: t });

        // Handle Tags
        if (data.tags && Array.isArray(data.tags)) {
            // Logic to find or create tags and associate
            // Simplified for now, assuming IDs or names passed? 
            // Better to expect Array of IDs for existing tags, or Names for new.
            // Let's assume frontend sends IDs for simplicity in Phase 1
            if (data.tags.length > 0) {
                await product.setTags(data.tags, { transaction: t });
            }
        }

        // Handle Variations if Variable Product
        if (data.type === 'variable' && data.variations) {
            const variations = data.variations.map(v => ({ ...v, product_id: product.id }));
            await ProductVariation.bulkCreate(variations, { transaction: t });
        }

        await t.commit();
        res.status(201).json(product);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category },
                { model: Tag, through: { attributes: [] } },
                { model: ProductVariation, as: 'variations' }
            ]
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update(req.body, { transaction: t });

        // Update Tags
        if (req.body.tags) {
            await product.setTags(req.body.tags, { transaction: t });
        }

        // Update Variations (Complex: Delete old, add new? Or update?)
        // Simple approach: Delete all and re-create for now (or sophisticated sync)
        if (product.type === 'variable' && req.body.variations) {
            await ProductVariation.destroy({ where: { ProductId: product.id }, transaction: t });
            const variations = req.body.variations.map(v => ({ ...v, ProductId: product.id }));
            await ProductVariation.bulkCreate(variations, { transaction: t });
        }

        await t.commit();
        res.json(product);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Attributes ---
export const getAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.findAll();
        res.json(attributes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createAttribute = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.name, { lower: true });
        const attr = await Attribute.create(req.body);
        res.status(201).json(attr);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const total = await Product.count();
        const outOfStock = await Product.count({ where: { stock_status: 'outofstock' } });
        const lowStock = await Product.count({ where: { stock_quantity: { [Op.lte]: 5 } } });

        res.json({
            total,
            outOfStock,
            lowStock
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
