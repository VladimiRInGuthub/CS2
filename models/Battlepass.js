const mongoose = require('mongoose');

const BattlepassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  season: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  tiers: [{
    level: {
      type: Number,
      required: true,
      min: 1
    },
    xpRequired: {
      type: Number,
      required: true,
      min: 0
    },
    freeRewards: [{
      type: {
        type: String,
        enum: ['xcoins', 'case', 'skin', 'title', 'badge', 'premium_days'],
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'tiers.freeRewards.itemType'
      },
      itemType: {
        type: String,
        enum: ['Case', 'Skin', null]
      },
      name: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      image: {
        type: String,
        trim: true
      }
    }],
    premiumRewards: [{
      type: {
        type: String,
        enum: ['xcoins', 'case', 'skin', 'title', 'badge', 'premium_days'],
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'tiers.premiumRewards.itemType'
      },
      itemType: {
        type: String,
        enum: ['Case', 'Skin', null]
      },
      name: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      image: {
        type: String,
        trim: true
      }
    }]
  }],
  missions: [{
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'seasonal'],
      required: true
    },
    category: {
      type: String,
      enum: ['cases', 'servers', 'social', 'progression', 'special'],
      required: true
    },
    requirements: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0
    },
    xcoinsReward: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    }
  }],
  stats: {
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageLevel: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les performances
BattlepassSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
BattlepassSchema.index({ season: 1 });
BattlepassSchema.index({ 'tiers.level': 1 });

// Middleware pour mettre à jour updatedAt
BattlepassSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode statique pour obtenir le battlepass actif
BattlepassSchema.statics.getActiveBattlepass = function() {
  const now = new Date();
  return this.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate('tiers.freeRewards.itemId tiers.premiumRewards.itemId');
};

// Méthode statique pour obtenir les missions actives
BattlepassSchema.statics.getActiveMissions = function() {
  const now = new Date();
  return this.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$missions' },
    { $match: { 
      'missions.isActive': true,
      'missions.startDate': { $lte: now },
      $or: [
        { 'missions.endDate': { $exists: false } },
        { 'missions.endDate': { $gte: now } }
      ]
    }},
    { $project: { mission: '$missions' } }
  ]);
};

// Méthode pour calculer le niveau d'un utilisateur
BattlepassSchema.methods.calculateUserLevel = function(userXp) {
  let level = 0;
  for (const tier of this.tiers) {
    if (userXp >= tier.xpRequired) {
      level = tier.level;
    } else {
      break;
    }
  }
  return level;
};

// Méthode pour obtenir les récompenses d'un niveau
BattlepassSchema.methods.getTierRewards = function(level, isPremium = false) {
  const tier = this.tiers.find(t => t.level === level);
  if (!tier) return { free: [], premium: [] };
  
  return {
    free: tier.freeRewards || [],
    premium: isPremium ? (tier.premiumRewards || []) : []
  };
};

// Méthode pour vérifier si le battlepass est actif
BattlepassSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && this.startDate <= now && this.endDate >= now;
};

// Méthode pour obtenir le temps restant
BattlepassSchema.methods.getTimeRemaining = function() {
  if (!this.isCurrentlyActive()) return null;
  
  const now = new Date();
  const timeLeft = this.endDate - now;
  
  return {
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  };
};

module.exports = mongoose.model('Battlepass', BattlepassSchema);
