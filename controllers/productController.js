import { Product, ProductVariation, Category, Tag, Attribute, ProductMeta, sequelize } from '../models/index.js';
import slugify from '../utils/slugify.js';
import { Op } from 'sequelize';
import catchAsync from '../utils/catchAsync.js';

// --- Products ---

export const getProducts = catchAsync(async (req, res) => {
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
            { model: ProductVariation, as: 'variations', attributes: ['id', 'sku', 'stock_quantity', 'sale_price'] }
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
});

export const createProduct = catchAsync(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const data = req.body;

        if (!data.title) {
            await t.rollback();
            return res.status(400).json({ error: 'Title is required' });
        }

        // Generate Slug
        if (!data.slug) data.slug = slugify(data.title, { lower: true, strict: true });

        // Ensure unique slug
        const slugExists = await Product.findOne({ where: { slug: data.slug } });
        if (slugExists) {
            data.slug = `${data.slug}-${Date.now()}`;
        }

        const product = await Product.create(data, { transaction: t });

        if (data.tags && Array.isArray(data.tags)) {
            await product.setTags(data.tags, { transaction: t });
        }

        if (data.type === 'variable' && data.variations && Array.isArray(data.variations)) {
            const variations = data.variations.map(v => ({ ...v, productId: product.id }));
            await ProductVariation.bulkCreate(variations, { transaction: t });
        }

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
        throw error;
    }
});

export const getProduct = catchAsync(async (req, res) => {
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
});

export const updateProduct = catchAsync(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            await t.rollback();
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.update(req.body, { transaction: t });

        if (req.body.tags !== undefined) {
            await product.setTags(req.body.tags || [], { transaction: t });
        }

        if (product.type === 'variable' && req.body.variations) {
            await ProductVariation.destroy({ where: { productId: product.id }, transaction: t });
            if (req.body.variations.length > 0) {
                const variations = req.body.variations.map(v => ({ ...v, productId: product.id }));
                await ProductVariation.bulkCreate(variations, { transaction: t });
            }
        }

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
        throw error;
    }
});

export const deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
});

export const bulkAction = catchAsync(async (req, res) => {
    const { ids, action, data } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ error: 'No IDs provided' });

    if (action === 'delete') {
        await Product.destroy({ where: { id: ids } });
    } else if (action === 'restore') {
        await Product.restore({ where: { id: ids } });
    } else if (action === 'update_status') {
        await Product.update({ status: data.status }, { where: { id: ids } });
    }

    res.json({ success: true, message: `Bulk action ${action} completed` });
});

// --- Attributes ---

export const getAttributes = catchAsync(async (req, res) => {
    const attributes = await Attribute.findAll();
    res.json(attributes);
});

export const createAttribute = catchAsync(async (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: 'Name is required' });
    req.body.slug = slugify(req.body.name, { lower: true });
    const attr = await Attribute.create(req.body);
    res.status(201).json(attr);
});

export const updateAttribute = catchAsync(async (req, res) => {
    const attr = await Attribute.findByPk(req.params.id);
    if (!attr) return res.status(404).json({ error: "Attribute not found" });
    await attr.update(req.body);
    res.json(attr);
});

export const deleteAttribute = catchAsync(async (req, res) => {
    const result = await Attribute.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: "Attribute not found" });
    res.json({ message: "Attribute deleted" });
});

export const getDashboardStats = catchAsync(async (req, res) => {
    const [total, outOfStock, lowStock, published] = await Promise.all([
        Product.count(),
        Product.count({ where: { stock_status: 'outofstock' } }),
        Product.count({ where: { stock_quantity: { [Op.lte]: 5 } } }),
        Product.count({ where: { status: 'published' } })
    ]);

    res.json({ total, published, outOfStock, lowStock });
});

export const updateStock = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { stock_quantity, stock_status, manage_stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.update({ stock_quantity, stock_status, manage_stock });

    res.json({ success: true, message: 'Stock updated', product });
});

