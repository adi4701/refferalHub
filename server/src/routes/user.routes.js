import { Router } from 'express';
import {
    getUserProfile,
    updateProfile,
    uploadAvatarHandler,
    getReferrerStats,
    getApplicantDashboard
} from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import uploadAvatar from '../middleware/upload.middleware.js';

const router = Router();

// Public route mapping securely
router.get('/profile/:id', getUserProfile);

// Secure explicit protected maps downward sequentially!
router.use(protect);

router.patch('/profile', updateProfile);
router.post('/avatar', uploadAvatar.single('avatar'), uploadAvatarHandler);

router.get('/stats', restrictTo('referrer'), getReferrerStats);
router.get('/dashboard', restrictTo('applicant'), getApplicantDashboard);

export default router;
