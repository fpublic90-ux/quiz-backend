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
const fakeUsers = [
    {
        name: 'Shahal',
        xp: 18500, tier: 'Diamond', wins: 87, games: 140, score: 14200, coins: 2800,
        avatarKey: 'avatar_crown', ownedItems: ['avatar_crown', 'badge_fire', 'badge_shield', 'premium_ninja'],
    },
    {
        name: 'Dilna',
        xp: 9200, tier: 'Platinum', wins: 52, games: 95, score: 8800, coins: 1500,
        avatarKey: 'premium_gamer', ownedItems: ['premium_gamer', 'badge_bolt', 'avatar_gem'],
    },
    {
        name: 'Farhana',
        xp: 7400, tier: 'Platinum', wins: 41, games: 80, score: 7100, coins: 1200,
        avatarKey: 'premium_cat', ownedItems: ['premium_cat', 'badge_heart', 'avatar_star'],
    },
    {
        name: 'Sana',
        xp: 5600, tier: 'Gold', wins: 33, games: 65, score: 5400, coins: 900,
        avatarKey: 'avatar4', ownedItems: ['badge_fire', 'avatar_rocket'],
    },
    {
        name: 'Shaan',
        xp: 4300, tier: 'Gold', wins: 28, games: 58, score: 4100, coins: 750,
        avatarKey: 'premium_robot', ownedItems: ['premium_robot', 'badge_bolt'],
    },
    {
        name: 'Nidha',
        xp: 3200, tier: 'Gold', wins: 19, games: 44, score: 3000, coins: 600,
        avatarKey: 'avatar2', ownedItems: ['avatar_brain'],
    },
    {
        name: 'Jasil',
        xp: 2600, tier: 'Silver', wins: 15, games: 38, score: 2400, coins: 480,
        avatarKey: 'avatar3', ownedItems: ['badge_shield', 'avatar_rocket'],
    },
    {
        name: 'Midhulaj',
        xp: 1900, tier: 'Silver', wins: 11, games: 30, score: 1750, coins: 340,
        avatarKey: 'premium_ninja', ownedItems: ['premium_ninja'],
    },
    {
        name: 'Sneha',
        xp: 1400, tier: 'Silver', wins: 8, games: 24, score: 1300, coins: 260,
        avatarKey: 'avatar1', ownedItems: ['badge_heart'],
    },
    {
        name: 'Parvathy',
        xp: 1050, tier: 'Silver', wins: 6, games: 18, score: 980, coins: 200,
        ownedItems: ['avatar_crown', 'badge_fire', 'avatar_gem'],
        achievements: [
            { id: 'first_win', unlockedAt: new Date() },
            { id: 'gold_tier', unlockedAt: new Date() },
            { id: 'quiz_veteran', unlockedAt: new Date() }
        ]
    },
    {
        name: 'Arjun',
        email: 'arjun@fake.com',
        avatar: 'avatar2',
        level: 42,
        wins: 156,
        totalScore: 45000,
        tier: 'Gold',
        ownedItems: ['badge_fire', 'badge_bolt'],
        achievements: [
            { id: 'swift_thinker', unlockedAt: new Date() },
            { id: 'silver_tier', unlockedAt: new Date() }
        ]
    },
    {
        name: 'Meera',
        email: 'meera@fake.com',
        avatar: 'avatar3',
        level: 28,
        wins: 89,
        totalScore: 28000,
        tier: 'Silver',
        ownedItems: ['badge_heart'],
        achievements: [
            { id: 'malayali_expert', unlockedAt: new Date() }
        ]
    },
    {
        name: 'Rahul',
        email: 'rahul@fake.com',
        avatar: 'avatar4',
        level: 15,
        wins: 45,
        totalScore: 12000,
        tier: 'Bronze',
        ownedItems: [],
        achievements: [
            { id: 'first_win', unlockedAt: new Date() }
        ]
    },
    {
        name: 'Priya',
        email: 'priya@fake.com',
        avatar: 'avatar5',
        level: 67,
        wins: 234,
        totalScore: 89000,
        tier: 'Diamond',
        ownedItems: ['avatar_crown', 'avatar_gem'],
        achievements: [
            { id: 'diamond_tier', unlockedAt: new Date() },
            { id: 'century_club', unlockedAt: new Date() }
        ]
    },
    {
        name: 'Izza',
        xp: 700, tier: 'Bronze', wins: 4, games: 14, score: 660, coins: 160,
        avatarKey: 'avatar3', ownedItems: ['badge_fire'],
    },
    {
        name: 'Rena',
        xp: 420, tier: 'Bronze', wins: 3, games: 10, score: 390, coins: 130,
        avatarKey: 'avatar4', ownedItems: ['badge_bolt'],
    },
    {
        name: 'Fathima',
        xp: 200, tier: 'Bronze', wins: 1, games: 6, score: 180, coins: 110,
        avatarKey: 'avatar1', ownedItems: [],
    },
    {
        name: 'Sheiza',
        xp: 80, tier: 'Bronze', wins: 0, games: 3, score: 70, coins: 100,
        avatarKey: 'avatar2', ownedItems: [],
    },
];

async function seedUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected');

        let created = 0;
        let skipped = 0;

        for (const u of fakeUsers) {
            const fakeUid = `fake_${u.name.toLowerCase()}_${Date.now()}`;
            const email = `${u.name.toLowerCase()}@quizblitz.fake`;

            // Check if already exists
            const existing = await User.findOne({ email });
            if (existing) {
                console.log(`⏭️  Skipping ${u.name} (already exists)`);
                skipped++;
                continue;
            }

            const level = Math.floor(u.xp / 200) + 1;

            await User.create({
                uid: fakeUid,
                displayName: u.name,
                email,
                avatar: u.avatarKey,
                totalScore: u.score,
                gamesPlayed: u.games,
                wins: u.wins,
                level,
                xp: u.xp,
                coins: u.coins,
                tier: u.tier,
                achievements: u.achievements || [],
                ownedItems: u.ownedItems || [],
                following: [],
            });

            console.log(`✅ Created ${u.name} | XP: ${u.xp} | Tier: ${u.tier} | Level: ${level}`);
            created++;
        }

        console.log(`\n🎉 Done! ${created} users created, ${skipped} skipped.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedUsers();
