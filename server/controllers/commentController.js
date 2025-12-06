import { Comment, BlogPost, User } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public (Approved only) or Admin (All)
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { isAdmin } = req.query; // Simple flag, normally checked via auth middleware context

        const where = { BlogPostId: postId };
        if (!isAdmin) {
            where.is_approved = true;
        }

        const comments = await Comment.findAll({
            where,
            include: [
                { model: User, attributes: ['username', 'avatar'] }
            ],
            order: [['createdAt', 'ASC']] // Oldest first for threads
        });

        // Threading Logic (Construct Hierarchy)
        const thread = (allComments) => {
            const map = {};
            const roots = [];

            allComments.forEach(c => {
                map[c.id] = { ...c.toJSON(), replies: [] };
            });

            allComments.forEach(c => {
                if (c.parentId && map[c.parentId]) {
                    map[c.parentId].replies.push(map[c.id]);
                } else {
                    roots.push(map[c.id]);
                }
            });
            return roots;
        };

        res.json(thread(comments));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Post a comment
// @route   POST /api/comments
// @access  Public / Private
export const postComment = async (req, res) => {
    try {
        const { postId, name, email, content, parentId, userId } = req.body;

        // Basic Spam Check
        if (content.includes('http') && !userId) {
            // Very primitive check for links from guests
            return res.status(400).json({ message: 'No links allowed.' });
        }

        const comment = await Comment.create({
            BlogPostId: postId,
            name: userId ? undefined : name, // Use User info if logged in
            email: userId ? undefined : email,
            content,
            parentId: parentId || 0,
            UserId: userId || null,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            is_approved: false // Default to false for moderation
        });

        res.status(201).json({ message: 'Comment submitted for approval.', comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Moderate comment
// @route   PUT /api/admin/comments/:id
// @access  Private/Admin
export const moderateComment = async (req, res) => {
    try {
        const { status } = req.body; // 'approve', 'reject'
        const comment = await Comment.findByPk(req.params.id);

        if (!comment) return res.status(404).json({ message: 'Not found' });

        if (status === 'approve') {
            comment.is_approved = true;
        } else if (status === 'reject') {
            comment.is_approved = false;
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
export const deleteComment = async (req, res) => {
    try {
        await Comment.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all comments (for Admin Dashboard)
// @route   GET /api/admin/comments
// @access  Private/Admin
export const getAllComments = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status === 'pending') where.is_approved = false;
        if (status === 'approved') where.is_approved = true;

        const { count, rows } = await Comment.findAndCountAll({
            where,
            include: [{ model: BlogPost, attributes: ['title', 'slug'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({ comments: rows, total: count, pages: Math.ceil(count / limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
