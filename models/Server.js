const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerUsername: {
    type: String,
    required: true
  },
  gameMode: {
    type: String,
    enum: ['deathmatch', 'retake', 'surf', 'bhop', 'duel', 'aim', 'kz', 'competitive', 'casual'],
    required: true
  },
  map: {
    type: String,
    required: true,
    trim: true
  },
  maxPlayers: {
    type: Number,
    required: true,
    min: 2,
    max: 32
  },
  currentPlayers: {
    type: Number,
    default: 0,
    min: 0
  },
  rounds: {
    type: Number,
    default: 30,
    min: 1,
    max: 100
  },
  duration: {
    type: Number,
    default: 30,
    min: 5,
    max: 120
  },
  allowedWeapons: {
    type: [String],
    default: ['all']
  },
  bots: {
    type: Number,
    default: 0,
    min: 0,
    max: 16
  },
  password: {
    type: String,
    trim: true,
    maxlength: 50
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  region: {
    type: String,
    enum: ['Europe', 'North America', 'Asia', 'South America', 'Oceania'],
    default: 'Europe'
  },
  ip: {
    type: String,
    trim: true
  },
  port: {
    type: Number,
    min: 1024,
    max: 65535
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'starting', 'stopping'],
    default: 'offline'
  },
  ping: {
    type: Number,
    default: 0
  },
  skinchangerEnabled: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalConnections: {
      type: Number,
      default: 0
    },
    totalPlayTime: {
      type: Number,
      default: 0
    },
    averagePlayers: {
      type: Number,
      default: 0
    }
  }
});

// Index pour les performances
ServerSchema.index({ status: 1, gameMode: 1 });
ServerSchema.index({ owner: 1 });
ServerSchema.index({ isOfficial: 1 });
ServerSchema.index({ lastActivity: 1 });

// Middleware pour mettre à jour updatedAt
ServerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour vérifier si le serveur est actif
ServerSchema.methods.isActive = function() {
  const now = Date.now();
  const lastActivity = this.lastActivity.getTime();
  const timeout = 30 * 60 * 1000; // 30 minutes
  return (now - lastActivity) < timeout;
};

// Méthode pour obtenir le statut de connexion
ServerSchema.methods.getConnectionString = function() {
  if (this.ip && this.port) {
    return `${this.ip}:${this.port}`;
  }
  return `steam://connect/${this._id}.skincase.gg`;
};

module.exports = mongoose.model('Server', ServerSchema);
