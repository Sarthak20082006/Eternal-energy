// Simple in-memory API cache middleware
const cache = new Map();

const apiCache = (durationSeconds = 60) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') return next();

        const key = `${req.originalUrl}:${req.user?.id || 'anon'}`;
        const cached = cache.get(key);

        if (cached && Date.now() - cached.timestamp < durationSeconds * 1000) {
            return res.json(cached.data);
        }

        // Override res.json to capture response
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            cache.set(key, { data, timestamp: Date.now() });
            // Cleanup old entries periodically
            if (cache.size > 500) {
                const now = Date.now();
                for (const [k, v] of cache) {
                    if (now - v.timestamp > durationSeconds * 1000 * 2) cache.delete(k);
                }
            }
            return originalJson(data);
        };

        next();
    };
};

// Clear cache (use after write operations)
const clearCache = (pattern) => {
    if (!pattern) { cache.clear(); return; }
    for (const key of cache.keys()) {
        if (key.includes(pattern)) cache.delete(key);
    }
};

module.exports = { apiCache, clearCache };
