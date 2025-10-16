const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { ensureAuthenticated } = require('../middleware/auth');

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, rarity, unlocked } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (rarity) {
      query.rarity = rarity;
    }

    const achievements = await Achievement.find(query)
      .sort({ rarity: 1, createdAt: 1 })
      .lean();

    // Si l'utilisateur est connecté, marquer les achievements débloqués
    if (req.user && unlocked === 'true') {
      const user = await User.findById(req.user.id).select('achievements');
      const userAchievementIds = user.achievements.map(a => a.id);
      
      achievements.forEach(achievement => {
        achievement.unlocked = userAchievementIds.includes(achievement.id);
      });
    }

    res.json(achievements);
  } catch (error) {
    console.error('Erreur récupération achievements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/achievements/user/:userId
// @desc    Get user achievements
// @access  Private (Admin or self)
router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier les permissions
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const user = await User.findById(userId)
      .select('achievements stats')
      .populate('achievements', 'id name description icon category rarity rewards');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Obtenir tous les achievements pour calculer le pourcentage
    const totalAchievements = await Achievement.countDocuments({ isActive: true });
    const unlockedCount = user.achievements.length;
    const completionPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

    // Statistiques par catégorie
    const categoryStats = {};
    user.achievements.forEach(achievement => {
      if (!categoryStats[achievement.category]) {
        categoryStats[achievement.category] = 0;
      }
      categoryStats[achievement.category]++;
    });

    res.json({
      achievements: user.achievements,
      stats: {
        unlocked: unlockedCount,
        total: totalAchievements,
        completionPercentage: Math.round(completionPercentage * 100) / 100,
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    console.error('Erreur récupération achievements utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/achievements/check
// @desc    Check for new achievements
// @access  Private
router.post('/check', ensureAuthenticated, async (req, res) => {
  try {
    const newAchievements = await Achievement.checkUserAchievements(req.user.id);
    
    if (newAchievements.length === 0) {
      return res.json({ message: 'Aucun nouvel achievement', achievements: [] });
    }

    const user = await User.findById(req.user.id);
    const unlockedAchievements = [];

    for (const achievement of newAchievements) {
      // Ajouter l'achievement à l'utilisateur
      user.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: new Date()
      });

      // Appliquer les récompenses
      if (achievement.rewards.xp) {
        user.stats.xp += achievement.rewards.xp;
      }
      
      if (achievement.rewards.xcoins) {
        user.xcoins += achievement.rewards.xcoins;
      }

      // Mettre à jour le compteur de déblocage
      achievement.unlockCount += 1;
      await achievement.save();

      unlockedAchievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        rewards: achievement.rewards
      });

      // Envoyer une notification
      await Notification.createNotification(
        user._id,
        'achievement_unlocked',
        'Achievement débloqué !',
        `Félicitations ! Vous avez débloqué l'achievement "${achievement.name}"`,
        { achievementId: achievement.id, achievementName: achievement.name },
        'high'
      );
    }

    await user.save();

    res.json({
      message: `${unlockedAchievements.length} nouvel(s) achievement(s) débloqué(s) !`,
      achievements: unlockedAchievements
    });
  } catch (error) {
    console.error('Erreur vérification achievements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/achievements/categories
// @desc    Get achievement categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Achievement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/achievements/rarities
// @desc    Get achievement rarities
// @access  Public
router.get('/rarities', async (req, res) => {
  try {
    const rarities = await Achievement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$rarity', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(rarities);
  } catch (error) {
    console.error('Erreur récupération raretés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/achievements/leaderboard
// @desc    Get achievement leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await User.aggregate([
      {
        $project: {
          username: 1,
          avatar: 1,
          achievementCount: { $size: '$achievements' },
          stats: 1
        }
      },
      { $sort: { achievementCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      leaderboard: leaderboard.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        avatar: user.avatar,
        achievementCount: user.achievementCount,
        level: user.stats.level,
        xp: user.stats.xp
      })),
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération leaderboard achievements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
