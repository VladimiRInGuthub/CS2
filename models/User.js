const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  steamId: { type: String, required: true, unique: true },
  username: String,
  coins: { type: Number, default: 1000 },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  inventory: [
    {
      skinId: String,
      rarity: String,
      name: String
      
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
