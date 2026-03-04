// Manages server-side countdown timers per room
// timers: { [roomCode]: NodeJS.Timeout }
const timers = {};
const endTimes = {}; // { [roomCode]: timestamp_ms }

const QUESTION_DURATION_MS = 15000; // 15 seconds

/**
 * Start a countdown for a room question.
 */
function startTimer(code, onTick, onExpire) {
    try {
        clearTimer(code);

        const now = Date.now();
        const expiresAt = now + QUESTION_DURATION_MS;
        endTimes[code] = expiresAt;

        // Tick function to calculate remaining time exactly
        const tick = () => {
            try {
                const remaining = Math.max(0, Math.ceil((endTimes[code] - Date.now()) / 1000));
                onTick(remaining, expiresAt); // Send both for sync

                if (remaining <= 0) {
                    clearTimer(code);
                    onExpire();
                }
            } catch (error) {
                console.error(`Error in timer tick for room ${code}:`, error);
                clearTimer(code); // Attempt to clear timer on error
            }
        };

        // Initial tick
        tick();

        // Secondary interval for the seconds countdown
        timers[code] = setInterval(tick, 1000);
    } catch (error) {
        console.error(`Error starting timer for room ${code}:`, error);
        clearTimer(code); // Ensure any partial timer is cleared
    }
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
    if (!endTimes[code]) return 0;
    return Math.max(0, (endTimes[code] - Date.now()) / 1000);
}

module.exports = { startTimer, clearTimer, isRunning, getTimeRemaining };
