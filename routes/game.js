const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AchievementManager = require('../managers/AchievementManager');
const RewardManager = require('../managers/RewardManager');
const NotificationManager = require('../managers/NotificationManager');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = (io, userSockets) => {
    // Save game results (Solo or Matchmaking fallbacks)
    router.post('/save-results', verifyToken, async (req, res) => {
        try {
            const { uid, score, rank, category, fastAnswers, isPractice, practiceLevel, questionIds, chapter, subject, board, schoolClass } = req.body;

            if (!uid) {
                return res.status(400).json({ message: 'UID is required' });
            }

            const user = await User.findOne({ uid });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // --- Anti-Cheat Validation ---
            // Max 10 base points + up to 5 points speed bonus per question
            const qCount = (questionIds && Array.isArray(questionIds)) ? questionIds.length : 10;
            const maxPossibleScore = qCount * 15; 
            
            let validatedScore = score || 0;
            if (validatedScore > maxPossibleScore) {
                console.warn(`🚨 Anti-Cheat Flag: User ${uid} submitted score ${validatedScore} which exceeds max ${maxPossibleScore}. Capping score.`);
                validatedScore = maxPossibleScore;
            }

            // 1. Practice Mode (Simple history update)
            if (isPractice) {
                const update = {};
                if (questionIds && Array.isArray(questionIds)) {
                    update.$push = {
                        answeredQuestions: {
                            $each: questionIds,
                            $slice: -2000
                        }
                    };
                }

                if (practiceLevel && category) {
                    // Category-specific passing thresholds
                    let threshold = 100;
                    if (category === 'PSC') threshold = 50;
                    else if (category === 'Student Center') threshold = 80;

                    // Advance practice level and track mastered levels if user performed well
                    if (validatedScore >= threshold) {
                        const existing = user.practiceLevels.get(category) || 0;
                        if (practiceLevel > existing) {
                            if (!update.$set) update.$set = {};
                            update.$set[`practiceLevels.${category}`] = practiceLevel;
                        }

                        // Also update masteredLevels for UI badge ("COMPLETED")
                        const levelNum = parseInt(practiceLevel);
                        let mastered = user.masteredLevels.get(category) || [];
                        if (!mastered.includes(levelNum)) {
                            if (!update.$set) update.$set = {};
                            mastered.push(levelNum);
                            update.$set[`masteredLevels.${category}`] = mastered;
                        }
                    }
                }

                // Practice Rewards: 10/10 correct (100+ score) -> 20 coins + 10 XP
                // Adjusted for PSC (5/10) and Student Center (8/10)
                let isPassed = false;
                if (category === 'PSC') isPassed = validatedScore >= 50;
                else if (category === 'Student Center') isPassed = validatedScore >= 80;
                else isPassed = validatedScore >= 100;

                const practiceRewards = isPassed ? { coins: 20, xp: 10 } : { coins: 0, xp: 0 };
                
                if (!update.$inc) update.$inc = {};
                update.$inc.coins = practiceRewards.coins;
                update.$inc.xp = practiceRewards.xp;
                update.$inc.totalXp = practiceRewards.xp;
                update.$inc.totalAttempts = 1;
                update.$inc.totalCorrectAnswers = Math.floor(validatedScore / 10);
                update.$inc.totalQuestionsAttempts = qCount;

                const updatedUser = Object.keys(update).length > 0
                    ? await User.findOneAndUpdate({ uid }, update, { new: true })
                    : user;

                return res.status(200).json({
                    message: 'Practice session history saved',
                    user: updatedUser,
                    coinReward: practiceRewards.coins,
                    xpGained: practiceRewards.xp
                });
            }

            // 2. Normal Mode (Competitive/Student Center)
            // Calculate Rewards
            const leaderboard = [{ uid, score: validatedScore }]; // Mock for calculating rank rewards
            const socketId = userSockets.get(uid);
            const roomPlayer = { id: socketId, name: user.displayName, score: validatedScore, fastAnswers: fastAnswers || 0 };
            const room = {
                type: 'solo',
                category: category || 'General',
                chapter: chapter || null,
                subject: subject || null,
                board: board || null,
                class: schoolClass || null,
                questions: (questionIds || []).map(id => ({ _id: id }))
            };

            const rewards = RewardManager.calculateRewards(roomPlayer, leaderboard, room, 'solo');

            // Persist Stats & Achievements & Notifications
            const profileUpdate = await RewardManager.updateUserStats(
                uid,
                rewards,
                roomPlayer,
                room,
                AchievementManager,
                NotificationManager,
                io,
                userSockets
            );

            res.status(200).json({
                user: profileUpdate,
                xpGained: rewards.xp,
                coinReward: rewards.coins,
                message: 'Game results saved successfully'
            });

        } catch (error) {
            console.error('Error saving game results:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
