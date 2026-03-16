import { Router } from 'express';
import {
    createListing,
    getAllListings,
    getListingById,
    getMyListings,
    updateListing,
    deleteListing
} from '../controllers/listing.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { cacheMiddleware, clearListingCache } from '../middleware/cache.middleware.js';

const router = Router();

// Public routes with caching
router.get('/', cacheMiddleware(60), getAllListings);

// Protected routes below (must come before /:id)
router.use(protect);

router.get('/my', restrictTo('referrer'), getMyListings);
router.get('/my/listings', restrictTo('referrer'), getMyListings); // alias

router.post('/', restrictTo('referrer'), clearListingCache, createListing);
router.put('/:id', restrictTo('referrer'), clearListingCache, updateListing);
router.delete('/:id', restrictTo('referrer'), clearListingCache, deleteListing);

// Public /:id must come AFTER protected named routes
router.get('/:id', cacheMiddleware(120), getListingById);

export default router;
