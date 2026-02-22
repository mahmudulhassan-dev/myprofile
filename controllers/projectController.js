import { Project, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all projects (with filtering)
// @route   GET /api/projects
export const getProjects = catchAsync(async (req, res) => {
    const { status, category, search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status && status !== 'All') where.status = status;
    if (category && category !== 'All') where.category = category;
    if (search) {
        where[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { client_name: { [Op.like]: `%${search}%` } }
        ];
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'profit') order = [[sequelize.literal('revenue - expense'), 'DESC']];
    if (sort === 'date') order = [['start_date', 'DESC']];

    const { count, rows } = await Project.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order
    });

    res.json({ projects: rows, total: count, pages: Math.ceil(count / limit) });
});

// @desc    Get single project
// @route   GET /api/projects/:id
export const getProject = catchAsync(async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
});

// @desc    Create project
// @route   POST /api/projects
export const createProject = catchAsync(async (req, res) => {
    const project = await Project.create(req.body);
    res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = catchAsync(async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await project.update(req.body);
    res.json(project);
});

// @desc    Soft Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = catchAsync(async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await project.destroy();
    res.json({ message: 'Project moved to trash' });
});

// @desc    Restore project
// @route   POST /api/projects/:id/restore
export const restoreProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, { paranoid: false });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        await project.restore();
        res.json({ message: 'Project restored' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get Project Stats
// @route   GET /api/projects/stats
export const getProjectStats = catchAsync(async (req, res) => {
    const total = await Project.count();
    const completed = await Project.count({ where: { status: 'completed' } });
    const inProgress = await Project.count({ where: { status: 'in-progress' } });

    const financials = await Project.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('revenue')), 'total_revenue'],
            [sequelize.fn('SUM', sequelize.col('expense')), 'total_expense']
        ],
        raw: true
    });

    const revenue = financials[0].total_revenue || 0;
    const expense = financials[0].total_expense || 0;
    const profit = revenue - expense;

    const byCategory = await Project.findAll({
        attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['type'],
        raw: true
    });

    res.json({
        total,
        completed,
        inProgress,
        revenue,
        expense,
        profit,
        byCategory
    });
});
