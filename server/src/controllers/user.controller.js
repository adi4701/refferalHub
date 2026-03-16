import User from '../models/User.model.js';
import Listing from '../models/Listing.model.js';
import ReferralRequest from '../models/ReferralRequest.model.js';
import cloudinary from '../config/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select(
        'name email role avatar headline company bio linkedinUrl resumeUrl rating reviewCount totalReferralsGiven successfulReferrals createdAt'
    );

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    return res.status(200).json(new ApiResponse(200, { user }, 'User profile fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    // Exclude restricted fields mapping completely
    if (req.body.role || req.body.email || req.body.password) {
        return next(new ApiError(400, 'Role, email, or password cannot be updated via this route'));
    }

    const allowedUpdates = {};
    const updatableFields = ['name', 'headline', 'company', 'bio', 'linkedinUrl', 'resumeUrl'];

    updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
            allowedUpdates[field] = req.body[field];
        }
    });

    const user = await User.findByIdAndUpdate(
        req.user._id,
        allowedUpdates,
        { new: true, runValidators: true }
    );

    return res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully'));
});

export const uploadAvatarHandler = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ApiError(400, 'Please upload an image file'));
    }

    const user = await User.findById(req.user._id);

    // If an avatar already exists, proactively trigger native cloudinary wipe parsing the `public_id` natively
    if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    user.avatar = {
        url: req.file.path,
        public_id: req.file.filename // Added by CloudinaryStorage natively mapping to folder paths
    };

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { avatarUrl: user.avatar.url }, 'Avatar uploaded successfully'));
});

export const getReferrerStats = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'referrer') {
        return next(new ApiError(403, 'Not authorized for referrer stats'));
    }

    const listings = await Listing.find({ referrer: req.user._id });
    const requests = await ReferralRequest.find({ referrer: req.user._id });

    const stats = {
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status === 'active' && (!l.expiresAt || l.expiresAt > Date.now())).length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        acceptedRequests: requests.filter(r => r.status === 'accepted').length,
        successfulReferrals: req.user.successfulReferrals || 0
    };

    return res.status(200).json(new ApiResponse(200, { stats }, 'Referrer stats fetched successfully'));
});

export const getApplicantDashboard = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'applicant') {
        return next(new ApiError(403, 'Not authorized for applicant dashboard'));
    }

    const applications = await ReferralRequest.find({ applicant: req.user._id })
        .populate('listing', 'company jobTitle status')
        .sort('-createdAt');

    const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        acceptedApplications: applications.filter(a => a.status === 'accepted').length,
        rejectedApplications: applications.filter(a => a.status === 'rejected').length,
        recentApplications: applications.slice(0, 5) // Last 5 requests mappings
    };

    return res.status(200).json(new ApiResponse(200, { dashboard: stats }, 'Applicant dashboard fetched successfully'));
});
