import { User, Role, Permission } from '../models/index.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    include: [Permission]
                }
            ]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Update last login
            user.last_login = new Date();
            await user.save();

            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                roles: user.Roles.map(role => role.name),
                permissions: user.Roles.flatMap(role => role.Permissions.map(p => p.slug)),
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin only)
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Assign default role (e.g., 'Subscriber' or 'User')
        // const defaultRole = await Role.findOne({ where: { name: 'User' } });
        // if (defaultRole) {
        //     await user.addRole(defaultRole);
        // }

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
    // Client-side just discards token, but if we used cookies:
    // res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    include: [Permission]
                }
            ]
        });

        if (user) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                roles: user.Roles.map(role => role.name),
                permissions: user.Roles.flatMap(role => role.Permissions.map(p => p.slug)),
                ...user.dataValues // Include other fields
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
};
