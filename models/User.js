const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  steamId: String,
  googleId: String,
  username: String,
  avatar: String,
  coins: { type: Number, default: 1000 },
  inventory: [
    {
      skin: { type: mongoose.Schema.Types.ObjectId, ref: 'Skin' },
      obtainedAt: { type: Date, default: Date.now },
      caseOpened: String,
      caseId: String
    }
  ],
  equippedSkins: {
    type: Map,
    of: mongoose.Schema.Types.ObjectId,
    default: {}
  },
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
  isAdmin: { type: Boolean, default: false },
  adminPassword: { type: String, select: false }, // Mot de passe admin (hashé)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
