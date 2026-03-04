const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AchievementManager = require('../managers/AchievementManager');

// Save game results (Solo or Matchmaking fallbacks)
router.post('/save-results', async (req, res) => {
    try {
        const { uid, score, rank, category, fastAnswers, isPractice, questionIds } = req.body;

        if (!uid) {
            return res.status(400).json({ message: 'UID is required' });
        }

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Always update question history if provided
        if (questionIds && Array.isArray(questionIds)) {
            user.answeredQuestions = [...(user.answeredQuestions || []), ...questionIds];
            // Limit to last 500 seen questions
            if (user.answeredQuestions.length > 500) {
                user.answeredQuestions = user.answeredQuestions.slice(-500);
            }
        }

        if (isPractice) {
            await user.save();
            return res.status(200).json({ message: 'Practice session history saved', user });
        }

        // Update stats for non-practice games
        user.gamesPlayed += 1;
        user.totalScore += (score || 0);
        if (rank === 1) user.wins += 1;

        // Award Coins based on rank
        let coinReward = 10;
        if (rank === 1) coinReward = 100;
        else if (rank === 2) coinReward = 50;
        else if (rank === 3) coinReward = 30;
        user.coins += coinReward;

        // Award XP
        let xpMultiplier = 1.0;
        if (rank === 1) xpMultiplier = 1.5;
        else if (rank === 2) xpMultiplier = 1.2;
        else if (rank === 3) xpMultiplier = 1.1;
        const xpGained = Math.round((score || 0) * xpMultiplier);
        user.xp += xpGained;

        // Leveling & Tiers
        user.level = Math.floor(user.xp / 200) + 1;
        if (user.xp >= 15000) user.tier = 'Diamond';
        else if (user.xp >= 7000) user.tier = 'Platinum';
        else if (user.xp >= 3000) user.tier = 'Gold';
        else if (user.xp >= 1000) user.tier = 'Silver';
        else user.tier = 'Bronze';

        // Check Achievements
        const mockRoomPlayer = { fastAnswers: fastAnswers || 0 };
        const mockRoom = { category: category || 'All' };

        const newlyUnlocked = AchievementManager.checkAchievements(user, mockRoomPlayer, mockRoom);
        if (newlyUnlocked.length > 0) {
            await AchievementManager.persistAchievements(user, newlyUnlocked);
        }

        await user.save();

        res.status(200).json({
            user,
            xpGained,
            coinReward,
            newlyUnlocked
        });
    } catch (error) {
        console.error('Error saving game results:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
