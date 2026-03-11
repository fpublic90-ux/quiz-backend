/**
 * Simple in-memory socket rate limiter
 */
class SocketRateLimiter {
    constructor() {
        this.limits = new Map(); // Map<socketId, { lastAction: timestamp, count: number }>
        this.BURST_LIMIT = 10;
        this.WINDOW_MS = 1000; // 1 second
    }

    /**
     * Middleware-style check for socket events
     */
    isRateLimited(socketId) {
        const now = Date.now();
        const record = this.limits.get(socketId) || { lastAction: now, count: 0 };

        if (now - record.lastAction > this.WINDOW_MS) {
            record.count = 1;
            record.lastAction = now;
        } else {
            record.count += 1;
        }

        this.limits.set(socketId, record);

        if (record.count > this.BURST_LIMIT) {
            console.warn(`🚫 Rate limit exceeded for socket ${socketId}`);
            return true;
        }

        return false;
    }

    cleanup(socketId) {
        this.limits.delete(socketId);
    }
}

module.exports = new SocketRateLimiter();
