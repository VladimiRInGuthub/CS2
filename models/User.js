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
      name: String,
      weapon: String,
      wear: { type: String, default: 'Field-Tested' },
      obtainedAt: { type: Date, default: Date.now },
      caseOpened: String,
      caseId: String
    }
  ],
  caseHistory: [
    {
      caseId: mongoose.Schema.Types.ObjectId,
      caseName: String,
      skinId: mongoose.Schema.Types.ObjectId,
      skinName: String,
      skinRarity: String,
      skinWeapon: String,
      openedAt: { type: Date, default: Date.now },
      cost: Number
    }
  ],
  stats: {
    totalCasesOpened: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalSkinsObtained: { type: Number, default: 0 },
    rarityBreakdown: {
      Common: { type: Number, default: 0 },
      Uncommon: { type: Number, default: 0 },
      Rare: { type: Number, default: 0 },
      Epic: { type: Number, default: 0 },
      Legendary: { type: Number, default: 0 }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
