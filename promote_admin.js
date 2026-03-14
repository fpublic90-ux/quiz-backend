const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address: node promote_admin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`✅ User ${email} has been promoted to Admin.`);
      console.log(user);
    } else {
      console.error(`❌ User with email ${email} not found.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
