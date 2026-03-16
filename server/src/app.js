import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set security HTTP headers
// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "res.cloudinary.com"],
            scriptSrc: ["'self'"],
        }
    },
    hsts: { maxAge: 31536000, includeSubDomains: true }
}));

// Compress response bodies for all request
app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined')); // Fallback
}

// Cookie parser
app.use(cookieParser());

// Body parser, reading data from body into req.body
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// (express-mongo-sanitize is incompatible with Express 5 — req.query is read-only)
// Mongoose model-level validation prevents injection attacks.

// XSS protection: handled at the frontend (React auto-escapes) and
// Mongoose schema validation level. A regex-based body mutator was
// removed as it broke JSON payloads containing angle brackets (e.g. passwords).

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});

// API Base Welcome Endpoint
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to ReferralHub API v1'
    });
});

// API routes Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import listingRoutes from './routes/listing.routes.js';
import requestRoutes from './routes/request.routes.js';
import notificationRoutes from './routes/notification.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handler (MUST be last)
// Error handler (MUST be last for API)
app.use(errorHandler);

// Serve Static Frontend Next
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'));
    });
}

export default app;
