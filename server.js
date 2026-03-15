require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const User = require('./models/User');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');
const dailyRoutes = require('./routes/daily');
const socialRoutes = require('./routes/social');
const gameRoutes = require('./routes/game');
const studentRoutes = require('./routes/student');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const { registerGameHandlers, startGame } = require('./sockets/gameHandler');
const MatchmakingManager = require('./managers/MatchmakingManager');
const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines in private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized with Service Account');
  } else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialized (Default)');
  }
} catch (e) {
  console.error('❌ Firebase Admin initialization failed:', e.message);
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

MatchmakingManager.init(io, startGame);

// In-memory mapping of UID to socket ID for invitations
const userSockets = new Map(); // Map<uid, socketId>

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/social', socialRoutes(io, userSockets));
app.use('/api/game', gameRoutes(io, userSockets));
app.use('/api/student', studentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Quiz Backend Running 🎯' });
});


const socketRateLimiter = require('./utils/socketRateLimiter');

// Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Rate Limiting Middleware for this socket
  socket.use(([event, ...args], next) => {
    if (socketRateLimiter.isRateLimited(socket.id)) {
      return next(new Error('Rate limit exceeded. Slow down!'));
    }
    next();
  });

  // Listen for user identification to map socket (Secured with Token)
  socket.on('identify', async (token) => {
    if (!token) return;
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;
      userSockets.set(uid, socket.id);
      socket.uid = uid;
      console.log(`🆔 User verified & identified: ${uid} -> ${socket.id}`);
    } catch (error) {
      console.error('❌ Socket identification failed:', error.message);
      socket.emit('error', { message: 'Authentication failed' });
    }
  });

  registerGameHandlers(io, socket, userSockets);

  socket.on('disconnect', async () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    socketRateLimiter.cleanup(socket.id);
    if (socket.uid) {
      // 🪙 Matchmaking Refund: Check if they were in queue
      const removed = MatchmakingManager.removeFromQueue(socket.uid);
      if (removed) {
        try {
          const user = await User.findOne({ uid: socket.uid });
          if (user) {
            user.coins += 50; 
            await user.save();
            console.log(`🪙 Refund: 50 coins returned to User ${socket.uid} on disconnect. Balance: ${user.coins}`);
          }
        } catch (err) {
          console.error('❌ Error refunding match fee on disconnect:', err);
        }
      }
      userSockets.delete(socket.uid);
    }
  });
});

// MongoDB
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
