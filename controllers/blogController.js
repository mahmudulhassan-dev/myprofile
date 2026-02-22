import { BlogPost, Category, Tag, Comment, User, sequelize } from '../models/index.js';
import slugify from '../utils/slugify.js';
import { Op } from 'sequelize';
import catchAsync from '../utils/catchAsync.js';

// --- Posts ---

export const getPosts = catchAsync(async (req, res) => {
    const { status, page = 1, limit = 10, search, category, tag } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== 'All') where.status = status;

    if (search) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { content: { [Op.like]: `%${search}%` } }
        ];
    }

    const include = [
        {
            model: Category,
            where: category ? { [Op.or]: [{ id: category }, { slug: category }] } : undefined
        },
        {
            model: Tag,
            where: tag ? { [Op.or]: [{ id: tag }, { slug: tag }] } : undefined,
            through: { attributes: [] }
        },
        { model: User }
    ];

    const { count, rows } = await BlogPost.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true,
        order: [
            ['is_featured', 'DESC'],
            ['createdAt', 'DESC']
        ]
    });

    res.json({ posts: rows, total: count, pages: Math.ceil(count / limit) });
});

export const createPost = catchAsync(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, tags, categoryId, ...data } = req.body;
        if (!title) {
            await t.rollback();
            return res.status(400).json({ error: 'Title is required' });
        }

        let slug = data.slug || slugify(title, { lower: true, strict: true });
        const exists = await BlogPost.findOne({ where: { slug } });
        if (exists) slug = `${slug}-${Date.now()}`;

        const post = await BlogPost.create({
            title,
            slug,
            CategoryId: categoryId,
            ...data
        }, { transaction: t });

        if (tags && tags.length > 0) {
            const tagInstances = [];
            for (const tagName of tags) {
                const [tag] = await Tag.findOrCreate({
                    where: { name: tagName.trim() },
                    defaults: { slug: slugify(tagName, { lower: true }) },
                    transaction: t
                });
                tagInstances.push(tag);
            }
            await post.setTags(tagInstances, { transaction: t });
        }

        await t.commit();
        res.json(post);
    } catch (error) {
        await t.rollback();
        throw error;
    }
});

export const updatePost = catchAsync(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { tags, categoryId, ...data } = req.body;

        const post = await BlogPost.findByPk(id);
        if (!post) {
            await t.rollback();
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.update({ ...data, CategoryId: categoryId }, { transaction: t });

        if (tags !== undefined) {
            const tagInstances = [];
            const tagList = Array.isArray(tags) ? tags : [];

            for (const tagName of tagList) {
                const [tag] = await Tag.findOrCreate({
                    where: { name: tagName.trim() },
                    defaults: { slug: slugify(tagName, { lower: true }) },
                    transaction: t
                });
                tagInstances.push(tag);
            }
            await post.setTags(tagInstances, { transaction: t });
        }

        await t.commit();
        res.json(post);
    } catch (error) {
        await t.rollback();
        throw error;
    }
});

export const deletePost = catchAsync(async (req, res) => {
    const result = await BlogPost.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
});

export const getPost = catchAsync(async (req, res) => {
    const { identifier } = req.params;
    const where = isNaN(identifier) ? { slug: identifier } : { id: identifier };

    const post = await BlogPost.findOne({
        where,
        include: [
            Category,
            Tag,
            {
                model: Comment,
                where: { is_approved: true },
                required: false,
                include: [User]
            }
        ]
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.increment('views');
    res.json(post);
});

export const incrementView = catchAsync(async (req, res) => {
    await BlogPost.increment('views', { where: { id: req.params.id } });
    res.json({ success: true });
});

// --- Categories ---

export const getCategories = catchAsync(async (req, res) => {
    const categories = await Category.findAll({
        include: [{ model: BlogPost, attributes: ['id'] }]
    });

    const data = categories.map(c => ({
        ...c.toJSON(),
        count: c.BlogPosts ? c.BlogPosts.length : 0
    }));

    res.json(data);
});

export const createCategory = catchAsync(async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const slug = req.body.slug || slugify(name, { lower: true });
    const category = await Category.create({ ...req.body, slug });
    res.json(category);
});

export const updateCategory = catchAsync(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    await category.update(req.body);
    res.json(category);
});

export const deleteCategory = catchAsync(async (req, res) => {
    const result = await Category.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
});

// --- Tags ---

export const getTags = catchAsync(async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

