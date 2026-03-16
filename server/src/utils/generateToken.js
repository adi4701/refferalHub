import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '15m' }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, // using secondary secret or fallback
        { expiresIn: '30d' }
    );
};
