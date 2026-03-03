/**
 * AchievementManager handles checking and unlocking player achievements
 * based on their performance and game stats.
 */
class AchievementManager {
    /**
     * Check for all achievement criteria and return newly unlocked IDs
     * @param {Object} user - The Mongoose user model instance
     * @param {Object} roomPlayer - The player object from the room
     * @param {Object} room - The room state object
     * @returns {Array} List of newly unlocked achievement IDs
     */
    checkAchievements(user, roomPlayer, room) {
        const newlyUnlocked = [];
        const unlockedIds = new Set((user.achievements || []).map(a => a.id));

        const check = (id, condition) => {
            if (!unlockedIds.has(id) && condition) newlyUnlocked.push(id);
        };

        // Progression
        check('first_win', user.wins >= 1);
        check('century_club', user.level >= 100);
        check('quiz_veteran', user.gamesPlayed >= 50);

        // Tiers
        check('silver_tier', ['Silver', 'Gold', 'Platinum', 'Diamond'].includes(user.tier));
        check('gold_tier', ['Gold', 'Platinum', 'Diamond'].includes(user.tier));
        check('diamond_tier', user.tier === 'Diamond');

        // Stats & Skills
        check('coin_hoarder', user.coins >= 1000);

        // Category Mastery
        if (room.category === 'Kerala') {
            user.keralaGamesPlayed = (user.keralaGamesPlayed || 0) + 1;
            check('malayali_expert', user.keralaGamesPlayed >= 10);
        }
        if (room.category === 'India') {
            user.indiaGamesPlayed = (user.indiaGamesPlayed || 0) + 1;
            check('india_champion', user.indiaGamesPlayed >= 10);
        }

        // Speed Mastery (Tracked during game)
        // Description: "Answer 5 questions in under 3 seconds"
        if (roomPlayer.fastAnswers >= 5) {
            user.speedMasteryCount = (user.speedMasteryCount || 0) + 1;
            check('swift_thinker', true);
        } else if ((user.speedMasteryCount || 0) >= 5) {
            check('swift_thinker', true);
        }

        return newlyUnlocked;
    }

    /**
     * Persists newly unlocked achievements to the user profile
     * @param {Object} user - The Mongoose user model instance
     * @param {Array} achievementIds - List of IDs to unlock
     */
    async persistAchievements(user, achievementIds) {
        if (!achievementIds || achievementIds.length === 0) return;

        achievementIds.forEach(id => {
            user.achievements.push({ id });
        });

        await user.save();
    }
}

module.exports = new AchievementManager();
