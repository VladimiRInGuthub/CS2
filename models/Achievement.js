const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
  icon: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['cases', 'servers', 'progression', 'social', 'special', 'seasonal'],
    default: 'cases'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  rewards: {
    xp: {
      type: Number,
      default: 0
    },
    xcoins: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      trim: true
    },
    badge: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  unlockCount: {
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
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ rarity: 1 });
AchievementSchema.index({ isActive: 1 });

// Middleware pour mettre à jour updatedAt
AchievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode statique pour vérifier les achievements d'un utilisateur
AchievementSchema.statics.checkUserAchievements = async function(userId) {
  try {
    const user = await mongoose.model('User').findById(userId)
      .select('achievements stats inventory caseHistory');
    
    if (!user) return [];

    const allAchievements = await this.find({ isActive: true });
    const userAchievementIds = user.achievements.map(a => a.id);
    const newAchievements = [];

    for (const achievement of allAchievements) {
      // Vérifier si l'utilisateur a déjà cet achievement
      if (userAchievementIds.includes(achievement.id)) continue;

      // Vérifier les conditions
      if (await this.checkAchievementConditions(achievement, user)) {
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  } catch (error) {
    console.error('Erreur vérification achievements:', error);
    return [];
  }
};

// Méthode statique pour vérifier les conditions d'un achievement
AchievementSchema.statics.checkAchievementConditions = async function(achievement, user) {
  const requirements = achievement.requirements;
  
  try {
    switch (achievement.id) {
      case 'first_case':
        return user.stats.totalCasesOpened >= 1;
      
      case 'case_master':
        return user.stats.totalCasesOpened >= 100;
      
      case 'case_legend':
        return user.stats.totalCasesOpened >= 1000;
      
      case 'skin_collector':
        return user.stats.totalSkinsObtained >= 50;
      
      case 'skin_hoarder':
        return user.stats.totalSkinsObtained >= 500;
      
      case 'level_10':
        return user.stats.level >= 10;
      
      case 'level_25':
        return user.stats.level >= 25;
      
      case 'level_50':
        return user.stats.level >= 50;
      
      case 'xp_master':
        return user.stats.xp >= 10000;
      
      case 'server_creator':
        const serverCount = await mongoose.model('Server').countDocuments({ owner: user._id });
        return serverCount >= 1;
      
      case 'server_master':
        const serverCountMaster = await mongoose.model('Server').countDocuments({ owner: user._id });
        return serverCountMaster >= 10;
      
      case 'daily_player':
        return user.stats.totalPlayTime >= 3600; // 1 heure
      
      case 'dedicated_player':
        return user.stats.totalPlayTime >= 86400; // 24 heures
      
      case 'spender':
        return user.stats.totalSpent >= 1000;
      
      case 'big_spender':
        return user.stats.totalSpent >= 10000;
      
      case 'lucky_one':
        // Vérifier si l'utilisateur a obtenu un skin légendaire
        const legendarySkins = user.inventory.filter(item => 
          item.skin && item.skin.rarity === 'Legendary'
        );
        return legendarySkins.length >= 1;
      
      case 'rarity_hunter':
        // Vérifier si l'utilisateur a des skins de toutes les raretés
        const rarityBreakdown = user.stats.rarityBreakdown;
        const hasAllRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].every(
          rarity => rarityBreakdown[rarity] > 0
        );
        return hasAllRarities;
      
      case 'streak_master':
        // Vérifier la série de connexions quotidiennes
        return user.dailyBonus && user.dailyBonus.streak >= 7;
      
      case 'achievement_hunter':
        return user.achievements.length >= 10;
      
      case 'completionist':
        return user.achievements.length >= 25;
      
      default:
        // Vérification générique basée sur les requirements
        if (requirements.type && requirements.value) {
          switch (requirements.type) {
            case 'cases_opened':
              return user.stats.totalCasesOpened >= requirements.value;
            case 'skins_obtained':
              return user.stats.totalSkinsObtained >= requirements.value;
            case 'level_reached':
              return user.stats.level >= requirements.value;
            case 'xp_earned':
              return user.stats.xp >= requirements.value;
            case 'time_played':
              return user.stats.totalPlayTime >= requirements.value;
            case 'money_spent':
              return user.stats.totalSpent >= requirements.value;
            default:
              return false;
          }
        }
        return false;
    }
  } catch (error) {
    console.error(`Erreur vérification achievement ${achievement.id}:`, error);
    return false;
  }
};

// Méthode statique pour créer les achievements par défaut
AchievementSchema.statics.createDefaultAchievements = async function() {
  const defaultAchievements = [
    {
      id: 'first_case',
      name: 'Première Case',
      description: 'Ouvrez votre première case',
      icon: '🎁',
      category: 'cases',
      rarity: 'common',
      requirements: { type: 'cases_opened', value: 1 },
      rewards: { xp: 100, xcoins: 50 }
    },
    {
      id: 'case_master',
      name: 'Maître des Cases',
      description: 'Ouvrez 100 cases',
      icon: '📦',
      category: 'cases',
      rarity: 'rare',
      requirements: { type: 'cases_opened', value: 100 },
      rewards: { xp: 1000, xcoins: 500 }
    },
    {
      id: 'case_legend',
      name: 'Légende des Cases',
      description: 'Ouvrez 1000 cases',
      icon: '👑',
      category: 'cases',
      rarity: 'legendary',
      requirements: { type: 'cases_opened', value: 1000 },
      rewards: { xp: 5000, xcoins: 2500, title: 'Case Legend' }
    },
    {
      id: 'skin_collector',
      name: 'Collectionneur',
      description: 'Obtenez 50 skins',
      icon: '✨',
      category: 'cases',
      rarity: 'uncommon',
      requirements: { type: 'skins_obtained', value: 50 },
      rewards: { xp: 500, xcoins: 250 }
    },
    {
      id: 'skin_hoarder',
      name: 'Accumulateur',
      description: 'Obtenez 500 skins',
      icon: '🏆',
      category: 'cases',
      rarity: 'epic',
      requirements: { type: 'skins_obtained', value: 500 },
      rewards: { xp: 2500, xcoins: 1000, title: 'Skin Hoarder' }
    },
    {
      id: 'level_10',
      name: 'Niveau 10',
      description: 'Atteignez le niveau 10',
      icon: '🔟',
      category: 'progression',
      rarity: 'common',
      requirements: { type: 'level_reached', value: 10 },
      rewards: { xp: 200, xcoins: 100 }
    },
    {
      id: 'level_25',
      name: 'Niveau 25',
      description: 'Atteignez le niveau 25',
      icon: '🎯',
      category: 'progression',
      rarity: 'uncommon',
      requirements: { type: 'level_reached', value: 25 },
      rewards: { xp: 500, xcoins: 250 }
    },
    {
      id: 'level_50',
      name: 'Niveau 50',
      description: 'Atteignez le niveau 50',
      icon: '🌟',
      category: 'progression',
      rarity: 'rare',
      requirements: { type: 'level_reached', value: 50 },
      rewards: { xp: 1000, xcoins: 500, title: 'Level Master' }
    },
    {
      id: 'server_creator',
      name: 'Créateur de Serveur',
      description: 'Créez votre premier serveur',
      icon: '🖥️',
      category: 'servers',
      rarity: 'common',
      requirements: { type: 'servers_created', value: 1 },
      rewards: { xp: 300, xcoins: 150 }
    },
    {
      id: 'daily_player',
      name: 'Joueur Quotidien',
      description: 'Jouez pendant 1 heure au total',
      icon: '⏰',
      category: 'progression',
      rarity: 'common',
      requirements: { type: 'time_played', value: 3600 },
      rewards: { xp: 200, xcoins: 100 }
    },
    {
      id: 'lucky_one',
      name: 'Chanceux',
      description: 'Obtenez un skin légendaire',
      icon: '🍀',
      category: 'special',
      rarity: 'epic',
      requirements: { type: 'legendary_skin', value: 1 },
      rewards: { xp: 1000, xcoins: 500, title: 'Lucky One' }
    },
    {
      id: 'streak_master',
      name: 'Maître de la Série',
      description: 'Connectez-vous 7 jours consécutifs',
      icon: '🔥',
      category: 'progression',
      rarity: 'rare',
      requirements: { type: 'daily_streak', value: 7 },
      rewards: { xp: 500, xcoins: 250 }
    }
  ];

  for (const achievementData of defaultAchievements) {
    const existingAchievement = await this.findOne({ id: achievementData.id });
    if (!existingAchievement) {
      await this.create(achievementData);
      console.log(`✅ Achievement créé: ${achievementData.name}`);
    }
  }
};

module.exports = mongoose.model('Achievement', AchievementSchema);
