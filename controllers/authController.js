import { User, Role, Permission } from '../models/index.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { triggerAutomation } from '../utils/automation.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import process from 'process';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

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

        // Refresh token logic
        const refreshToken = generateRefreshToken(user.id);
        user.refresh_token = refreshToken;
        await user.save();

        // Optional: Set refresh token in cookie for SPA
        // setRefreshTokenCookie(res, refreshToken);

        res.json({
            status: 'success',
            data: {
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                roles: user.Roles.map(role => role.name),
                permissions: user.Roles.flatMap(role => role.Permissions.map(p => p.slug)),
                token: generateToken(user.id),
                refreshToken: refreshToken, // Returning for versatility
            }
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_antigravity');
        const user = await User.findByPk(decoded.id);

        if (!user || user.refresh_token !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        user.refresh_token = newRefreshToken;
        await user.save();

        res.json({
            token: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        user.refresh_token = refreshToken;
        await user.save();

        // Trigger Automation
        triggerAutomation('new_user', {
            id: user.id,
            username: user.username,
            email: user.email
        });

        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token,
            refreshToken
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = catchAsync(async (req, res) => {
    // Clear user's refresh token in DB
    const user = await User.findByPk(req.user.id);
    if (user) {
        user.refresh_token = null;
        await user.save();
    }
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.reset_password_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.reset_password_expire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        // This is a placeholder for actual email sending logic
        // In a real app, use nodemailer with valid transporter
        console.log(`Password reset email sent to: ${email} with link: ${resetUrl}`);

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        user.reset_password_token = null;
        user.reset_password_expire = null;
        await user.save();
        return res.status(500).json({ message: 'Email could not be sent' });
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = catchAsync(async (req, res) => {
    const reset_password_token = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        where: {
            reset_password_token,
            // reset_password_expire: { [Op.gt]: Date.now() } // Requires Op from sequelize
        }
    });

    if (!user || user.reset_password_expire < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.reset_password_token = null;
    user.reset_password_expire = null;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Password reset successful'
    });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = catchAsync(async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password', 'refresh_token', 'reset_password_token', 'reset_password_expire'] },
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
            roles: user.Roles ? user.Roles.map(role => role.name) : [],
            permissions: user.Roles ? user.Roles.flatMap(role => role.Permissions.map(p => p.slug)) : [],
            ...user.get({ plain: true })
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    refreshToken,
    forgotPassword,
    resetPassword
};
