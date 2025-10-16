const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Case = require('../models/Case');
const Server = require('../models/Server');
const Notification = require('../models/Notification');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// @route   GET /api/stats/global
// @desc    Get global statistics
// @access  Public
router.get('/global', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCasesOpened,
      totalServers,
      onlineServers,
      totalSkinsObtained
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: null, total: { $sum: '$stats.totalCasesOpened' } } }]),
      Server.countDocuments(),
      Server.countDocuments({ status: 'online' }),
      User.aggregate([{ $group: { _id: null, total: { $sum: '$stats.totalSkinsObtained' } } }])
    ]);

    const totalCasesOpenedCount = totalCasesOpened[0]?.total || 0;
    const totalSkinsObtainedCount = totalSkinsObtained[0]?.total || 0;

    res.json({
      users: {
        total: totalUsers,
        active: await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      },
      cases: {
        totalOpened: totalCasesOpenedCount,
        totalSkinsObtained: totalSkinsObtainedCount
      },
      servers: {
        total: totalServers,
        online: onlineServers,
        offline: totalServers - onlineServers
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats globales:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/stats/user/:userId
// @desc    Get user statistics
// @access  Private (Admin or self)
router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier les permissions
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const user = await User.findById(userId)
      .select('stats level xp achievements inventory caseHistory createdAt lastLogin')
      .populate('inventory.skin', 'name weapon rarity price')
      .populate('achievements', 'name description icon');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Calculer les statistiques avancées
    const inventoryStats = user.getInventoryStats();
    const totalPlayTime = user.stats.totalPlayTime || 0;
    const daysSinceRegistration = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
    
    // Statistiques de progression
    const progressionStats = {
      level: user.stats.level,
      xp: user.stats.xp,
      xpToNextLevel: (user.stats.level * 1000) - user.stats.xp,
      totalPlayTime: totalPlayTime,
      averagePlayTimePerDay: daysSinceRegistration > 0 ? totalPlayTime / daysSinceRegistration : 0
    };

    // Statistiques des cases
    const caseStats = {
      totalOpened: user.stats.totalCasesOpened,
      totalSpent: user.stats.totalSpent,
      averageValuePerCase: user.stats.totalCasesOpened > 0 ? inventoryStats.totalValue / user.stats.totalCasesOpened : 0,
      lastOpened: user.caseHistory.length > 0 ? user.caseHistory[user.caseHistory.length - 1].openedAt : null
    };

    // Statistiques de rareté
    const rarityStats = user.stats.rarityBreakdown;

    // Répartition des skins par arme
    const weaponStats = {};
    user.inventory.forEach(item => {
      if (item.skin && item.skin.weapon) {
        weaponStats[item.skin.weapon] = (weaponStats[item.skin.weapon] || 0) + 1;
      }
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        level: user.stats.level,
        xp: user.stats.xp,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      progression: progressionStats,
      cases: caseStats,
      inventory: inventoryStats,
      rarityBreakdown: rarityStats,
      weaponDistribution: weaponStats,
      achievements: user.achievements,
      recentActivity: user.caseHistory.slice(-10).reverse()
    });
  } catch (error) {
    console.error('Erreur récupération stats utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/stats/leaderboard
// @desc    Get leaderboard data
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'level', limit = 10 } = req.query;
    
    let sortField = 'stats.level';
    let sortOrder = -1;
    
    switch (type) {
      case 'level':
        sortField = 'stats.level';
        break;
      case 'xp':
        sortField = 'stats.xp';
        break;
      case 'cases':
        sortField = 'stats.totalCasesOpened';
        break;
      case 'skins':
        sortField = 'stats.totalSkinsObtained';
        break;
      case 'spent':
        sortField = 'stats.totalSpent';
        break;
      default:
        sortField = 'stats.level';
    }

    const leaderboard = await User.find({})
      .select('username avatar stats level xp')
      .sort({ [sortField]: sortOrder })
      .limit(parseInt(limit))
      .lean();

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.avatar,
      level: user.stats.level,
      xp: user.stats.xp,
      totalCasesOpened: user.stats.totalCasesOpened,
      totalSkinsObtained: user.stats.totalSkinsObtained,
      totalSpent: user.stats.totalSpent
    }));

    res.json({
      type,
      leaderboard: formattedLeaderboard,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération leaderboard:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/stats/achievements
// @desc    Get achievement statistics
// @access  Public
router.get('/achievements', async (req, res) => {
  try {
    const achievements = await User.aggregate([
      { $unwind: '$achievements' },
      { $group: { _id: '$achievements', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const totalUsers = await User.countDocuments();
    const achievementStats = achievements.map(achievement => ({
      achievement: achievement._id,
      unlockedBy: achievement.count,
      percentage: ((achievement.count / totalUsers) * 100).toFixed(2)
    }));

    res.json({
      achievements: achievementStats,
      totalUsers,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération stats achievements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/stats/admin
// @desc    Get admin statistics
// @access  Private (Admin only)
router.get('/admin', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const [
      userStats,
      caseStats,
      serverStats,
      revenueStats,
      recentActivity
    ] = await Promise.all([
      // Statistiques utilisateurs
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            totalXp: { $sum: '$stats.xp' },
            totalCasesOpened: { $sum: '$stats.totalCasesOpened' },
            totalSkinsObtained: { $sum: '$stats.totalSkinsObtained' },
            totalSpent: { $sum: '$stats.totalSpent' },
            averageLevel: { $avg: '$stats.level' }
          }
        }
      ]),
      
      // Statistiques des cases
      Case.aggregate([
        {
          $group: {
            _id: null,
            totalCases: { $sum: 1 },
            totalRevenue: { $sum: '$stats.totalRevenue' },
            totalOpened: { $sum: '$stats.totalOpened' },
            averageValue: { $avg: '$stats.averageValue' }
          }
        }
      ]),
      
      // Statistiques des serveurs
      Server.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Statistiques de revenus (simulées)
      User.aggregate([
        {
          $group: {
            _id: null,
            totalXcoinsPurchased: { $sum: { $subtract: ['$xcoins', 1000] } } // Solde initial de 1000
          }
        }
      ]),
      
      // Activité récente
      User.find({})
        .select('username lastLogin createdAt')
        .sort({ lastLogin: -1 })
        .limit(10)
        .lean()
    ]);

    res.json({
      users: userStats[0] || {},
      cases: caseStats[0] || {},
      servers: serverStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      revenue: revenueStats[0] || {},
      recentActivity: recentActivity,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération stats admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
