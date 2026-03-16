import mongoose from 'mongoose';

const referralRequestSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Request must belong to an applicant']
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: [true, 'Request must be tied to a listing']
    },
    referrer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Request must target a referrer']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    coverNote: {
        type: String,
        required: [true, 'Cover note is required'],
        maxlength: [500, 'Cover note cannot exceed 500 characters']
    },
    resumeUrl: String,
    linkedinUrl: String,
    currentRole: String,
    yearsOfExperience: Number,
    referrerNotes: String, // Private notes from the referrer
    outcome: {
        type: String,
        enum: ['hired', 'rejected', 'ghosted', 'withdrawn', null],
        default: null
    },
    referralCode: String // Generated when accepted
}, {
    timestamps: true
});

// Ensure one request per listing per applicant
referralRequestSchema.index({ applicant: 1, listing: 1 }, { unique: true });

// Optimizing lookups
referralRequestSchema.index({ referrer: 1, status: 1 });
referralRequestSchema.index({ applicant: 1, status: 1 });

const ReferralRequest = mongoose.model('ReferralRequest', referralRequestSchema);
export default ReferralRequest;
