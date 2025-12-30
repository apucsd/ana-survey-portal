import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

export default rateLimiter;
