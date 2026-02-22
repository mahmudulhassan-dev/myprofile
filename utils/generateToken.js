import jwt from 'jsonwebtoken';
import process from 'process';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m', // Access token: 15 minutes
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_antigravity', {
        expiresIn: '7d', // Refresh token: 7 days
    });
};

export { generateToken, generateRefreshToken };
