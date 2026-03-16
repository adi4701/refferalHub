import Notification from '../models/Notification.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getNotifications = asyncHandler(async (req, res, next) => {
    const { unreadOnly } = req.query;

    const query = { recipient: req.user._id };

    if (unreadOnly === 'true') {
        query.isRead = false;
    }

    const notifications = await Notification.find(query)
        .sort('-createdAt')
        .populate('sender', 'name avatar company');

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false
    });

    return res.status(200).json(new ApiResponse(200, {
        notifications,
        unreadCount
    }, 'Notifications fetched successfully'));
});

export const markAsRead = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return next(new ApiError(404, 'Notification not found or not owned by user'));
    }

    return res.status(200).json(new ApiResponse(200, { notification }, 'Notification marked as read'));
});

export const markAllAsRead = asyncHandler(async (req, res, next) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );

    return res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
});

export const deleteNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id
    });

    if (!notification) {
        return next(new ApiError(404, 'Notification not found or not owned by user'));
    }

    return res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});
