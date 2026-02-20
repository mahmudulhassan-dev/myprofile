import jwt from 'jsonwebtoken';
import { User, Role, Permission } from '../models/index.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id, {
                include: [
                    {
                        model: Role,
                        include: [Permission] // Include permissions for checking later
                    }
                ],
                attributes: { exclude: ['password'] } // Don't return password
            });

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Check if user is suspended
            if (req.user.status === 'Suspended') {
                return res.status(403).json({ message: 'Your account has been suspended' });
            }

            next();
        } catch (error) {
            console.error('Auth error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check for specific roles (e.g., 'Admin', 'Editor')
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const userRoles = req.user.Roles.map(r => r.name);
        // Check if user has ANY of the required roles
        const hasRole = roles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: `User role ${userRoles.join(', ')} is not authorized to access this route` });
        }
        next();
    };
};

// Middleware to check for specific permissions
const hasPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Aggregate all permissions from all roles
        const userPermissions = req.user.Roles.flatMap(role => role.Permissions.map(p => p.slug));

        // Check if user possesses the required permission
        // Also allow 'admin' role to bypass permission checks if desired (optional, but implemented here for safety)
        const isAdmin = req.user.Roles.some(r => r.name === 'Admin' || r.slug === 'admin');

        if (isAdmin || userPermissions.includes(requiredPermission)) {
            next();
        } else {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
    };
};

export { protect, authorize, hasPermission };
