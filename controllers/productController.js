import { Product, ProductVariation, Category, Tag, Attribute, ProductReview, ProductMeta, sequelize } from '../models/index.js';
import slugify from '../utils/slugify.js';
import { Op } from 'sequelize';

// --- Products ---

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, category, type, stock_status, min_price, max_price, sort } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) where.title = { [Op.like]: `%${search}%` };
        if (status && status !== 'all') where.status = status;
        if (type && type !== 'all') where.type = type;
        if (stock_status && stock_status !== 'all') where.stock_status = stock_status;
        if (category && category !== 'all') where.category_id = category;

        // Price Filter
        if (min_price || max_price) {
            where.sale_price = {};
            if (min_price) where.sale_price[Op.gte] = min_price;
            if (max_price) where.sale_price[Op.lte] = max_price;
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'price_asc') order = [['sale_price', 'ASC']];
        if (sort === 'price_desc') order = [['sale_price', 'DESC']];
        if (sort === 'name_asc') order = [['title', 'ASC']];

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
                { model: ProductVariation, as: 'variations', attributes: ['id', 'sku', 'stock_quantity', 'sale_price'] } // Light include for listing
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: order,
            distinct: true
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

        // Ensure unique slug
        let slugExists = await Product.findOne({ where: { slug: data.slug } });
        if (slugExists) {
            data.slug = `${data.slug}-${Date.now()}`;
        }

        // Create Product
        const product = await Product.create(data, { transaction: t });

        // Handle Relationships
        if (data.tags && Array.isArray(data.tags)) {
            await product.setTags(data.tags, { transaction: t });
        }

        // Handle Variations
        if (data.type === 'variable' && data.variations && Array.isArray(data.variations)) {
            const variations = data.variations.map(v => ({
                ...v,
                productId: product.id
            }));
            await ProductVariation.bulkCreate(variations, { transaction: t });
        }

        // Handle Meta Data (Custom Fields)
        if (data.meta && Array.isArray(data.meta)) {
            const metaItems = data.meta.map(m => ({
                productId: product.id,
                key: m.key,
                value: typeof m.value === 'object' ? JSON.stringify(m.value) : m.value
            }));
            await ProductMeta.bulkCreate(metaItems, { transaction: t });
        }

        await t.commit();
        res.status(201).json(product);
    } catch (error) {
        await t.rollback();
        console.error("Create Product Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category },
                { model: Tag, through: { attributes: [] } },
                { model: ProductVariation, as: 'variations' },
                { model: ProductMeta, as: 'meta' }
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

        // Update basic fields
        await product.update(req.body, { transaction: t });

        // Update Tags
        if (req.body.tags !== undefined) {
            await product.setTags(req.body.tags || [], { transaction: t });
        }

        // Update Variations (Sync Strategy: Destroy & Recreate usually safest for variations if simple)
        // OR smart update if IDs provided. For MVP Enterprise, lets try generic sync or replace.
        // Replacing is safer to ensure consistency unless order history depends on variation ID.
        // Assuming we replace for now as per "Product Editor" logic usually sending full state.
        if (product.type === 'variable' && req.body.variations) {
            // Delete existing not in new list? Or just wipe?
            // Safer: Wipe all for this product and re-insert. 
            // Warning: This kills order references if they link to variation ID directly. 
            // Ideally we should update existing ones by ID.

            // For now: Simple Replace
            await ProductVariation.destroy({ where: { productId: product.id }, transaction: t });

            if (req.body.variations.length > 0) {
                const variations = req.body.variations.map(v => ({
                    ...v,
                    productId: product.id
                }));
                await ProductVariation.bulkCreate(variations, { transaction: t });
            }
        }

        // Update Meta
        if (req.body.meta) {
            await ProductMeta.destroy({ where: { productId: product.id }, transaction: t });
            if (req.body.meta.length > 0) {
                const metaItems = req.body.meta.map(m => ({
                    productId: product.id,
                    key: m.key,
                    value: typeof m.value === 'object' ? JSON.stringify(m.value) : m.value
                }));
                await ProductMeta.bulkCreate(metaItems, { transaction: t });
            }
        }

        await t.commit();
        res.json(product);
    } catch (error) {
        await t.rollback();
        console.error("Update Product Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy(); // Soft delete if paranoid on, else hard
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const bulkAction = async (req, res) => {
    try {
        const { ids, action, data } = req.body; // data contains value for 'edit'

        if (!ids || !ids.length) return res.status(400).json({ error: 'No IDs provided' });

        if (action === 'delete') {
            await Product.destroy({ where: { id: ids } });
        } else if (action === 'restore') {
            await Product.restore({ where: { id: ids } });
        } else if (action === 'update_status') {
            await Product.update({ status: data.status }, { where: { id: ids } });
        }

        res.json({ success: true, message: `Bulk action ${action} completed` });
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

export const updateAttribute = async (req, res) => {
    try {
        const attr = await Attribute.findByPk(req.params.id);
        if (!attr) return res.status(404).json({ error: "Attribute not found" });
        await attr.update(req.body);
        res.json(attr);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteAttribute = async (req, res) => {
    try {
        await Attribute.destroy({ where: { id: req.params.id } });
        res.json({ message: "Attribute deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const total = await Product.count();
        const outOfStock = await Product.count({ where: { stock_status: 'outofstock' } });
        const lowStock = await Product.count({ where: { stock_quantity: { [Op.lte]: 5 } } });
        const published = await Product.count({ where: { status: 'published' } });

        res.json({
            total,
            published,
            outOfStock,
            lowStock
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
