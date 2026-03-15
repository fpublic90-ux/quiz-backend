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
            coinReward = Math.round(120 * baseRewardMultiplier);
            xpMultiplier = 1.5;
        } else if (rank === 2) {
            coinReward = Math.round(60 * baseRewardMultiplier);
            xpMultiplier = 1.2;
        } else if (rank === 3) {
            coinReward = Math.round(20 * baseRewardMultiplier);
            xpMultiplier = 1.1;
        } else {
            coinReward = Math.round(5 * baseRewardMultiplier);
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
    /**
     * Persist rewards and update user profile stats + achievements
     * @param {String} uid - User ID
     * @param {Object} rewards - { coins, xp, isWin }
     * @param {Object} roomPlayer - Player session object (for achievements)
     * @param {Object} room - Room object
     * @param {Object} achievementManager - The AchievementManager instance
     * @param {Object} notificationManager - The NotificationManager instance
     * @param {Object} io - Socket.io instance for notifications
     * @param {Map} userSockets - UID to SocketID map
     */
    async updateUserStats(uid, rewards, roomPlayer, room, achievementManager, notificationManager, io, userSockets) {
        if (!uid) return null;

        try {
            // 1. Build atomic update for primary stats
            const primaryUpdate = {
                $inc: {
                    gamesPlayed: 1,
                    totalScore: roomPlayer.score,
                    wins: rewards.isWin ? 1 : 0,
                    coins: rewards.coins,
                    xp: rewards.xp,
                    weeklyXp: rewards.xp,
                    monthlyXp: rewards.xp,
                    totalCorrectAnswers: Math.floor(roomPlayer.score / 10),
                    totalQuestionsAttempts: (room.questions || []).length,
                    totalAttempts: 1
                }
            };

            // Setup questions history
            if (room.questions && room.questions.length > 0) {
                const questionIds = room.questions.map(q => q._id);
                primaryUpdate.$push = {
                    answeredQuestions: {
                        $each: questionIds,
                        $slice: -2000
                    }
                };
            }

            // 2. Perform the initial update to increment stats atomically
            const updatedUser = await User.findOneAndUpdate(
                { uid },
                primaryUpdate,
                { new: true }
            );

            if (!updatedUser) return null;

            // 3. Evaluate Level & Tier based on new accurate XP
            const newLevel = Math.floor(updatedUser.xp / 200) + 1;
            const newTier = this.calculateTier(updatedUser.xp);

            // Apply it to the updatedUser object in memory before checking achievements
            updatedUser.level = newLevel;
            updatedUser.tier = newTier;

            // 4. Check achievements and extra category-specific stats updates
            // (Uses the freshly updated user stats for accurate evaluation)
            const { newlyUnlocked, statsUpdate } = achievementManager.checkAchievements(updatedUser, roomPlayer, room);

            // 5. Build secondary atomic update for Level, Tier, Achievements, and Category Stats
            const secondaryUpdate = {
                $set: {
                    level: newLevel,
                    tier: newTier
                }
            };

            if (statsUpdate && Object.keys(statsUpdate).length > 0) {
                secondaryUpdate.$set = { ...secondaryUpdate.$set, ...statsUpdate };
            }

            if (newlyUnlocked.length > 0) {
                if (!secondaryUpdate.$push) secondaryUpdate.$push = {};
                secondaryUpdate.$push.achievements = {
                    $each: newlyUnlocked.map(id => ({ id }))
                };
            }

            // 6. Apply secondary update if there are changes
            const finalUser = await User.findOneAndUpdate(
                { uid },
                secondaryUpdate,
                { new: true }
            );

            // 7. Emit real-time notifications for each achievement (only AFTER DB updates)
            if (newlyUnlocked.length > 0) {
                const socketId = userSockets.get(uid);
                if (socketId && io) {
                    io.to(socketId).emit('achievement_unlocked', { achievements: newlyUnlocked });
                }

                for (const achievementId of newlyUnlocked) {
                    await notificationManager.notify(io, userSockets, {
                        recipient: uid,
                        type: 'achievement',
                        title: 'Achievement Unlocked! 🏆',
                        message: `Congratulations! You've earned the "${achievementId.replace(/_/g, ' ')}" medal.`,
                        data: { achievementId }
                    });
                }
            }

            return {
                coins: finalUser.coins,
                xp: finalUser.xp,
                level: finalUser.level,
                tier: finalUser.tier,
                wins: finalUser.wins,
                gamesPlayed: finalUser.gamesPlayed
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
