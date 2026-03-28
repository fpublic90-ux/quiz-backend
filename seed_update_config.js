const admin = require('firebase-admin');
const path = require('path');

// Try to load the service account
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function seedUpdateConfig() {
  console.log('⏳ Seeding Firestore config for secure_file_transfer...');
  
  try {
    const docRef = db.collection('config').doc('secure_file_transfer');
    
    await docRef.set({
      version: '1.1.0', // Set your desired version here
      force_update: false,
      update_message: 'Security hardening and performance improvements. Please update for the best experience.',
      downloads: {
        arm64_v8a: {
          github: 'ADD_YOUR_GITHUB_LINK_HERE',
          cloudinary: 'ADD_YOUR_CLOUDINARY_LINK_HERE'
        },
        armeabi_v7a: {
          github: 'ADD_YOUR_GITHUB_LINK_HERE',
          cloudinary: 'ADD_YOUR_CLOUDINARY_LINK_HERE'
        },
        x86_64: {
          github: 'ADD_YOUR_GITHUB_LINK_HERE',
          cloudinary: 'ADD_YOUR_CLOUDINARY_LINK_HERE'
        },
        universal: {
          github: 'ADD_YOUR_GITHUB_LINK_HERE',
          cloudinary: 'ADD_YOUR_CLOUDINARY_LINK_HERE'
        }
      }
    });
    
    console.log('✅ SUCCESSFULLY SEEDED: config/secure_file_transfer');
    console.log('🚀 You can now manually edit the links in Firebase Console.');
    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
}

seedUpdateConfig();
