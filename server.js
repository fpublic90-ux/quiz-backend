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
const { registerGameHandlers, startGame } = require('./sockets/gameHandler');
const MatchmakingManager = require('./managers/MatchmakingManager');

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
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Quiz Backend Running 🎯' });
});


// Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Listen for user identification to map socket
  socket.on('identify', (uid) => {
    if (uid) {
      userSockets.set(uid, socket.id);
      socket.uid = uid;
      console.log(`🆔 User identified: ${uid} -> ${socket.id}`);
    }
  });

  registerGameHandlers(io, socket, userSockets);

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
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
