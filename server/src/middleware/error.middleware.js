import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
    console.error("🔥 ERROR HANDLER CAUGHT:", err);
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode ? error.statusCode : 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ApiError(404, message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ApiError(409, message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ApiError(400, message);
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token is invalid, please log in again';
        error = new ApiError(401, message);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token has expired, please log in again';
        error = new ApiError(401, message);
    }

    const response = {
        success: error.success,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors
    };

    return res.status(error.statusCode).json(response);
};
