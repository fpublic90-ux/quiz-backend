// Manages server-side countdown timers per room
// timers: { [roomCode]: NodeJS.Timeout }
const timers = {};
const remainingTime = {}; // { [roomCode]: seconds }

const QUESTION_DURATION_MS = 15000; // 15 seconds

/**
 * Start a countdown for a room question.
 * @param {string} code - Room code
 * @param {Function} onTick - Called every second with remaining seconds
 * @param {Function} onExpire - Called when timer reaches 0
 */
function startTimer(code, onTick, onExpire) {
    clearTimer(code);

    remainingTime[code] = 15;

    // Emit first tick immediately
    onTick(remainingTime[code]);

    timers[code] = setInterval(() => {
        remainingTime[code] -= 1;
        onTick(remainingTime[code]);

        if (remainingTime[code] <= 0) {
            clearTimer(code);
            onExpire();
        }
    }, 1000);
}

/**
 * Clear the timer for a room
 */
function clearTimer(code) {
    if (timers[code]) {
        clearInterval(timers[code]);
        delete timers[code];
    }
    delete remainingTime[code];
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
