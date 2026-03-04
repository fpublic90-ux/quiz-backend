/**
 * seed_users.js
 * Run with: node seed_users.js
 * Seeds fake user accounts into the database for a realistic leaderboard.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

// Fake users with realistic XP distributions across all tiers
// Helper to generate a realistic looking Firebase UID
function generateRealisticUid() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 28; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const emailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@icloud.com'];
function getRandomEmail(name) {
    const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const randomSuffix = Math.floor(Math.random() * 999);
    return `${name.toLowerCase()}${randomSuffix}${domain}`;
}

const commonBios = [
    "Love playing quizzes! 🧠✨",
    "On a journey to the Top! 🏆",
    "Knowledge is power. 📚",
    "GK expert in the making. Kerala representative! 🌴",
    "Casual player, always learning.",
    "Challenge me! 🎮",
    "History and Science lover. 🧪🏛️",
    "Aiming for Diamond tier! 💎",
    "Quiz enthusiast from Kerala. 📍",
    "Speed and accuracy is my game. ⚡"
];

// Sorted by XP rank (highest first). followerCount descends from 3000.
const fakeUsers = [
    { name: 'Priya', xp: 45000, tier: 'Diamond', wins: 234, games: 320, score: 89000, coins: 8000, avatar: 'avatar_crown', ownedItems: ['avatar_crown', 'avatar_gem', 'badge_fire'], followerCount: 3000, followingCount: 320 },
    { name: 'Shahal', xp: 18500, tier: 'Diamond', wins: 87, games: 140, score: 14200, coins: 2800, avatar: 'avatar_crown', ownedItems: ['avatar_crown', 'badge_fire', 'badge_shield', 'premium_ninja'], followerCount: 2820, followingCount: 240 },
    { name: 'Meera', xp: 15400, tier: 'Platinum', wins: 89, games: 150, score: 28000, coins: 2500, avatar: 'avatar3', ownedItems: ['badge_heart', 'badge_shield'], followerCount: 2640, followingCount: 195 },
    { name: 'Dilna', xp: 9200, tier: 'Platinum', wins: 52, games: 95, score: 8800, coins: 1500, avatar: 'premium_gamer', ownedItems: ['premium_gamer', 'badge_bolt', 'avatar_gem'], followerCount: 2460, followingCount: 165 },
    { name: 'Rahul', xp: 8200, tier: 'Platinum', wins: 45, games: 85, score: 12000, coins: 1500, avatar: 'avatar4', ownedItems: ['badge_bolt'], followerCount: 2280, followingCount: 140 },
    { name: 'Farhana', xp: 7400, tier: 'Platinum', wins: 41, games: 80, score: 7100, coins: 1200, avatar: 'premium_cat', ownedItems: ['premium_cat', 'badge_heart', 'avatar_star'], followerCount: 2100, followingCount: 118 },
    { name: 'Sana', xp: 5600, tier: 'Gold', wins: 33, games: 65, score: 5400, coins: 900, avatar: 'avatar4', ownedItems: ['badge_fire', 'avatar_rocket'], followerCount: 1920, followingCount: 98 },
    { name: 'Shaan', xp: 4300, tier: 'Gold', wins: 28, games: 58, score: 4100, coins: 750, avatar: 'premium_robot', ownedItems: ['premium_robot', 'badge_bolt'], followerCount: 1740, followingCount: 82 },
    { name: 'Arjun', xp: 3120, tier: 'Diamond', wins: 156, games: 240, score: 45000, coins: 5000, avatar: 'premium_ninja', ownedItems: ['premium_ninja', 'badge_fire', 'badge_bolt'], followerCount: 1560, followingCount: 70 },
    { name: 'Nidha', xp: 3200, tier: 'Gold', wins: 19, games: 44, score: 3000, coins: 600, avatar: 'avatar2', ownedItems: ['avatar_brain'], followerCount: 1380, followingCount: 58 },
    { name: 'Jasil', xp: 2600, tier: 'Silver', wins: 15, games: 38, score: 2400, coins: 480, avatar: 'avatar3', ownedItems: ['badge_shield', 'avatar_rocket'], followerCount: 1200, followingCount: 48 },
    { name: 'Midhulaj', xp: 1900, tier: 'Silver', wins: 11, games: 30, score: 1750, coins: 340, avatar: 'premium_ninja', ownedItems: ['premium_ninja'], followerCount: 1020, followingCount: 38 },
    { name: 'Sneha', xp: 1400, tier: 'Silver', wins: 8, games: 24, score: 1300, coins: 260, avatar: 'avatar1', ownedItems: ['badge_heart'], followerCount: 840, followingCount: 30 },
    { name: 'Parvathy', xp: 1050, tier: 'Silver', wins: 6, games: 18, score: 980, coins: 200, avatar: 'avatar1', ownedItems: ['avatar_crown', 'badge_fire', 'avatar_gem'], followerCount: 660, followingCount: 22 },
    { name: 'Izza', xp: 700, tier: 'Bronze', wins: 4, games: 14, score: 660, coins: 160, avatar: 'avatar3', ownedItems: ['badge_fire'], followerCount: 480, followingCount: 14 },
    { name: 'Rena', xp: 420, tier: 'Bronze', wins: 3, games: 10, score: 390, coins: 130, avatar: 'avatar4', ownedItems: ['badge_bolt'], followerCount: 300, followingCount: 8 },
    { name: 'Fathima', xp: 200, tier: 'Bronze', wins: 1, games: 6, score: 180, coins: 110, avatar: 'avatar1', ownedItems: [], followerCount: 175, followingCount: 4 },
    { name: 'Sheiza', xp: 80, tier: 'Bronze', wins: 0, games: 3, score: 70, coins: 100, avatar: 'avatar2', ownedItems: [], followerCount: 80, followingCount: 2 },
];

async function seedUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Optional: clear previous fake users if they have 'fake_' in UID or specific domain
        // However, we want them to look real now, so we'll just check if their name exists.

        let created = 0;
        let updated = 0;

        for (const u of fakeUsers) {
            // Check if user with this name already exists
            const existing = await User.findOne({ displayName: u.name });

            const uid = existing ? existing.uid : generateRealisticUid();
            const email = existing ? existing.email : getRandomEmail(u.name);
            const bio = u.bio || (existing ? existing.bio : commonBios[Math.floor(Math.random() * commonBios.length)]);

            // Random join date in the last 60 days
            const joinDate = existing ? existing.createdAt : new Date();
            if (!existing) joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 60));

            const level = u.level || (u.xp ? Math.floor(u.xp / 200) + 1 : 1);
            const xp = u.xp || (u.level ? (u.level - 1) * 200 : 0);
            const totalScore = u.totalScore || u.score || 0;
            const gamesPlayed = u.games || (u.wins ? Math.floor(u.wins * 1.5) : 0);
            const avatar = u.avatar || 'avatar1';

            // Find by displayName and update all fields, or create new
            await User.findOneAndUpdate(
                { displayName: u.name },
                {
                    uid,
                    displayName: u.name,
                    email,
                    avatar,
                    bio,
                    totalScore,
                    gamesPlayed,
                    wins: u.wins || 0,
                    level,
                    xp,
                    coins: u.coins || 100,
                    tier: u.tier || 'Bronze',
                    achievements: u.achievements || [],
                    ownedItems: u.ownedItems || [],
                    // following and followers will be set in the second pass
                    createdAt: joinDate
                },
                { upsert: true, new: true }
            );

            if (existing) {
                console.log(`🔄 Updated Realistic Player: ${u.name} | Level: ${level}`);
                updated++;
            } else {
                console.log(`✅ Created Realistic Player: ${u.name} | Email: ${email}`);
                created++;
            }
        }

        console.log(`\n🎉 Seeded/Updated ${fakeUsers.length} players. Now linking them...`);

        // Second pass: Interconnect all fake users with proper counts
        const allFakeUsers = await User.find({ displayName: { $in: fakeUsers.map(u => u.name) } });
        const allUids = allFakeUsers.map(u => u.uid);

        // Build a map: name -> { followerCount, followingCount }
        const userConfig = {};
        for (const u of fakeUsers) {
            userConfig[u.name] = {
                followerCount: u.followerCount || 0,
                followingCount: u.followingCount || 0,
            };
        }

        for (const user of allFakeUsers) {
            const cfg = userConfig[user.displayName] || {};
            const targetFollowers = cfg.followerCount || 0;
            const targetFollowing = cfg.followingCount || 0;

            // Start with the real fake user UIDs (exclude self)
            const otherUids = allUids.filter(uid => uid !== user.uid);

            // Build followers list: real fake users + dummy UIDs to reach target
            const followers = [...otherUids];
            let fi = 0;
            while (followers.length < targetFollowers) {
                followers.push(`dummy_follower_${fi++}_${user.displayName}`);
            }

            // Build following list: real fake users + dummy UIDs to reach target
            const following = [...otherUids];
            let gi = 0;
            while (following.length < targetFollowing) {
                following.push(`dummy_following_${gi++}_${user.displayName}`);
            }

            await User.updateOne(
                { uid: user.uid },
                { $set: { followers, following } }
            );

            console.log(`🔗 ${user.displayName}: ${followers.length} followers, ${following.length} following`);
        }

        console.log(`✅ All ${allFakeUsers.length} players updated with realistic social counts!`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedUsers();
