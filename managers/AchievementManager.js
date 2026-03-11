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
    /**
     * Check for all achievement criteria and return updates
     * @param {Object} user - The user data (plain object or doc)
     * @param {Object} roomPlayer - The player object from the room
     * @param {Object} room - The room state object
     * @returns {Object} { newlyUnlocked: [], statsUpdate: {} }
     */
    checkAchievements(user, roomPlayer, room) {
        const newlyUnlocked = [];
        const statsUpdate = {};
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

        // Category & Subject Mastery
        if (room.category === 'Kerala' || room.subject === 'Kerala') {
            const count = (user.keralaGamesPlayed || 0) + 1;
            statsUpdate.keralaGamesPlayed = count;
            check('malayali_expert', count >= 10);
        }
        if (room.category === 'India' || room.subject === 'India') {
            const count = (user.indiaGamesPlayed || 0) + 1;
            statsUpdate.indiaGamesPlayed = count;
            check('india_champion', count >= 10);
        }

        // NEW: SSLC Mastery Medals
        if (room.class === '10th (SSLC)') {
            if (room.subject === 'Physics') {
                const count = (user.sslcPhysicsCount || 0) + 1;
                statsUpdate.sslcPhysicsCount = count;
                check('physics_pro', count >= 5);
            }
            if (room.subject === 'Biology') {
                const count = (user.sslcBiologyCount || 0) + 1;
                statsUpdate.sslcBiologyCount = count;
                check('bio_master', count >= 5);
            }
            if (room.subject === 'Chemistry') {
                const count = (user.sslcChemistryCount || 0) + 1;
                statsUpdate.sslcChemistryCount = count;
                check('chem_wizard', count >= 5);
            }
        }

        // Speed Mastery
        if (roomPlayer.fastAnswers >= 5) {
            const count = (user.speedMasteryCount || 0) + 1;
            statsUpdate.speedMasteryCount = count;
            check('swift_thinker', count >= 5);
        }

        return { newlyUnlocked, statsUpdate };
    }
}

module.exports = new AchievementManager();

module.exports = new AchievementManager();
