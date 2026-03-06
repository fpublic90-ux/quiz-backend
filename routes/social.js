const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = (io, userSockets) => {
    // POST /api/social/friend-request/send/:targetUid
    router.post('/friend-request/send/:targetUid', verifyToken, async (req, res) => {
        try {
            const { uid } = req.body;
            const { targetUid } = req.params;

            if (!uid || !targetUid) return res.status(400).json({ message: 'UIDs are required' });
            if (uid === targetUid) return res.status(400).json({ message: 'Cannot friend yourself' });

            const user = await User.findOne({ uid });
            const target = await User.findOne({ uid: targetUid });

            if (!user || !target) return res.status(404).json({ message: 'User not found' });

            // Check if already friends
            if (user.friends.includes(targetUid)) {
                return res.status(400).json({ message: 'Already friends' });
            }

            // Check if request already sent
            if (user.sentFriendRequests.includes(targetUid)) {
                // Cancel request logic
                user.sentFriendRequests = user.sentFriendRequests.filter(id => id !== targetUid);
                target.receivedFriendRequests = target.receivedFriendRequests.filter(id => id !== uid);
                await user.save();
                await target.save();
                return res.json({ status: 'cancelled', sentRequests: user.sentFriendRequests });
            }

            // Check if they already sent me a request (Accept automatically or block?)
            if (user.receivedFriendRequests.includes(targetUid)) {
                return res.status(400).json({ message: 'They already sent you a friend request' });
            }

            // Send Request
            user.sentFriendRequests.push(targetUid);
            target.receivedFriendRequests.push(uid);

            await user.save();
            await target.save();

            // Notify target user via socket
            if (io && userSockets) {
                const targetSocketId = userSockets.get(targetUid);
                if (targetSocketId) {
                    io.to(targetSocketId).emit('new_friend_request', {
                        requesterName: user.displayName,
                        requesterUid: uid
                    });
                }
            }

            res.json({ status: 'requested', sentRequests: user.sentFriendRequests });

        } catch (err) {
            console.error('Friend Request Error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // POST /api/social/friend-request/accept/:sourceUid
    router.post('/friend-request/accept/:sourceUid', verifyToken, async (req, res) => {
        try {
            const { uid } = req.body; // Me
            const { sourceUid } = req.params; // Requester

            const user = await User.findOne({ uid });
            const source = await User.findOne({ uid: sourceUid });

            if (!user || !source) return res.status(404).json({ message: 'User not found' });

            // Ensure there was a request
            if (!user.receivedFriendRequests.includes(sourceUid)) {
                return res.status(400).json({ message: 'No pending request' });
            }

            // Move from requests to friends
            user.receivedFriendRequests = user.receivedFriendRequests.filter(id => id !== sourceUid);
            source.sentFriendRequests = source.sentFriendRequests.filter(id => id !== uid);

            if (!user.friends.includes(sourceUid)) user.friends.push(sourceUid);
            if (!source.friends.includes(uid)) source.friends.push(uid);

            await user.save();
            await source.save();

            // Notify requester
            if (io && userSockets) {
                const sourceSocketId = userSockets.get(sourceUid);
                if (sourceSocketId) {
                    io.to(sourceSocketId).emit('friend_request_accepted', {
                        userName: user.displayName,
                        userUid: uid
                    });
                }
            }

            res.json({ status: 'accepted', friends: user.friends });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    // POST /api/social/friend-request/decline/:sourceUid
    router.post('/friend-request/decline/:sourceUid', verifyToken, async (req, res) => {
        try {
            const { uid } = req.body;
            const { sourceUid } = req.params;

            const user = await User.findOne({ uid });
            const source = await User.findOne({ uid: sourceUid });
            if (!user || !source) return res.status(404).json({ message: 'User not found' });

            user.receivedFriendRequests = user.receivedFriendRequests.filter(id => id !== sourceUid);
            source.sentFriendRequests = source.sentFriendRequests.filter(id => id !== uid);

            await user.save();
            await source.save();

            res.json({ status: 'declined' });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    // POST /api/social/friend/remove/:targetUid
    router.post('/friend/remove/:targetUid', verifyToken, async (req, res) => {
        try {
            const { uid } = req.body;
            const { targetUid } = req.params;

            const user = await User.findOne({ uid });
            const target = await User.findOne({ uid: targetUid });

            if (!user || !target) return res.status(404).json({ message: 'User not found' });

            user.friends = user.friends.filter(id => id !== targetUid);
            target.friends = target.friends.filter(id => id !== uid);

            await user.save();
            await target.save();

            // Notify target
            if (io && userSockets) {
                const targetSocketId = userSockets.get(targetUid);
                if (targetSocketId) {
                    io.to(targetSocketId).emit('friend_removed', {
                        removedByUid: uid,
                        removedByName: user.displayName
                    });
                }
            }

            res.json({ status: 'removed', friends: user.friends });
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
                uid: { $in: user.receivedFriendRequests }
            }).select('uid displayName avatar level tier');

            res.json(requests);
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    // GET /api/social/friends/:uid
    router.get('/friends/:uid', async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findOne({ uid });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const friends = await User.find({
                uid: { $in: user.friends }
            }).select('uid displayName avatar level tier ownedItems');

            res.json(friends);
        } catch (err) {
            console.error('Get Friends Error:', err);
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

    return router;
};
