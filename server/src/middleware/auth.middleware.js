import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.model.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return next(new ApiError(401, 'Not authorized to access this route'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
        }

        next();
    } catch (error) {
        return next(new ApiError(401, 'Not authorized to access this route'));
    }
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'User role is not authorized to access this route'));
        }
        next();
    };
};
