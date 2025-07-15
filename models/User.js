const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  steamId: String,
  googleId: String,
  username: String,
  avatar: String,
  coins: { type: Number, default: 1000 },
  inventory: [
    {
      skinId: String,
      rarity: String,
      name: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
