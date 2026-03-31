/**
 * Achievement Definitions Configuration
 * New achievements should be added here rather than modifying the core engine.
 */
const STAT_UPDATES = [
    {
        condition: (room, roomPlayer) => room.category === 'Kerala' || room.subject === 'Kerala',
        statField: 'keralaGamesPlayed'
    },
    {
        condition: (room, roomPlayer) => room.category === 'India' || room.subject === 'India',
        statField: 'indiaGamesPlayed'
    },
    {
        condition: (room, roomPlayer) => room.class === '10th (SSLC)' && room.subject === 'Physics',
        statField: 'sslcPhysicsCount'
    },
    {
        condition: (room, roomPlayer) => room.class === '10th (SSLC)' && room.subject === 'Biology',
        statField: 'sslcBiologyCount'
    },
    {
        condition: (room, roomPlayer) => room.class === '10th (SSLC)' && room.subject === 'Chemistry',
        statField: 'sslcChemistryCount'
    },
    {
        condition: (room, roomPlayer) => roomPlayer.fastAnswers >= 5,
        statField: 'speedMasteryCount'
    }
];

const ACHIEVEMENTS = [
    // Progression
    { id: 'first_win', condition: (user) => user.wins >= 1 },
    { id: 'century_club', condition: (user) => user.level >= 100 },
    { id: 'quiz_veteran', condition: (user) => user.gamesPlayed >= 50 },

    // Tiers
    { id: 'silver_tier', condition: (user) => ['Silver', 'Gold', 'Platinum', 'Diamond'].includes(user.tier) },
    { id: 'gold_tier', condition: (user) => ['Gold', 'Platinum', 'Diamond'].includes(user.tier) },
    { id: 'diamond_tier', condition: (user) => user.tier === 'Diamond' },

    // Wealth
    { id: 'coin_hoarder', condition: (user) => user.coins >= 1000 },

    // Category & Subject Mastery
    { id: 'malayali_expert', condition: (user) => (user.keralaGamesPlayed || 0) >= 10 },
    { id: 'india_champion', condition: (user) => (user.indiaGamesPlayed || 0) >= 10 },
    { id: 'physics_pro', condition: (user) => (user.sslcPhysicsCount || 0) >= 5 },
    { id: 'bio_master', condition: (user) => (user.sslcBiologyCount || 0) >= 5 },
    { id: 'chem_wizard', condition: (user) => (user.sslcChemistryCount || 0) >= 5 },

    // Speed
    { id: 'swift_thinker', condition: (user) => (user.speedMasteryCount || 0) >= 5 },
];

/**
 * AchievementManager handles checking and unlocking player achievements
 * using a configuration-driven rule engine.
 */
class AchievementManager {
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

        // 1. Process and track any custom category/game stats
        STAT_UPDATES.forEach(rule => {
            if (rule.condition(room, roomPlayer)) {
                const currentCount = user[rule.statField] || 0;
                statsUpdate[rule.statField] = currentCount + 1;
                // Temporarily inject into user for downstream achievement evaluation
                user[rule.statField] = currentCount + 1;
            }
        });

        // 2. Track Level Mastery (Dynamic Thresholds)
        if (room.level && room.category) {
            const category = room.category;
            const level = parseInt(room.level);

            // Category-specific passing thresholds for mastering
            let threshold = 100;
            if (category === 'PSC') threshold = 50;
            else if (category === 'Student Center') threshold = 80;
            
            if (roomPlayer.score >= threshold) {
                // Ensure masteredLevels exists (it's a Map in the model)
                if (!user.masteredLevels) user.masteredLevels = new Map();
                
                let masteredInCat = [];
                if (typeof user.masteredLevels.get === 'function') {
                    masteredInCat = user.masteredLevels.get(category) || [];
                } else {
                    masteredInCat = user.masteredLevels[category] || [];
                }
                
                if (!masteredInCat.includes(level)) {
                    masteredInCat.push(level);
                    // Mark for update in RewardManager
                    statsUpdate[`masteredLevels.${category}`] = masteredInCat;
                }
            }
        }

        // 2. Evaluate all defined achievements
        ACHIEVEMENTS.forEach(achievement => {
            if (!unlockedIds.has(achievement.id) && achievement.condition(user, roomPlayer, room)) {
                newlyUnlocked.push(achievement.id);
            }
        });

        return { newlyUnlocked, statsUpdate };
    }
}

module.exports = new AchievementManager();
