const User = require('../models/User');

/**
 * RewardManager handles XP, Coins, and Progression logic.
 */
class RewardManager {
    /**
     * Calculate rewards for a player based on their performance
     * @param {Object} player - The player object from the room
     * @param {Array} leaderboard - Sorted list of players
     * @param {Object} room - The room object
     * @param {String} reason - Reason for game end (e.g., 'opponent_left')
     * @returns {Object} { coins: number, xp: number, isWin: boolean }
     */
    calculateRewards(player, leaderboard, room, reason) {
        if (!player.isActive) return { coins: 0, xp: 0, isWin: false };

        // 1. Identify Rank
        const rank = leaderboard.findIndex(p => p.uid === player.uid) + 1;
        const isWin = rank === 1;

        // 2. Base Multiplier (Social matches get 50% base rewards)
        const baseRewardMultiplier = room.type === 'matchmaking' ? 1.0 : 0.5;

        let coinReward = 0;
        let xpMultiplier = 1.0;

        // 3. Rank-based rewards
        if (rank === 1) {
            coinReward = Math.round(100 * baseRewardMultiplier);
            xpMultiplier = 1.5;
        } else if (rank === 2) {
            coinReward = Math.round(50 * baseRewardMultiplier);
            xpMultiplier = 1.2;
        } else if (rank === 3) {
            coinReward = Math.round(30 * baseRewardMultiplier);
            xpMultiplier = 1.1;
        } else {
            coinReward = Math.round(10 * baseRewardMultiplier);
            xpMultiplier = 1.0;
        }

        // 4. Fair Play Bonus
        let xpBonus = 0;
        if (reason === 'opponent_left' && leaderboard.filter(p => p.isActive).length === 1) {
            coinReward += 25;
            xpBonus = 50;
        }

        // 5. XP Calculation
        const xpGained = Math.round(player.score * xpMultiplier) + xpBonus;

        // 6. Student Center Override
        const isStudentChapter = room.category === 'Student Center' && room.chapter != null;
        if (isStudentChapter) {
            return { coins: 0, xp: 0, isWin };
        }

        return { coins: coinReward, xp: xpGained, isWin };
    }

    /**
     * Persist rewards and update user profile stats + achievements
     * @param {String} uid - User ID
     * @param {Object} rewards - { coins, xp, isWin }
     * @param {Object} roomPlayer - Player session object (for achievements)
     * @param {Object} room - Room object
     * @param {Object} achievementManager - The AchievementManager instance
     * @param {Object} io - Socket.io instance for notifications
     */
    async updateUserStats(uid, rewards, roomPlayer, room, achievementManager, io) {
        if (!uid) return null;

        try {
            const user = await User.findOne({ uid });
            if (!user) return null;

            user.gamesPlayed += 1;
            user.totalScore += roomPlayer.score;
            if (rewards.isWin) user.wins += 1;

            user.coins += rewards.coins;
            user.xp += rewards.xp;

            // Update Level & Tier
            user.level = Math.floor(user.xp / 200) + 1;
            user.tier = this.calculateTier(user.xp);

            // History tracking
            if (room.questions) {
                const questionIds = room.questions.map(q => q._id);
                user.answeredQuestions = [...(user.answeredQuestions || []), ...questionIds];
                if (user.answeredQuestions.length > 500) {
                    user.answeredQuestions = user.answeredQuestions.slice(-500);
                }
            }

            // ── Achievements Check (Consolidated) ──────────────────
            const newlyUnlocked = achievementManager.checkAchievements(user, roomPlayer, room);
            if (newlyUnlocked.length > 0) {
                newlyUnlocked.forEach(id => {
                    user.achievements.push({ id });
                });
                console.log(`🏆 Achievements Unlocked for ${roomPlayer.name}: ${newlyUnlocked.join(', ')}`);

                // Real-time notification
                if (io) {
                    io.to(roomPlayer.id).emit('achievement_unlocked', {
                        achievements: newlyUnlocked
                    });
                }
            }

            await user.save();

            return {
                coins: user.coins,
                xp: user.xp,
                level: user.level,
                tier: user.tier,
                wins: user.wins,
                gamesPlayed: user.gamesPlayed
            };
        } catch (error) {
            console.error(`❌ RewardManager Error for UID ${uid}:`, error);
            throw error;
        }
    }

    /**
     * Determine tier based on total XP
     */
    calculateTier(xp) {
        if (xp >= 15000) return 'Diamond';
        if (xp >= 7000) return 'Platinum';
        if (xp >= 3000) return 'Gold';
        if (xp >= 1000) return 'Silver';
        return 'Bronze';
    }
}

module.exports = new RewardManager();
