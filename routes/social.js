const express = require('express');
const router = express.Router();
const User = require('../models/User');

module.exports = (io, userSockets) => {
    // POST /api/social/follow/:targetUid
    router.post('/follow/:targetUid', async (req, res) => {
        try {
            const { uid } = req.body;
            const { targetUid } = req.params;

            if (!uid || !targetUid) return res.status(400).json({ message: 'UIDs are required' });
            if (uid === targetUid) return res.status(400).json({ message: 'Cannot follow yourself' });

            const user = await User.findOne({ uid });
            const target = await User.findOne({ uid: targetUid });

            if (!user || !target) return res.status(404).json({ message: 'User not found' });

            const isFollowing = user.following.includes(targetUid);
            if (isFollowing) {
                // Unfollow
                user.following = user.following.filter(id => id !== targetUid);
            } else {
                // Follow
                user.following.push(targetUid);

                // Notify target user via socket
                if (io && userSockets) {
                    const targetSocketId = userSockets.get(targetUid);
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('new_follower', {
                            followerName: user.displayName,
                            followerUid: uid
                        });
                    }
                }
            }

            await user.save();
            res.json({ following: user.following, isFollowing: !isFollowing });

        } catch (err) {
            console.error('Follow Error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // ... rest of the routes ...
    return router;
};

// GET /api/social/search?q=query
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const users = await User.find({
            displayName: { $regex: q, $options: 'i' }
        })
            .limit(10)
            .select('uid displayName avatar level tier');

        res.json(users);
    } catch (err) {
        console.error('Search Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/social/following/:uid
router.get('/following/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const followingUsers = await User.find({
            uid: { $in: user.following }
        }).select('uid displayName avatar level tier');

        res.json(followingUsers);
    } catch (err) {
        console.error('Get Following Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
