# Quiz Backend — Render Deployment Instructions

## Pre-requisites
- MongoDB Atlas free cluster (or any MongoDB URI)
- GitHub account
- Render account (render.com)

---

## Step 1 — Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster
2. Create a database user (username + password)
3. Whitelist all IPs: `0.0.0.0/0` (Network Access)
4. Copy your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/quizdb?retryWrites=true&w=majority
   ```

---

## Step 2 — Seed the Database

Before deploying, seed your questions locally:

```bash
# Clone & install
cd quiz-backend
npm install

# Create .env from template
cp .env.example .env
# Edit .env and fill in your MONGODB_URI

# Run seed
npm run seed
```

---

## Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial quiz backend"
git remote add origin https://github.com/YOUR_USERNAME/quiz-backend.git
git push -u origin main
```

---

## Step 4 — Deploy on Render

1. Log in to [Render](https://render.com)
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   | Setting | Value |
   |---|---|
   | Environment | **Node** |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
5. Add Environment Variables:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your Atlas URI |
   | `PORT` | `3000` |
6. Click **Create Web Service**

---

## Step 5 — Note Your Backend URL

After deploy succeeds, your backend will be at:
```
https://quiz-backend-XXXX.onrender.com
```

Update the Flutter app's `socket_service.dart`:
```dart
static const String _baseUrl = 'https://quiz-backend-XXXX.onrender.com';
```

---

## Socket Events Reference

| Event | Direction | Payload |
|---|---|---|
| `create_room` | C→S | `{ playerName }` |
| `room_created` | S→C | `{ code, players }` |
| `join_room` | C→S | `{ roomCode, playerName }` |
| `room_joined` | S→C | `{ code, players }` |
| `player_joined` | S→C (broadcast) | `{ players }` |
| `start_game` | S→C | `{ totalQuestions, players }` |
| `new_question` | S→C | `{ id, question, options, questionNumber, totalQuestions }` |
| `timer_tick` | S→C | `{ remaining }` |
| `submit_answer` | C→S | `{ roomCode, questionId, answerIndex }` |
| `answer_result` | S→C | `{ isCorrect, correctIndex, correctAnswer }` |
| `update_score` | S→C (broadcast) | `{ players }` |
| `time_up` | S→C | `{ correctIndex, correctAnswer }` |
| `game_over` | S→C | `{ leaderboard, winner }` |
| `player_left` | S→C | `{ playerName, players }` |
| `error` | S→C | `{ message }` |
