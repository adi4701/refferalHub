import mongoose from 'mongoose';
import Listing from '../models/Listing.model.js';
import ReferralRequest from '../models/ReferralRequest.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createListing = asyncHandler(async (req, res, next) => {
    const listing = await Listing.create({
        ...req.body,
        referrer: req.user._id,
        slotsTotal: req.body.slotsAvailable // Set total equal to initial available
    });

    return res.status(201).json(new ApiResponse(201, { listing }, 'Listing created successfully'));
});

export const getAllListings = asyncHandler(async (req, res, next) => {
    const { company, workMode, tags, search, page = 1, limit = 12 } = req.query;

    const query = {
        status: 'active',
        $or: [
            { expiresAt: { $eq: null } },
            { expiresAt: { $gt: Date.now() } }
        ]
    };

    if (company) query.company = new RegExp(company, 'i');
    if (workMode) query.workMode = workMode;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) query.$text = { $search: search };

    const pageConfig = parseInt(page, 10);
    const limitConfig = parseInt(limit, 10);
    const skipConfig = (pageConfig - 1) * limitConfig;

    const listings = await Listing.find(query)
        .populate('referrer', 'name avatar headline company rating totalReferralsGiven')
        .skip(skipConfig)
        .limit(limitConfig)
        .sort('-createdAt')
        .lean(); // Optimization: Use lean() and avoid creating full Mongoose models

    const total = await Listing.countDocuments(query); // Optimization: counted separately

    return res.status(200).json(new ApiResponse(200, {
        listings,
        total,
        page: pageConfig,
        pages: Math.ceil(total / limitConfig)
    }, 'Listings fetched successfully'));
});

export const getListingById = asyncHandler(async (req, res, next) => {
    // Validate ObjectId format first to avoid Mongoose cast errors (500)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ApiError(404, 'Listing not found'));
    }

    // Increment views first, then fetch populated listing separately
    await Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const listing = await Listing.findById(req.params.id)
        .populate('referrer', 'name email avatar headline company bio linkedinUrl rating totalReferralsGiven reviewCount');

    if (!listing) {
        return next(new ApiError(404, 'Listing not found'));
    }

    return res.status(200).json(new ApiResponse(200, { listing }, 'Listing fetched successfully'));
});

export const getMyListings = asyncHandler(async (req, res, next) => {
    const listings = await Listing.aggregate([
        {
            $match: { referrer: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
            $lookup: {
                from: 'referralrequests',
                localField: '_id',
                foreignField: 'listing',
                as: 'requests'
            }
        },
        {
            $addFields: {
                requestCount: { $size: '$requests' }
            }
        },
        {
            $project: {
                requests: 0 // Remove the full requests array
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, { listings }, 'My listings fetched successfully'));
});

export const updateListing = asyncHandler(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new ApiError(404, 'Listing not found'));
    }

    if (listing.referrer.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'User not authorized to update this listing'));
    }

    // Prevent updating the referrer
    if (req.body.referrer) {
        delete req.body.referrer;
    }

    listing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    return res.status(200).json(new ApiResponse(200, { listing }, 'Listing updated successfully'));
});

export const deleteListing = asyncHandler(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new ApiError(404, 'Listing not found'));
    }

    if (listing.referrer.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'User not authorized to delete this listing'));
    }

    await listing.deleteOne();

    // Also delete all associated ReferralRequests
    await ReferralRequest.deleteMany({ listing: listing._id });

    return res.status(200).json(new ApiResponse(200, null, 'Listing deleted successfully'));
});
