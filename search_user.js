const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const search = process.argv[2] || 'jafar';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find({ email: new RegExp(search, 'i') });
    console.log(`Found ${users.length} users matching "${search}":`);
    users.forEach(u => console.log(`- ${u.email} (${u.displayName}) | Role: ${u.role}`));
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
