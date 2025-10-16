const mongoose = require('mongoose');

const UserBattlepassSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  battlepassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battlepass',
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  purchasedAt: {
    type: Date
  },
  currentLevel: {
    type: Number,
    default: 0,
    min: 0
  },
  currentXp: {
    type: Number,
    default: 0,
    min: 0
  },
  totalXp: {
    type: Number,
    default: 0,
    min: 0
  },
  claimedRewards: [{
    tier: {
      type: Number,
      required: true
    },
    isPremium: {
      type: Boolean,
      required: true
    },
    claimedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedMissions: [{
    missionId: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    }
  }],
  missionProgress: [{
    missionId: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 0
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    totalMissionsCompleted: {
      type: Number,
      default: 0
    },
    dailyMissionsCompleted: {
      type: Number,
      default: 0
    },
    weeklyMissionsCompleted: {
      type: Number,
      default: 0
    },
    seasonalMissionsCompleted: {
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
UserBattlepassSchema.index({ userId: 1, battlepassId: 1 }, { unique: true });
UserBattlepassSchema.index({ battlepassId: 1 });
UserBattlepassSchema.index({ currentLevel: -1 });

// Middleware pour mettre à jour updatedAt
UserBattlepassSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour ajouter de l'XP
UserBattlepassSchema.methods.addXp = function(amount) {
  this.currentXp += amount;
  this.totalXp += amount;
  
  // Calculer le nouveau niveau
  const battlepass = this.battlepassId;
  if (battlepass && battlepass.tiers) {
    let newLevel = 0;
    for (const tier of battlepass.tiers) {
      if (this.currentXp >= tier.xpRequired) {
        newLevel = tier.level;
      } else {
        break;
      }
    }
    this.currentLevel = newLevel;
  }
  
  return this.currentLevel;
};

// Méthode pour vérifier si une récompense peut être réclamée
UserBattlepassSchema.methods.canClaimReward = function(tier, isPremium = false) {
  // Vérifier si l'utilisateur a le niveau requis
  if (this.currentLevel < tier) {
    return false;
  }
  
  // Vérifier si c'est une récompense premium et si l'utilisateur a le battlepass premium
  if (isPremium && !this.isPremium) {
    return false;
  }
  
  // Vérifier si la récompense n'a pas déjà été réclamée
  const alreadyClaimed = this.claimedRewards.some(
    reward => reward.tier === tier && reward.isPremium === isPremium
  );
  
  return !alreadyClaimed;
};

// Méthode pour réclamer une récompense
UserBattlepassSchema.methods.claimReward = function(tier, isPremium = false) {
  if (!this.canClaimReward(tier, isPremium)) {
    return false;
  }
  
  this.claimedRewards.push({
    tier,
    isPremium,
    claimedAt: new Date()
  });
  
  return true;
};

// Méthode pour mettre à jour la progression d'une mission
UserBattlepassSchema.methods.updateMissionProgress = function(missionId, progress) {
  const missionProgress = this.missionProgress.find(mp => mp.missionId === missionId);
  
  if (missionProgress) {
    missionProgress.progress = progress;
    missionProgress.lastUpdated = new Date();
    missionProgress.isCompleted = progress >= 100;
  } else {
    this.missionProgress.push({
      missionId,
      progress,
      isCompleted: progress >= 100,
      lastUpdated: new Date()
    });
  }
  
  return this.missionProgress.find(mp => mp.missionId === missionId);
};

// Méthode pour compléter une mission
UserBattlepassSchema.methods.completeMission = function(missionId, xpReward) {
  // Vérifier si la mission n'a pas déjà été complétée
  const alreadyCompleted = this.completedMissions.some(
    mission => mission.missionId === missionId
  );
  
  if (alreadyCompleted) {
    return false;
  }
  
  // Ajouter la mission aux missions complétées
  this.completedMissions.push({
    missionId,
    completedAt: new Date(),
    progress: 100
  });
  
  // Mettre à jour les statistiques
  this.stats.totalMissionsCompleted += 1;
  
  // Ajouter l'XP de la mission
  if (xpReward > 0) {
    this.addXp(xpReward);
  }
  
  return true;
};

// Méthode pour obtenir les récompenses non réclamées
UserBattlepassSchema.methods.getUnclaimedRewards = function() {
  const unclaimedRewards = [];
  
  if (this.battlepassId && this.battlepassId.tiers) {
    for (const tier of this.battlepassId.tiers) {
      if (tier.level <= this.currentLevel) {
        // Vérifier les récompenses gratuites
        if (tier.freeRewards && tier.freeRewards.length > 0) {
          const canClaimFree = this.canClaimReward(tier.level, false);
          if (canClaimFree) {
            unclaimedRewards.push({
              tier: tier.level,
              isPremium: false,
              rewards: tier.freeRewards
            });
          }
        }
        
        // Vérifier les récompenses premium
        if (this.isPremium && tier.premiumRewards && tier.premiumRewards.length > 0) {
          const canClaimPremium = this.canClaimReward(tier.level, true);
          if (canClaimPremium) {
            unclaimedRewards.push({
              tier: tier.level,
              isPremium: true,
              rewards: tier.premiumRewards
            });
          }
        }
      }
    }
  }
  
  return unclaimedRewards;
};

// Méthode statique pour obtenir la progression d'un utilisateur
UserBattlepassSchema.statics.getUserProgress = function(userId, battlepassId) {
  return this.findOne({ userId, battlepassId })
    .populate('battlepassId')
    .populate('battlepassId.tiers.freeRewards.itemId')
    .populate('battlepassId.tiers.premiumRewards.itemId');
};

// Méthode statique pour obtenir les utilisateurs avec le plus haut niveau
UserBattlepassSchema.statics.getTopPlayers = function(battlepassId, limit = 10) {
  return this.find({ battlepassId })
    .populate('userId', 'username avatar')
    .sort({ currentLevel: -1, currentXp: -1 })
    .limit(limit);
};

module.exports = mongoose.model('UserBattlepass', UserBattlepassSchema);
