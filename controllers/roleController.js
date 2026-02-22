import { Role, Permission, UserLog } from '../models/index.js';
import { Op } from 'sequelize';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all roles
// @route   GET /api/admin/roles
// @access  Private/Admin
const getRoles = catchAsync(async (req, res) => {
    const roles = await Role.findAll({
        include: [{ model: Permission }]
    });
    res.json(roles);
});

// @desc    Create a new role
// @route   POST /api/admin/roles
// @access  Private/Admin
const createRole = catchAsync(async (req, res) => {
    const { name, slug, description, color, permissionIds } = req.body;

    const roleExists = await Role.findOne({ where: { slug } });
    if (roleExists) {
        return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await Role.create({
        name,
        slug,
        description,
        color
    });

    if (permissionIds && permissionIds.length > 0) {
        await role.setPermissions(permissionIds);
    }

    const roleWithPermissions = await Role.findByPk(role.id, {
        include: [Permission]
    });

    // Log
    await UserLog.create({
        UserId: req.user.id,
        action: 'CREATE_ROLE',
        details: `Admin ${req.user.username} created role ${role.name}`,
        ip_address: req.ip
    });

    res.status(201).json(roleWithPermissions);
});

// @desc    Update role
// @route   PUT /api/admin/roles/:id
// @access  Private/Admin
const updateRole = catchAsync(async (req, res) => {
    const role = await Role.findByPk(req.params.id);

    if (role) {
        if (role.is_system && req.body.slug && req.body.slug !== role.slug) {
            return res.status(400).json({ message: 'Cannot change slug of system roles' });
        }

        role.name = req.body.name || role.name;
        role.slug = req.body.slug || role.slug;
        role.description = req.body.description || role.description;
        role.color = req.body.color || role.color;

        if (req.body.permissionIds) {
            await role.setPermissions(req.body.permissionIds);
        }

        await role.save();

        const updatedRole = await Role.findByPk(role.id, {
            include: [Permission]
        });

        // Log
        await UserLog.create({
            UserId: req.user.id,
            action: 'UPDATE_ROLE',
            details: `Admin ${req.user.username} updated role ${role.name}`,
            ip_address: req.ip
        });

        res.json(updatedRole);
    } else {
        res.status(404).json({ message: 'Role not found' });
    }
});

// @desc    Delete role
// @route   DELETE /api/admin/roles/:id
// @access  Private/Admin
const deleteRole = catchAsync(async (req, res) => {
    const role = await Role.findByPk(req.params.id);

    if (role) {
        if (role.is_system) {
            return res.status(400).json({ message: 'Cannot delete system roles' });
        }

        await role.destroy();

        // Log
        await UserLog.create({
            UserId: req.user.id,
            action: 'DELETE_ROLE',
            details: `Admin ${req.user.username} deleted role ${role.name}`,
            ip_address: req.ip
        });

        res.json({ message: 'Role removed' });
    } else {
        res.status(404).json({ message: 'Role not found' });
    }
});

// @desc    Get all permissions (for selection)
// @route   GET /api/admin/permissions
// @access  Private/Admin
const getPermissions = catchAsync(async (req, res) => {
    const permissions = await Permission.findAll({
        order: [['module', 'ASC'], ['slug', 'ASC']]
    });

    // Group by module for frontend convenience
    const grouped = permissions.reduce((acc, perm) => {
        const module = perm.module || 'Other';
        if (!acc[module]) acc[module] = [];
        acc[module].push(perm);
        return acc;
    }, {});

    res.json({
        permissions, // Flat list
        grouped      // Grouped object
    });
});

export {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getPermissions
};
