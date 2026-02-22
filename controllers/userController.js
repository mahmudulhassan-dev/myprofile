import { User, Role, UserLog } from '../models/index.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all users with pagination and search
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search, status, role } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
        where[Op.or] = [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }
    if (status) {
        where.status = status;
    }

    const roleInclude = {
        model: Role,
        attributes: ['id', 'name', 'color']
    };

    if (role) {
        roleInclude.where = { name: role };
    }

    const { count, rows } = await User.findAndCountAll({
        where,
        include: [roleInclude],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
    });

    res.json({
        users: rows,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        total: count
    });
});

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = catchAsync(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Role }]
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Create a new user (Admin)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = catchAsync(async (req, res) => {
    const { username, email, password, roleIds, status } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        status: status || 'Active',
        is_verified: true
    });

    if (roleIds && roleIds.length > 0) {
        await user.setRoles(roleIds);
    }

    await UserLog.create({
        UserId: req.user.id,
        action: 'CREATE_USER',
        details: `Admin ${req.user.username} created user ${username} (${email})`,
        ip_address: req.ip
    });

    res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email
    });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = catchAsync(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.status = req.body.status || user.status;

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.body.roleIds) {
        await user.setRoles(req.body.roleIds);
    }

    await user.save();

    await UserLog.create({
        UserId: req.user.id,
        action: 'UPDATE_USER',
        details: `Updated user ${user.username}`,
        ip_address: req.ip
    });

    res.json({ _id: user.id, username: user.username, email: user.email, message: 'User updated successfully' });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = catchAsync(async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();

    await UserLog.create({
        UserId: req.user.id,
        action: 'DELETE_USER',
        details: `Deleted user ${user.id} (${user.email})`,
        ip_address: req.ip
    });

    res.json({ message: 'User removed' });
});

// @desc    Get system logs
// @route   GET /api/admin/users/logs
// @access  Private/Admin
const getLogs = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const logs = await UserLog.findAndCountAll({
        include: [{ model: User, attributes: ['username', 'id'] }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
    });

    res.json({
        logs: logs.rows,
        total: logs.count,
        page: parseInt(page),
        pages: Math.ceil(logs.count / limit)
    });
});

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getLogs
};
