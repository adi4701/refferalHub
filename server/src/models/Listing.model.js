import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Listing must belong to a referrer']
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    jobUrl: String,
    department: String,
    location: String,
    workMode: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite'],
        default: 'hybrid'
    },
    description: {
        type: String,
        maxlength: [1000, 'Description can not be more than 1000 characters']
    },
    requirements: [String],
    slotsAvailable: {
        type: Number,
        required: [true, 'Number of available slots is required'],
        min: [1, 'Must have at least 1 slot'],
        max: [10, 'Cannot exceed 10 slots per listing']
    },
    slotsTotal: {
        type: Number,
        required: [true, 'Total number of slots is required']
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'closed'],
        default: 'active'
    },
    expiresAt: Date,
    views: {
        type: Number,
        default: 0
    },
    tags: [String]
}, {
    timestamps: true
});

// Indexes for faster querying
listingSchema.index({ company: 1, status: 1 });
listingSchema.index({ referrer: 1 });
listingSchema.index({ company: 'text', jobTitle: 'text', tags: 'text' });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
