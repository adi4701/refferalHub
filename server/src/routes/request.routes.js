import { Router } from 'express';
import {
    createRequest,
    getMyRequests,
    getRequestById,
    updateRequestStatus
} from '../controllers/request.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/', restrictTo('applicant'), createRequest);
router.get('/my', getMyRequests);
router.get('/:id', getRequestById);
router.patch('/:id/status', updateRequestStatus);

export default router;
