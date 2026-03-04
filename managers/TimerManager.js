// Manages server-side countdown timers per room
// timers: { [roomCode]: NodeJS.Timeout }
const timers = {};
const endTimes = {}; // { [roomCode]: timestamp_ms }

const QUESTION_DURATION_MS = 15000; // 15 seconds

/**
 * Start a countdown for a room question.
 */
function startTimer(code, onTick, onExpire) {
    clearTimer(code);

    const now = Date.now();
    const expiresAt = now + QUESTION_DURATION_MS;
    endTimes[code] = expiresAt;

    // Tick function to calculate remaining time exactly
    const tick = () => {
        const remaining = Math.max(0, Math.ceil((endTimes[code] - Date.now()) / 1000));
        onTick(remaining, expiresAt); // Send both for sync

        if (remaining <= 0) {
            clearTimer(code);
            onExpire();
        }
    };

    // Initial tick
    tick();

    // Secondary interval for the seconds countdown
    timers[code] = setInterval(tick, 1000);
}

/**
 * Clear the timer for a room
 */
function clearTimer(code) {
    if (timers[code]) {
        clearInterval(timers[code]);
        delete timers[code];
    }
    delete endTimes[code];
}

/**
 * Check if a timer is running for a room
 */
function isRunning(code) {
    return !!timers[code];
}

function getTimeRemaining(code) {
    return remainingTime[code] || 0;
}

module.exports = { startTimer, clearTimer, isRunning, getTimeRemaining };
