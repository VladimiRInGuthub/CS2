const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 150
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  category: {
    type: String,
    enum: ['starter', 'premium', 'legendary', 'knife', 'gloves', 'special'],
    default: 'starter'
  },
  items: [{
    skinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skin',
      required: true
    },
    dropRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    rarity: {
      type: String,
      enum: ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 'Restricted', 'Classified', 'Covert', 'Contraband'],
      required: true
    }
  }],
  dropRates: {
    'Consumer Grade': {
      type: Number,
      default: 79.92,
      min: 0,
      max: 100
    },
    'Industrial Grade': {
      type: Number,
      default: 15.98,
      min: 0,
      max: 100
    },
    'Mil-Spec Grade': {
      type: Number,
      default: 3.2,
      min: 0,
      max: 100
    },
    'Restricted': {
      type: Number,
      default: 0.64,
      min: 0,
      max: 100
    },
    'Classified': {
      type: Number,
      default: 0.16,
      min: 0,
      max: 100
    },
    'Covert': {
      type: Number,
      default: 0.06,
      min: 0,
      max: 100
    },
    'Contraband': {
      type: Number,
      default: 0.02,
      min: 0,
      max: 100
    }
  },
  totalItems: {
    type: Number,
    default: 0
  },
  featuredItems: [{
    skinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skin'
    },
    isSpecial: {
      type: Boolean,
      default: false
    }
  }],
  stats: {
    totalOpened: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageValue: {
      type: Number,
      default: 0
    },
    lastOpened: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
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
CaseSchema.index({ isActive: 1, category: 1 });
CaseSchema.index({ rarity: 1 });
CaseSchema.index({ isFeatured: 1 });
CaseSchema.index({ sortOrder: 1 });

// Middleware pour mettre à jour updatedAt
CaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour calculer les probabilités de drop
CaseSchema.methods.calculateDropRates = function() {
  const totalItems = this.items.length;
  if (totalItems === 0) return {};

  const rarityCounts = {};
  this.items.forEach(item => {
    if (!rarityCounts[item.rarity]) {
      rarityCounts[item.rarity] = 0;
    }
    rarityCounts[item.rarity]++;
  });

  const dropRates = {};
  Object.keys(rarityCounts).forEach(rarity => {
    dropRates[rarity] = (rarityCounts[rarity] / totalItems) * 100;
  });

  return dropRates;
};

// Méthode pour obtenir un skin aléatoire selon les probabilités
CaseSchema.methods.getRandomSkin = function() {
  if (this.items.length === 0) return null;

  // Calculer les poids cumulatifs
  const weights = this.items.map(item => item.dropRate);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  // Générer un nombre aléatoire
  let random = Math.random() * totalWeight;
  
  // Trouver l'élément correspondant
  for (let i = 0; i < this.items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return this.items[i];
    }
  }
  
  // Fallback (ne devrait jamais arriver)
  return this.items[0];
};

// Méthode pour obtenir les statistiques de la case
CaseSchema.methods.getStats = function() {
  return {
    totalOpened: this.stats.totalOpened,
    totalRevenue: this.stats.totalRevenue,
    averageValue: this.stats.averageValue,
    lastOpened: this.stats.lastOpened,
    totalItems: this.totalItems,
    dropRates: this.dropRates
  };
};

// Méthode statique pour obtenir les cases actives
CaseSchema.statics.getActiveCases = function() {
  return this.find({ isActive: true })
    .sort({ sortOrder: 1, isFeatured: -1, createdAt: -1 })
    .populate('items.skinId', 'name weapon rarity image price')
    .populate('featuredItems.skinId', 'name weapon rarity image price');
};

// Méthode statique pour obtenir les cases par catégorie
CaseSchema.statics.getCasesByCategory = function(category) {
  return this.find({ isActive: true, category: category })
    .sort({ sortOrder: 1, isFeatured: -1 })
    .populate('items.skinId', 'name weapon rarity image price')
    .populate('featuredItems.skinId', 'name weapon rarity image price');
};

module.exports = mongoose.model('Case', CaseSchema); 