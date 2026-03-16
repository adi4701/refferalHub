export const APP_NAME = 'ReferralHub';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const WORK_MODES = ['remote', 'hybrid', 'onsite'];

export const ROLES = ['referrer', 'applicant'];

export const REQUEST_STATUSES = {
    pending: { label: 'Pending', description: 'Application submitted and awaiting review' },
    reviewing: { label: 'Reviewing', description: 'Referrer is currently reviewing the request' },
    accepted: { label: 'Accepted', description: 'Request accepted, referral code generated' },
    rejected: { label: 'Rejected', description: 'Request was not accepted at this time' },
    withdrawn: { label: 'Withdrawn', description: 'Applicant withdrew their request' }
};

export const POPULAR_TAGS = [
    'Software Engineering', 'Frontend', 'Backend', 'Fullstack', 'Mobile',
    'Data Science', 'Machine Learning', 'AI', 'DevOps', 'Cloud',
    'Product Design', 'UI/UX', 'Product Management', 'Marketing',
    'Sales', 'Finance', 'HR', 'Legal', 'Operations', 'Customer Success'
];
