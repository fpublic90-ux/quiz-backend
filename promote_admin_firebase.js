const mongoose = require('mongoose');
const admin = require('firebase-admin');
require('dotenv').config();
const User = require('./models/User');

// Initialize Firebase Admin (Needs serviceAccountKey.json.json)
try {
  const serviceAccount = require('./serviceAccountKey.json.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Firebase Admin Initialization Error. Missing or invalid serviceAccountKey.json.json");
  console.error(error.message);
  process.exit(1);
}

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: node promote_admin_firebase.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      // 1. Get user from Firebase Auth
      let firebaseUser;
      try {
        firebaseUser = await admin.auth().getUserByEmail(email);
        console.log(`Found user in Firebase Auth: UID = ${firebaseUser.uid}`);
      } catch (fbErr) {
        if (fbErr.code === 'auth/user-not-found') {
          console.error(`❌ User with email ${email} not found in Firebase Auth.`);
          console.error('User must sign up via the app (Firebase) first before they can be added to MongoDB.');
          process.exit(1);
        } else {
          throw fbErr;
        }
      }

      // 2. Upsert in MongoDB
      const user = await User.findOneAndUpdate(
        { uid: firebaseUser.uid }, // Find by the exact Firebase UID
        {
          $set: {
            email: email,
            role: 'admin',
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || email.split('@')[0],
            avatar: firebaseUser.photoURL || 'default'
          }
        },
        { new: true, upsert: true } // Upsert will create it if not found
      );

      console.log(`✅ User ${email} has been promoted to Admin in MongoDB.`);
      console.log(`UID: ${user.uid}, Role: ${user.role}, DisplayName: ${user.displayName}`);
      process.exit(0);

    } catch (err) {
      console.error('❌ Error during promotion:', err.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
