import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Notification must have a recipient']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: [
            'request_received',
            'request_accepted',
            'request_rejected',
            'request_withdrawn',
            'listing_expiring',
            'new_message'
        ],
        required: [true, 'Notification type is required']
    },
    title: {
        type: String,
        required: [true, 'Notification title is required']
    },
    body: {
        type: String,
        required: [true, 'Notification body is required']
    },
    link: String,
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: true, updatedAt: false } // No updatedAt needed
});

// Optimize queries for finding a user's unread notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Static method to easily create notifications
notificationSchema.statics.createNotification = async function ({ recipient, sender, type, title, body, link }) {
    return await this.create({
        recipient,
        sender,
        type,
        title,
        body,
        link
    });
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
