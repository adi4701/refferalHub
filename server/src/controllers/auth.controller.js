import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const setRefreshCookie = (res, refreshToken) => {
    const options = {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    };
    res.cookie('refreshToken', refreshToken, options);
};

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ApiError(400, 'User already exists with this email'));
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshCookie(res, refreshToken);

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline
    };

    return res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: { user: userData, accessToken }
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
        return next(new ApiError(401, 'Invalid credentials'));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshCookie(res, refreshToken);

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        headline: user.headline
    };

    return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Logged in successfully',
        data: { user: userData, accessToken }
    });
});

export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('refreshToken');
    return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const refreshToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return next(new ApiError(401, 'Not authorized, no refresh token found'));
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }

        const accessToken = generateAccessToken(user._id);

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Token refreshed successfully',
            data: { accessToken }
        });
    } catch (error) {
        return next(new ApiError(401, 'Not authorized, token validation failed'));
    }
});

export const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    return res.status(200).json(new ApiResponse(200, { user }, 'User details fetched successfully'));
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ApiError(404, 'There is no user with that email'));
    }

    const resetToken = user.getPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Simulate sending email: Keep in server logs safely without exposing outside terminal
    console.log(`[Email Simulation] Password reset token for ${user.email} -> ${resetToken}`);

    return res.status(200).json(new ApiResponse(200, null, 'Reset token sent (check console in dev)'));
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: resetPasswordToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError(400, 'Invalid or expired reset token'));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
});

export const changePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(req.body.currentPassword))) {
        return next(new ApiError(401, 'Password is incorrect'));
    }

    user.password = req.body.newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, 'Password changed'));
});
