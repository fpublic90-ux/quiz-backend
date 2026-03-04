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
        avatarKey: 'premium_crown', ownedItems: ['badge_top1', 'premium_crown'],
    },
    {
        name: 'Dilna',
        xp: 9200, tier: 'Platinum', wins: 52, games: 95, score: 8800, coins: 1500,
        avatarKey: 'premium_neon', ownedItems: ['premium_neon'],
    },
    {
        name: 'Farhana',
        xp: 7400, tier: 'Platinum', wins: 41, games: 80, score: 7100, coins: 1200,
        avatarKey: 'avatar3', ownedItems: ['badge_speed'],
    },
    {
        name: 'Sana',
        xp: 5600, tier: 'Gold', wins: 33, games: 65, score: 5400, coins: 900,
        avatarKey: 'avatar4', ownedItems: [],
    },
    {
        name: 'Shaan',
        xp: 4300, tier: 'Gold', wins: 28, games: 58, score: 4100, coins: 750,
        avatarKey: 'avatar1', ownedItems: ['premium_tech'],
    },
    {
        name: 'Nidha',
        xp: 3200, tier: 'Gold', wins: 19, games: 44, score: 3000, coins: 600,
        avatarKey: 'avatar2', ownedItems: [],
    },
    {
        name: 'Jasil',
        xp: 2600, tier: 'Silver', wins: 15, games: 38, score: 2400, coins: 480,
        avatarKey: 'avatar3', ownedItems: ['badge_kerala'],
    },
    {
        name: 'Midhulaj',
        xp: 1900, tier: 'Silver', wins: 11, games: 30, score: 1750, coins: 340,
        avatarKey: 'avatar4', ownedItems: [],
    },
    {
        name: 'Sneha',
        xp: 1400, tier: 'Silver', wins: 8, games: 24, score: 1300, coins: 260,
        avatarKey: 'avatar1', ownedItems: [],
    },
    {
        name: 'Parvathy',
        xp: 1050, tier: 'Silver', wins: 6, games: 18, score: 980, coins: 200,
        avatarKey: 'avatar2', ownedItems: [],
    },
    {
        name: 'Izza',
        xp: 700, tier: 'Bronze', wins: 4, games: 14, score: 660, coins: 160,
        avatarKey: 'avatar3', ownedItems: [],
    },
    {
        name: 'Rena',
        xp: 420, tier: 'Bronze', wins: 3, games: 10, score: 390, coins: 130,
        avatarKey: 'avatar4', ownedItems: [],
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
                achievements: [],
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
