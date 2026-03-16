import { Router } from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    logout,
    refreshToken,
    getMe,
    forgotPassword,
    resetPassword,
    changePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        body('role').isIn(['referrer', 'applicant']).withMessage('Role must be either referrer or applicant')
    ],
    validateRequest,
    register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').exists().withMessage('Password is required')
    ],
    validateRequest,
    login
);

router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

router.get('/me', protect, getMe);

router.post(
    '/forgot-password',
    [
        body('email').isEmail().withMessage('Please include a valid email')
    ],
    validateRequest,
    forgotPassword
);

router.patch(
    '/reset-password/:token',
    [
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ],
    validateRequest,
    resetPassword
);

router.patch(
    '/change-password',
    protect,
    [
        body('currentPassword').exists().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    ],
    validateRequest,
    changePassword
);

export default router;
