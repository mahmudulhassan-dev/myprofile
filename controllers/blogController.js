import { BlogPost, Category, Tag, Comment, User, sequelize } from '../models/index.js';
import slugify from '../utils/slugify.js';
import { Op } from 'sequelize';

// --- Posts ---

export const getPosts = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search, category, tag } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        // Status Filter
        if (status && status !== 'All') where.status = status;

        // Search Filter (Title or Content)
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } }
            ];
        }

        // Category Filter
        if (category) {
            // If category is a slug or ID, logic might differ. Assuming ID for admin, but let's handle both optionally later.
            // For now, simple ID match if passed, or we join.
            // To make it robust:
            // logic moved to include
        }

        // Prepare Includes
        const include = [
            {
                model: Category,
                where: category ? { [Op.or]: [{ id: category }, { slug: category }] } : undefined
            },
            {
                model: Tag,
                where: tag ? { [Op.or]: [{ id: tag }, { slug: tag }] } : undefined,
                through: { attributes: [] } // Hide junction table
            },
            {
                model: User, // Author (if we add Author to Post later, for now we don't have AuthorId on Post, skipping)
            }
        ];

        const { count, rows } = await BlogPost.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true, // Important for counts with Includes
            order: [
                ['is_featured', 'DESC'], // Featured first
                ['createdAt', 'DESC']
            ]
        });

        res.json({ posts: rows, total: count, pages: Math.ceil(count / limit) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { title, tags, categoryId, ...data } = req.body;

        // Auto Slug
        let slug = data.slug || slugify(title, { lower: true, strict: true });

        // Check Unique Slug
        const exists = await BlogPost.findOne({ where: { slug } });
        if (exists) {
            slug = `${slug}-${Date.now()}`;
        }

        const post = await BlogPost.create({
            title,
            slug,
            CategoryId: categoryId,
            ...data
        }, { transaction: t });

        if (tags && tags.length > 0) {
            // Tags can be array of strings or IDs. Assuming strings for simple editor.
            const tagInstances = [];
            for (const tagName of tags) {
                const [tag] = await Tag.findOrCreate({
                    where: { name: tagName },
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
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { tags, categoryId, ...data } = req.body;

        const post = await BlogPost.findByPk(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Update basic fields
        await post.update({
            ...data,
            CategoryId: categoryId
        }, { transaction: t });

        // Update Tags
        if (tags !== undefined) { // Check undefined to allow empty array to clear tags
            const tagInstances = [];
            const tagList = Array.isArray(tags) ? tags : []; // Handle potential non-array

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
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        await BlogPost.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { identifier } = req.params; // Can be ID or Slug
        const where = isNaN(identifier) ? { slug: identifier } : { id: identifier };

        const post = await BlogPost.findOne({
            where,
            include: [
                Category,
                Tag,
                {
                    model: Comment,
                    where: { is_approved: true }, // Only public comments
                    required: false,
                    include: [User]
                }
            ]
        });

        if (!post) return res.status(404).json({ error: 'Post not found' });

        // Increment views (lightweight)
        post.increment('views');

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Analytics Endpoint ---
export const incrementView = async (req, res) => {
    try {
        await BlogPost.increment('views', { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// --- Categories ---

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{ model: BlogPost, attributes: ['id'] }]
        });

        // Add count
        const data = categories.map(c => ({
            ...c.toJSON(),
            count: c.BlogPosts.length
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = req.body.slug || slugify(name, { lower: true });
        const category = await Category.create({ ...req.body, slug });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Not found' });
        await category.update(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Tags ---

export const getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
