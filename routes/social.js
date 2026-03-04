const express = require('express');
const router = express.Router();
const User = require('../models/User');

module.exports = (io, userSockets) => {
    // POST /api/social/follow/:targetUid (Request to follow)
    router.post('/follow/:targetUid', async (req, res) => {
        try {
            const { uid } = req.body;
            const { targetUid } = req.params;

            if (!uid || !targetUid) return res.status(400).json({ message: 'UIDs are required' });
            if (uid === targetUid) return res.status(400).json({ message: 'Cannot follow yourself' });

            const user = await User.findOne({ uid });
            const target = await User.findOne({ uid: targetUid });

            if (!user || !target) return res.status(404).json({ message: 'User not found' });

            // Check if already following
            if (user.following.includes(targetUid)) {
                // Unfollow logic
                user.following = user.following.filter(id => id !== targetUid);
                target.followers = (target.followers || []).filter(id => id !== uid);
                await user.save();
                await target.save();

                // Notify target in real-time
                if (io && userSockets) {
                    const targetSocketId = userSockets.get(targetUid);
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('user_unfollowed', {
                            unfollowerUid: uid,
                            unfollowerName: user.displayName
                        });
                    }
                }

                return res.json({ status: 'unfollowed', following: user.following });
            }

            // Cancel pending follow request if already sent
            if (target.followRequests.includes(uid)) {
                target.followRequests = target.followRequests.filter(id => id !== uid);
                await target.save();
                return res.json({ status: 'cancelled' });
            }

            // Add to follow requests
            target.followRequests.push(uid);
            await target.save();

            // Notify target user via socket
            if (io && userSockets) {
                const targetSocketId = userSockets.get(targetUid);
                if (targetSocketId) {
                    io.to(targetSocketId).emit('follow_request', {
                        requesterName: user.displayName,
                        requesterUid: uid
                    });
                }
            }

            res.json({ status: 'requested' });

        } catch (err) {
            console.error('Follow Error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // POST /api/social/accept-follow/:sourceUid
    router.post('/accept-follow/:sourceUid', async (req, res) => {
        try {
            const { uid } = req.body; // The user accepting the request
            const { sourceUid } = req.params; // The user who sent the request

            const user = await User.findOne({ uid }); // Me
            const source = await User.findOne({ uid: sourceUid }); // Requester

            if (!user || !source) return res.status(404).json({ message: 'User not found' });

            // Remove from requests
            user.followRequests = user.followRequests.filter(id => id !== sourceUid);

            // Add to followers/following
            if (!user.followers.includes(sourceUid)) user.followers.push(sourceUid);
            if (!source.following.includes(uid)) source.following.push(uid);

            await user.save();
            await source.save();

            // Notify requester
            if (io && userSockets) {
                const sourceSocketId = userSockets.get(sourceUid);
                if (sourceSocketId) {
                    io.to(sourceSocketId).emit('follow_accepted', {
                        userName: user.displayName,
                        userUid: uid
                    });
                }
            }

            res.json({ status: 'accepted', followers: user.followers });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    // POST /api/social/decline-follow/:sourceUid
    router.post('/decline-follow/:sourceUid', async (req, res) => {
        try {
            const { uid } = req.body;
            const { sourceUid } = req.params;

            const user = await User.findOne({ uid });
            if (!user) return res.status(404).json({ message: 'User not found' });

            user.followRequests = user.followRequests.filter(id => id !== sourceUid);
            await user.save();

            res.json({ status: 'declined' });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    // GET /api/social/requests/:uid
    router.get('/requests/:uid', async (req, res) => {
        try {
            const user = await User.findOne({ uid: req.params.uid });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const requests = await User.find({
                uid: { $in: user.followRequests }
            }).select('uid displayName avatar level tier');

            res.json(requests);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    // GET /api/social/search?q=query
    router.get('/search', async (req, res) => {
        try {
            const { q } = req.query;
            if (!q) return res.json([]);

            const users = await User.find({
                displayName: { $regex: q, $options: 'i' }
            })
                .limit(10)
                .select('uid displayName avatar level tier ownedItems');

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
            }).select('uid displayName avatar level tier ownedItems');

            res.json(followingUsers);
        } catch (err) {
            console.error('Get Following Error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
