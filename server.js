require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/users');
const leaderboardRoutes = require('./routes/leaderboard');
const dailyRoutes = require('./routes/daily');
const socialRoutes = require('./routes/social');
const gameRoutes = require('./routes/game');
const studentRoutes = require('./routes/student');
const notificationRoutes = require('./routes/notifications');
const { registerGameHandlers, startGame } = require('./sockets/gameHandler');
const MatchmakingManager = require('./managers/MatchmakingManager');
const admin = require('firebase-admin');

// Initialize Firebase Admin (Uses GOOGLE_APPLICATION_CREDENTIALS or default config)
try {
  // Initialize Firebase Admin
  // If FIREBASE_PROJECT_ID is provided, use it to ensure project detection
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  console.log('✅ Firebase Admin initialized');
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

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/social', socialRoutes(io, userSockets));
app.use('/api/game', gameRoutes(io, userSockets));
app.use('/api/student', studentRoutes);
app.use('/api/notifications', notificationRoutes);

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

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    socketRateLimiter.cleanup(socket.id);
    if (socket.uid) {
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
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
