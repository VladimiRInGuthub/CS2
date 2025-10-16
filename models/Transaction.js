const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'case_opening', 'bonus', 'refund', 'transfer', 'admin_adjustment'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['xcoins', 'euros', 'usd'],
    default: 'xcoins'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'internal', 'bonus', 'admin'],
    default: 'internal'
  },
  paymentId: {
    type: String,
    trim: true
  },
  stripeSessionId: {
    type: String,
    trim: true
  },
  stripePaymentIntentId: {
    type: String,
    trim: true
  },
  relatedCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  relatedSkin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skin'
  },
  relatedServer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  processedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundReason: {
    type: String,
    trim: true
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
TransactionSchema.index({ user: 1, createdAt: -1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ paymentId: 1 });
TransactionSchema.index({ stripeSessionId: 1 });
TransactionSchema.index({ stripePaymentIntentId: 1 });

// Middleware pour mettre à jour updatedAt
TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour marquer comme terminé
TransactionSchema.methods.complete = function() {
  this.status = 'completed';
  this.processedAt = new Date();
};

// Méthode pour marquer comme échoué
TransactionSchema.methods.fail = function(reason) {
  this.status = 'failed';
  this.metadata.set('failure_reason', reason);
};

// Méthode pour rembourser
TransactionSchema.methods.refund = function(reason) {
  this.status = 'refunded';
  this.refundedAt = new Date();
  this.refundReason = reason;
};

// Méthode statique pour obtenir le total des dépenses d'un utilisateur
TransactionSchema.statics.getUserTotalSpent = async function(userId, currency = 'xcoins') {
  const result = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        currency: currency,
        status: 'completed',
        type: { $in: ['purchase', 'case_opening'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Méthode statique pour obtenir l'historique des transactions d'un utilisateur
TransactionSchema.statics.getUserHistory = async function(userId, limit = 50, skip = 0) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('relatedCase', 'name image')
    .populate('relatedSkin', 'name image weapon')
    .populate('relatedServer', 'name gameMode');
};

module.exports = mongoose.model('Transaction', TransactionSchema);
