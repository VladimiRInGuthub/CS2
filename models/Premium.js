const mongoose = require('mongoose');

const PremiumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'manual'],
    required: true
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'GBP']
  },
  benefits: {
    xcoinsBonus: {
      type: Number,
      default: 0
    },
    caseDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    exclusiveCases: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    adFree: {
      type: Boolean,
      default: true
    },
    customAvatar: {
      type: Boolean,
      default: false
    },
    battlepassAccess: {
      type: Boolean,
      default: true
    },
    serverPriority: {
      type: Boolean,
      default: false
    }
  },
  usage: {
    xcoinsEarned: {
      type: Number,
      default: 0
    },
    casesOpened: {
      type: Number,
      default: 0
    },
    serversCreated: {
      type: Number,
      default: 0
    },
    supportTickets: {
      type: Number,
      default: 0
    }
  },
  history: [{
    action: {
      type: String,
      enum: ['activated', 'renewed', 'cancelled', 'expired', 'upgraded', 'downgraded'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
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
PremiumSchema.index({ isActive: 1, endDate: 1 });
PremiumSchema.index({ stripeSubscriptionId: 1 });
PremiumSchema.index({ stripeCustomerId: 1 });

// Middleware pour mettre à jour updatedAt
PremiumSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour vérifier si le premium est actif
PremiumSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && this.endDate > now;
};

// Méthode pour obtenir le temps restant
PremiumSchema.methods.getTimeRemaining = function() {
  if (!this.isCurrentlyActive()) return null;
  
  const now = new Date();
  const timeLeft = this.endDate - now;
  
  return {
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  };
};

// Méthode pour activer le premium
PremiumSchema.methods.activate = function(plan, duration, paymentMethod, price, currency = 'EUR') {
  const now = new Date();
  let endDate;
  
  switch (plan) {
    case 'monthly':
      endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      break;
    case 'yearly':
      endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      break;
    case 'lifetime':
      endDate = new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 ans
      break;
    default:
      throw new Error('Plan invalide');
  }
  
  this.isActive = true;
  this.plan = plan;
  this.startDate = now;
  this.endDate = endDate;
  this.paymentMethod = paymentMethod;
  this.price = price;
  this.currency = currency;
  
  // Ajouter à l'historique
  this.history.push({
    action: 'activated',
    date: now,
    details: { plan, price, currency }
  });
  
  return this;
};

// Méthode pour renouveler le premium
PremiumSchema.methods.renew = function() {
  if (!this.isActive) {
    throw new Error('Premium non actif');
  }
  
  const now = new Date();
  let extension;
  
  switch (this.plan) {
    case 'monthly':
      extension = 30 * 24 * 60 * 60 * 1000;
      break;
    case 'yearly':
      extension = 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      extension = 0;
  }
  
  if (extension > 0) {
    this.endDate = new Date(this.endDate.getTime() + extension);
    
    // Ajouter à l'historique
    this.history.push({
      action: 'renewed',
      date: now,
      details: { plan: this.plan }
    });
  }
  
  return this;
};

// Méthode pour annuler le premium
PremiumSchema.methods.cancel = function() {
  this.autoRenew = false;
  
  // Ajouter à l'historique
  this.history.push({
    action: 'cancelled',
    date: new Date(),
    details: { autoRenew: false }
  });
  
  return this;
};

// Méthode pour expirer le premium
PremiumSchema.methods.expire = function() {
  this.isActive = false;
  
  // Ajouter à l'historique
  this.history.push({
    action: 'expired',
    date: new Date(),
    details: { endDate: this.endDate }
  });
  
  return this;
};

// Méthode pour obtenir les bénéfices actifs
PremiumSchema.methods.getActiveBenefits = function() {
  if (!this.isCurrentlyActive()) {
    return {};
  }
  
  return this.benefits;
};

// Méthode statique pour obtenir les utilisateurs premium actifs
PremiumSchema.statics.getActiveUsers = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    endDate: { $gt: now }
  }).populate('userId', 'username avatar email');
};

// Méthode statique pour obtenir les statistiques premium
PremiumSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalSubscriptions: { $sum: 1 },
        activeSubscriptions: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$isActive', true] }, { $gt: ['$endDate', new Date()] }] },
              1,
              0
            ]
          }
        },
        totalRevenue: { $sum: '$price' },
        monthlySubscriptions: {
          $sum: {
            $cond: [{ $eq: ['$plan', 'monthly'] }, 1, 0]
          }
        },
        yearlySubscriptions: {
          $sum: {
            $cond: [{ $eq: ['$plan', 'yearly'] }, 1, 0]
          }
        },
        lifetimeSubscriptions: {
          $sum: {
            $cond: [{ $eq: ['$plan', 'lifetime'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Méthode statique pour nettoyer les abonnements expirés
PremiumSchema.statics.cleanupExpired = function() {
  const now = new Date();
  return this.updateMany(
    {
      isActive: true,
      endDate: { $lte: now }
    },
    {
      $set: { isActive: false },
      $push: {
        history: {
          action: 'expired',
          date: now,
          details: { autoExpired: true }
        }
      }
    }
  );
};

module.exports = mongoose.model('Premium', PremiumSchema);
