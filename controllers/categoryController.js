
import { Category, Product, sequelize } from '../models/index.js';
import slugify from 'slugify';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['order', 'ASC'], ['id', 'ASC']],
            include: [
                { model: Category, as: 'children' },
                { model: Category, as: 'parent' }
            ]
        });

        // Optional: Build tree structure on backend if requested
        if (req.query.tree === 'true') {
            const buildTree = (cats, parentId = null) => {
                return cats
                    .filter(cat => cat.parentId === parentId)
                    .map(cat => ({
                        ...cat.toJSON(),
                        children: buildTree(cats, cat.id)
                    }));
            };
            return res.json(buildTree(categories));
        }

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const createCategory = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, parentId, description, icon, image, banner, seo_title, seo_desc } = req.body;

        let slug = req.body.slug || slugify(name, { lower: true, strict: true });

        // Ensure unique slug
        let uniqueSlug = slug;
        let counter = 1;
        while (await Category.findOne({ where: { slug: uniqueSlug }, transaction: t })) {
            uniqueSlug = `${slug}-${counter++}`;
        }

        // Get max order for new item
        const maxOrder = await Category.max('order', { where: { parentId: parentId || null }, transaction: t });

        const category = await Category.create({
            name,
            slug: uniqueSlug,
            parentId: parentId || null,
            description,
            icon,
            image,
            banner,
            seo_title,
            seo_desc,
            order: (maxOrder || 0) + 1
        }, { transaction: t });

        await t.commit();
        res.status(201).json(category);
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateCategory = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, parentId, description, icon, image, banner, slug, seo_title, seo_desc } = req.body;

        const category = await Category.findByPk(id, { transaction: t });
        if (!category) {
            await t.rollback();
            return res.status(404).json({ error: 'Category not found' });
        }

        // Prevent circular dependency
        if (parentId && parentId == id) {
            await t.rollback();
            return res.status(400).json({ error: 'Category cannot be its own parent' });
        }

        // Update fields
        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (icon !== undefined) category.icon = icon;
        if (image !== undefined) category.image = image;
        if (banner !== undefined) category.banner = banner;
        if (seo_title !== undefined) category.seo_title = seo_title;
        if (seo_desc !== undefined) category.seo_desc = seo_desc;
        if (parentId !== undefined) category.parentId = parentId || null;

        if (slug && slug !== category.slug) {
            let uniqueSlug = slugify(slug, { lower: true, strict: true });
            let counter = 1;
            while (await Category.findOne({ where: { slug: uniqueSlug, id: { [sequelize.Op.ne]: id } }, transaction: t })) {
                uniqueSlug = `${slug}-${counter++}`;
            }
            category.slug = uniqueSlug;
        }

        await category.save({ transaction: t });
        await t.commit();
        res.json(category);

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, { include: ['children'], transaction: t });

        if (!category) {
            await t.rollback();
            return res.status(404).json({ error: 'Category not found' });
        }

        // Move children to parent or root? Or delete? 
        // Strategy: Link children to deleted category's parent (preserve hierarchy)
        if (category.children && category.children.length > 0) {
            await Category.update(
                { parentId: category.parentId },
                { where: { parentId: id }, transaction: t }
            );
        }
        // Or if you want to prevent delete:
        // if (category.children.length > 0) return res.status(400).json({error: 'Has children'});

        await category.destroy({ transaction: t });
        await t.commit();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

export const updateCategoryOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { items } = req.body; // Expecting array of { id, order, parentId }

        for (const item of items) {
            await Category.update(
                { order: item.order, parentId: item.parentId || null },
                { where: { id: item.id }, transaction: t }
            );
        }

        await t.commit();
        res.json({ message: 'Order updated' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};
