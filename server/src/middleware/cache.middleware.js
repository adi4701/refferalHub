import NodeCache from 'node-cache';

// Create cache with 60 seconds default TTL (time to live)
// STD-TTL is standard time to live in seconds
export const listingCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            console.warn('Cannot cache non-GET methods');
            return next();
        }

        // Key is the URL path including query parameters
        const key = req.originalUrl;
        const cachedResponse = listingCache.get(key);

        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }

        // Store original res.json to wrap it
        const originalJson = res.json;

        res.json = function (body) {
            // Restore original res.json after hooking
            res.json = originalJson;

            // Only cache successful requests
            if (res.statusCode >= 200 && res.statusCode < 300) {
                listingCache.set(key, body, duration);
            }

            // Call original res.json with the body
            return res.json(body);
        };

        next();
    };
};

export const clearListingCache = (req, res, next) => {
    listingCache.keys().forEach(key => {
        if (key.startsWith('/api/v1/listings')) {
            listingCache.del(key);
        }
    });
    next();
};
