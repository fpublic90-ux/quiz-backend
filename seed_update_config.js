const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedUpdate() {
  const updateData = {
    "version": "1.2.0",
    "force_update": false,
    "update_message": "New features: Split APK support, faster matchmaking, and premium UI updates!",
    "downloads": {
      "armeabi_v7a": {
        "github": "https://github.com/fpublic90-ux/quizeapp/releases/download/v1.2.0/app-armeabi-v7a-release.apk",
        "cloudinary": "https://res.cloudinary.com/example/raw/upload/app-armeabi-v7a.apk"
      },
      "arm64_v8a": {
        "github": "https://github.com/fpublic90-ux/quizeapp/releases/download/v1.2.0/app-arm64-v8a-release.apk",
        "cloudinary": "https://res.cloudinary.com/example/raw/upload/app-arm64-v8a.apk"
      },
      "x86": {
        "github": "https://github.com/fpublic90-ux/quizeapp/releases/download/v1.2.0/app-x86_64-release.apk",
        "cloudinary": "https://res.cloudinary.com/example/raw/upload/app-x86_64-release.apk"
      },
      "universal": {
        "github": "https://github.com/fpublic90-ux/quizeapp/releases/download/v1.2.0/app-arm64-v8a-release.apk",
        "cloudinary": "https://res.cloudinary.com/example/raw/upload/app-universal.apk"
      }
    }
  };

  await db.collection('config').doc('update').set(updateData);
  console.log('Update configuration seeded successfully! 🚀');
  process.exit();
}

seedUpdate().catch(console.error);
