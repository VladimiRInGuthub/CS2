const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  steamId: String,
  googleId: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Email invalide'
    }
  },
  password: {
    type: String,
    select: false,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  avatar: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  coins: { 
    type: Number, 
    default: 1000 
  },
  xcoins: { 
    type: Number, 
    default: 1000 
  },
  inventory: [
    {
      skin: { type: mongoose.Schema.Types.ObjectId, ref: 'Skin' },
      obtainedAt: { type: Date, default: Date.now },
      caseOpened: String,
      caseId: String,
      float: {
        type: Number,
        min: 0,
        max: 1
      },
      stickers: [{
        name: String,
        image: String,
        position: Number
      }],
      isFavorite: {
        type: Boolean,
        default: false
      }
    }
  ],
  equippedSkins: {
    type: Map,
    of: mongoose.Schema.Types.ObjectId,
    default: {}
  },
  loadouts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['competitive', 'casual', 'fun', 'custom'],
      default: 'custom'
    },
    skins: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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
    totalPlayTime: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    rarityBreakdown: {
      Common: { type: Number, default: 0 },
      Uncommon: { type: Number, default: 0 },
      Rare: { type: Number, default: 0 },
      Epic: { type: Number, default: 0 },
      Legendary: { type: Number, default: 0 }
    }
  },
  preferences: {
    language: {
      type: String,
      enum: ['fr', 'en'],
      default: 'fr'
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'auto'],
      default: 'dark'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      cases: { type: Boolean, default: true },
      servers: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    }
  },
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  dailyBonus: {
    lastClaimed: Date,
    streak: { type: Number, default: 0 },
    nextBonus: Date
  },
  isAdmin: { type: Boolean, default: false },
  adminPassword: { type: String, select: false },
  isBanned: { type: Boolean, default: false },
  banReason: String,
  banExpires: Date,
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les performances
UserSchema.index({ steamId: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ isAdmin: 1 });
UserSchema.index({ isBanned: 1 });

// Middleware pour mettre à jour updatedAt
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware pour hasher le mot de passe avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir le nom d'affichage
UserSchema.methods.getDisplayName = function() {
  return this.displayName || this.username;
};

// Méthode pour vérifier si l'utilisateur peut réclamer le bonus quotidien
UserSchema.methods.canClaimDailyBonus = function() {
  if (!this.dailyBonus.lastClaimed) return true;
  
  const now = new Date();
  const lastClaimed = new Date(this.dailyBonus.lastClaimed);
  const diffTime = now - lastClaimed;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 1;
};

// Méthode pour réclamer le bonus quotidien
UserSchema.methods.claimDailyBonus = function() {
  const bonusAmount = 50 + (this.dailyBonus.streak * 10); // Bonus croissant
  
  this.xcoins += bonusAmount;
  this.dailyBonus.lastClaimed = new Date();
  this.dailyBonus.streak += 1;
  
  return bonusAmount;
};

// Méthode pour ajouter de l'XP
UserSchema.methods.addXP = function(amount) {
  this.stats.xp += amount;
  
  // Calcul du niveau (formule simple)
  const newLevel = Math.floor(this.stats.xp / 1000) + 1;
  if (newLevel > this.stats.level) {
    this.stats.level = newLevel;
    return { leveledUp: true, newLevel };
  }
  
  return { leveledUp: false };
};

// Méthode pour obtenir les statistiques d'inventaire
UserSchema.methods.getInventoryStats = function() {
  const totalSkins = this.inventory.length;
  const favorites = this.inventory.filter(item => item.isFavorite).length;
  
  // Calculer la valeur totale estimée
  const totalValue = this.inventory.reduce((sum, item) => {
    return sum + (item.skin?.price || 0);
  }, 0);
  
  return {
    totalSkins,
    favorites,
    totalValue
  };
};

module.exports = mongoose.model('User', UserSchema);
