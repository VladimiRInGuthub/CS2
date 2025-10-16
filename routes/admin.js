const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Case = require('../models/Case');
const Skin = require('../models/Skin');
const Server = require('../models/Server');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const Battlepass = require('../models/Battlepass');
const Premium = require('../models/Premium');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const [
      userStats,
      caseStats,
      serverStats,
      transactionStats,
      premiumStats,
      battlepassStats,
      recentActivity
    ] = await Promise.all([
      // Statistiques utilisateurs
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: {
                $cond: [
                  { $gte: ['$lastLogin', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            premiumUsers: {
              $sum: {
                $cond: [{ $eq: ['$isPremium', true] }, 1, 0]
              }
            },
            bannedUsers: {
              $sum: {
                $cond: [{ $eq: ['$isBanned', true] }, 1, 0]
              }
            },
            totalXcoins: { $sum: '$xcoins' },
            totalXp: { $sum: '$stats.xp' }
          }
        }
      ]),
      
      // Statistiques des cases
      Case.aggregate([
        {
          $group: {
            _id: null,
            totalCases: { $sum: 1 },
            activeCases: {
              $sum: {
                $cond: [{ $eq: ['$isActive', true] }, 1, 0]
              }
            },
            totalOpened: { $sum: '$stats.totalOpened' },
            totalRevenue: { $sum: '$stats.totalRevenue' }
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
      
      // Statistiques des transactions
      Transaction.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      
      // Statistiques premium
      Premium.getStats(),
      
      // Statistiques battlepass
      Battlepass.aggregate([
        {
          $group: {
            _id: null,
            totalBattlepasses: { $sum: 1 },
            activeBattlepasses: {
              $sum: {
                $cond: [{ $eq: ['$isActive', true] }, 1, 0]
              }
            },
            totalPurchases: { $sum: '$stats.totalPurchases' },
            totalRevenue: { $sum: '$stats.totalRevenue' }
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
      transactions: transactionStats,
      premium: premiumStats[0] || {},
      battlepass: battlepassStats[0] || {},
      recentActivity,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération dashboard admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';

    let query = {};
    
    // Filtre de recherche
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtres spécifiques
    switch (filter) {
      case 'premium':
        query.isPremium = true;
        break;
      case 'banned':
        query.isBanned = true;
        break;
      case 'active':
        query.lastLogin = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'inactive':
        query.lastLogin = { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -emailVerificationToken -passwordResetToken -adminPassword')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/admin/users/:userId
// @desc    Update user (ban, unban, modify)
// @access  Private (Admin only)
router.put('/users/:userId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, reason, xcoins, isAdmin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    switch (action) {
      case 'ban':
        user.isBanned = true;
        user.banReason = reason || 'Bannissement par administrateur';
        user.banExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
        break;
        
      case 'unban':
        user.isBanned = false;
        user.banReason = undefined;
        user.banExpires = undefined;
        break;
        
      case 'add_xcoins':
        if (xcoins && xcoins > 0) {
          user.xcoins += xcoins;
        }
        break;
        
      case 'remove_xcoins':
        if (xcoins && xcoins > 0) {
          user.xcoins = Math.max(0, user.xcoins - xcoins);
        }
        break;
        
      case 'set_admin':
        user.isAdmin = isAdmin === true;
        break;
        
      default:
        return res.status(400).json({ message: 'Action invalide' });
    }

    await user.save();

    // Envoyer une notification à l'utilisateur
    let notificationMessage = '';
    switch (action) {
      case 'ban':
        notificationMessage = `Votre compte a été suspendu. Raison: ${user.banReason}`;
        break;
      case 'unban':
        notificationMessage = 'Votre compte a été réactivé.';
        break;
      case 'add_xcoins':
        notificationMessage = `${xcoins} Xcoins ont été ajoutés à votre compte par un administrateur.`;
        break;
      case 'remove_xcoins':
        notificationMessage = `${xcoins} Xcoins ont été retirés de votre compte par un administrateur.`;
        break;
    }

    if (notificationMessage) {
      await Notification.createNotification(
        userId,
        'admin_action',
        'Action administrateur',
        notificationMessage,
        { action, reason, xcoins },
        'high'
      );
    }

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: user._id,
        username: user.username,
        isBanned: user.isBanned,
        banReason: user.banReason,
        xcoins: user.xcoins,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/cases
// @desc    Get all cases for admin management
// @access  Private (Admin only)
router.get('/cases', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const cases = await Case.find({})
      .populate('items.skinId', 'name weapon rarity image price')
      .populate('featuredItems.skinId', 'name weapon rarity image price')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error('Erreur récupération cases:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/admin/cases
// @desc    Create new case
// @access  Private (Admin only)
router.post('/cases', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const caseData = req.body;
    
    const newCase = new Case(caseData);
    await newCase.save();

    res.status(201).json({
      message: 'Case créée avec succès',
      case: newCase
    });
  } catch (error) {
    console.error('Erreur création case:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/admin/cases/:caseId
// @desc    Update case
// @access  Private (Admin only)
router.put('/cases/:caseId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { caseId } = req.params;
    const updateData = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: 'Case non trouvée' });
    }

    res.json({
      message: 'Case mise à jour avec succès',
      case: updatedCase
    });
  } catch (error) {
    console.error('Erreur mise à jour case:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/admin/cases/:caseId
// @desc    Delete case
// @access  Private (Admin only)
router.delete('/cases/:caseId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { caseId } = req.params;

    const deletedCase = await Case.findByIdAndDelete(caseId);

    if (!deletedCase) {
      return res.status(404).json({ message: 'Case non trouvée' });
    }

    res.json({
      message: 'Case supprimée avec succès',
      case: deletedCase
    });
  } catch (error) {
    console.error('Erreur suppression case:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/servers
// @desc    Get all servers for admin management
// @access  Private (Admin only)
router.get('/servers', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const servers = await Server.find({})
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(servers);
  } catch (error) {
    console.error('Erreur récupération serveurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/admin/servers/:serverId
// @desc    Update server (ban, unban, modify)
// @access  Private (Admin only)
router.put('/servers/:serverId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { serverId } = req.params;
    const { action, reason } = req.body;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ message: 'Serveur non trouvé' });
    }

    switch (action) {
      case 'ban':
        server.isBanned = true;
        server.banReason = reason || 'Serveur banni par administrateur';
        break;
        
      case 'unban':
        server.isBanned = false;
        server.banReason = undefined;
        break;
        
      case 'set_official':
        server.isOfficial = true;
        break;
        
      case 'remove_official':
        server.isOfficial = false;
        break;
        
      default:
        return res.status(400).json({ message: 'Action invalide' });
    }

    await server.save();

    res.json({
      message: 'Serveur mis à jour avec succès',
      server: {
        id: server._id,
        name: server.name,
        isBanned: server.isBanned,
        banReason: server.banReason,
        isOfficial: server.isOfficial
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour serveur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/transactions
// @desc    Get all transactions
// @access  Private (Admin only)
router.get('/transactions', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    let query = {};
    if (type) {
      query.type = type;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query)
    ]);

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération transactions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/admin/notifications
// @desc    Send notification to users
// @access  Private (Admin only)
router.post('/notifications', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { title, message, type, targetUsers, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Titre et message requis' });
    }

    let users = [];
    
    if (targetUsers === 'all') {
      users = await User.find({}).select('_id');
    } else if (targetUsers === 'premium') {
      users = await User.find({ isPremium: true }).select('_id');
    } else if (targetUsers === 'active') {
      users = await User.find({ 
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }).select('_id');
    }

    const notifications = users.map(user => ({
      userId: user._id,
      type: type || 'admin_message',
      title,
      message,
      priority: priority || 'medium',
      data: { adminNotification: true }
    }));

    await Notification.insertMany(notifications);

    res.json({
      message: `${notifications.length} notifications envoyées avec succès`,
      count: notifications.length
    });
  } catch (error) {
    console.error('Erreur envoi notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/logs
// @desc    Get system logs
// @access  Private (Admin only)
router.get('/logs', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    // Simulation de logs système
    const logs = [
      {
        id: 1,
        timestamp: new Date(),
        level: 'info',
        message: 'Serveur démarré avec succès',
        source: 'server'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 60000),
        level: 'warning',
        message: 'Tentative de connexion échouée',
        source: 'auth'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 120000),
        level: 'error',
        message: 'Erreur base de données',
        source: 'database'
      }
    ];

    res.json({ logs });
  } catch (error) {
    console.error('Erreur récupération logs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;