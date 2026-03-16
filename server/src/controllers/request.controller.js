import crypto from 'crypto';
import ReferralRequest from '../models/ReferralRequest.model.js';
import Listing from '../models/Listing.model.js';
import Notification from '../models/Notification.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createRequest = asyncHandler(async (req, res, next) => {
    const listingId = req.body.listing;

    const listing = await Listing.findById(listingId);

    if (!listing) {
        return next(new ApiError(404, 'Listing not found'));
    }

    if (listing.status !== 'active') {
        return next(new ApiError(400, 'This listing is no longer active'));
    }

    if (listing.slotsAvailable <= 0) {
        return next(new ApiError(400, 'No slots available for this listing'));
    }

    const existingRequest = await ReferralRequest.findOne({
        applicant: req.user._id,
        listing: listingId
    });

    if (existingRequest) {
        return next(new ApiError(400, 'You have already applied to this listing'));
    }

    const referralRequest = await ReferralRequest.create({
        ...req.body,
        applicant: req.user._id,
        referrer: listing.referrer
    });

    listing.slotsAvailable -= 1;
    await listing.save();

    await Notification.createNotification({
        recipient: listing.referrer,
        sender: req.user._id,
        type: 'request_received',
        title: 'New Referral Request',
        body: `You have received a new referral request for ${listing.jobTitle} at ${listing.company}.`,
        link: `/requests/${referralRequest._id}` // Based on expected frontend route
    });

    return res.status(201).json(new ApiResponse(201, { referralRequest }, 'Referral request submitted successfully'));
});

export const getMyRequests = asyncHandler(async (req, res, next) => {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    let requests;

    if (req.user.role === 'applicant') {
        query.applicant = req.user._id;
        requests = await ReferralRequest.find(query)
            .populate('listing', 'company jobTitle status')
            .populate('referrer', 'name avatar headline company rating')
            .sort('-createdAt');
    } else if (req.user.role === 'referrer') {
        query.referrer = req.user._id;
        requests = await ReferralRequest.find(query)
            .populate('listing', 'company jobTitle status')
            .populate('applicant', 'name avatar headline linkedinUrl resumeUrl')
            .sort('-createdAt');
    }

    return res.status(200).json(new ApiResponse(200, { requests }, 'Requests fetched successfully'));
});

export const getRequestById = asyncHandler(async (req, res, next) => {
    const referralRequest = await ReferralRequest.findById(req.params.id)
        .populate('listing')
        .populate('referrer', 'name email avatar headline company')
        .populate('applicant', 'name email avatar headline linkedinUrl resumeUrl yearsOfExperience');

    if (!referralRequest) {
        return next(new ApiError(404, 'Request not found'));
    }

    // Only applicant or referrer involved can view
    if (referralRequest.applicant._id.toString() !== req.user._id.toString() &&
        referralRequest.referrer._id.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'Not authorized to view this request'));
    }

    return res.status(200).json(new ApiResponse(200, { referralRequest }, 'Request fetched successfully'));
});

export const updateRequestStatus = asyncHandler(async (req, res, next) => {
    const { status, referrerNotes, outcome } = req.body;

    const referralRequest = await ReferralRequest.findById(req.params.id);

    if (!referralRequest) {
        return next(new ApiError(404, 'Request not found'));
    }

    let isReferrer = referralRequest.referrer.toString() === req.user._id.toString();
    let isApplicant = referralRequest.applicant.toString() === req.user._id.toString();

    if (!isReferrer && !isApplicant) {
        return next(new ApiError(403, 'Not authorized to update this request'));
    }

    if (isReferrer) {
        if (!['reviewing', 'accepted', 'rejected'].includes(status) && status !== undefined) {
            return next(new ApiError(400, 'Invalid status update for referrer'));
        }
        if (status) referralRequest.status = status;
        if (referrerNotes !== undefined) referralRequest.referrerNotes = referrerNotes;
        if (outcome !== undefined) referralRequest.outcome = outcome;

        if (status === 'accepted' && !referralRequest.referralCode) {
            referralRequest.referralCode = crypto.randomBytes(6).toString('hex').toUpperCase();

            await Notification.createNotification({
                recipient: referralRequest.applicant,
                sender: req.user._id,
                type: 'request_accepted',
                title: 'Referral Request Accepted',
                body: `Your referral request has been accepted! Your referral code is ${referralRequest.referralCode}.`,
                link: `/requests/${referralRequest._id}`
            });
        }

        if (status === 'rejected') {
            await Listing.findByIdAndUpdate(referralRequest.listing, { $inc: { slotsAvailable: 1 } });

            await Notification.createNotification({
                recipient: referralRequest.applicant,
                sender: req.user._id,
                type: 'request_rejected',
                title: 'Referral Request Rejected',
                body: `Unfortunately, your referral request was not accepted.`,
                link: `/requests/${referralRequest._id}`
            });
        }
    }

    if (isApplicant) {
        if (status !== 'withdrawn') {
            return next(new ApiError(400, 'Applicant can only withdraw a request'));
        }

        // Prevent withdrawal if already processed explicitly
        if (['accepted', 'rejected'].includes(referralRequest.status)) {
            return next(new ApiError(400, 'Cannot withdraw request that has already been processed'));
        }

        referralRequest.status = status;
        referralRequest.outcome = 'withdrawn';

        await Listing.findByIdAndUpdate(referralRequest.listing, { $inc: { slotsAvailable: 1 } });

        await Notification.createNotification({
            recipient: referralRequest.referrer,
            sender: req.user._id,
            type: 'request_withdrawn',
            title: 'Referral Request Withdrawn',
            body: `An applicant has withdrawn their referral request.`,
            link: `/requests/${referralRequest._id}`
        });
    }

    await referralRequest.save();

    return res.status(200).json(new ApiResponse(200, { referralRequest }, 'Request status updated successfully'));
});
