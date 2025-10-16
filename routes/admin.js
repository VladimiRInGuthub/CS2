const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skin = require('../models/Skin');
const Case = require('../models/Case');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { body, validationResult } = require('express-validator');

// Middleware d'authentification admin
const ensureAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Accès admin requis' });
  }
  next();
};

// Middleware d'authentification admin par token
const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token admin requis' });
  }

  jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token admin invalide' });
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Accès admin requis' });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Erreur de vérification admin' });
    }
  });
};

// Route de connexion admin
router.post('/login', [
  body('username').notEmpty().withMessage('Nom d\'utilisateur requis'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+adminPassword');
    if (!user || !user.isAdmin) {
      return res.status(401).json({ error: 'Identifiants admin invalides' });
    }

    const isValidPassword = await bcrypt.compare(password, user.adminPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Mot de passe admin invalide' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: true },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion admin réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Erreur connexion admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un admin (première fois seulement)
router.post('/setup', async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Admin déjà configuré' });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const admin = new User({
      username,
      adminPassword: hashedPassword,
      isAdmin: true,
      coins: 999999
    });

    await admin.save();

    res.json({ message: 'Admin créé avec succès' });
  } catch (error) {
    console.error('Erreur création admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Statistiques générales
router.get('/stats', authenticateAdminToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkins = await Skin.countDocuments();
    const totalCases = await Case.countDocuments();
    
    const totalCoinsInCirculation = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$coins' } } }
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('username avatar createdAt coins');

    const topUsers = await User.find()
      .sort({ coins: -1 })
      .limit(10)
      .select('username avatar coins stats.totalCasesOpened');

    res.json({
      totalUsers,
      totalSkins,
      totalCases,
      totalCoinsInCirculation: totalCoinsInCirculation[0]?.total || 0,
      recentUsers,
      topUsers
    });
  } catch (error) {
    console.error('Erreur stats admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gestion des utilisateurs
router.get('/users', authenticateAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-adminPassword')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

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
    console.error('Erreur liste utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Donner des coins à un utilisateur
router.post('/give-coins', authenticateAdminToken, [
  body('userId').notEmpty().withMessage('ID utilisateur requis'),
  body('amount').isInt({ min: 1 }).withMessage('Montant valide requis')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    user.coins += amount;
    await user.save();

    res.json({
      message: `${amount} coins donnés à ${user.username}`,
      newBalance: user.coins
    });
  } catch (error) {
    console.error('Erreur give coins:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Donner un skin à un utilisateur
router.post('/give-skin', authenticateAdminToken, [
  body('userId').notEmpty().withMessage('ID utilisateur requis'),
  body('skinId').notEmpty().withMessage('ID skin requis')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, skinId } = req.body;

  try {
    const user = await User.findById(userId);
    const skin = await Skin.findById(skinId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    if (!skin) {
      return res.status(404).json({ error: 'Skin non trouvé' });
    }

    user.inventory.push({
      skin: skinId,
      obtainedAt: new Date(),
      caseOpened: 'Admin Give',
      caseId: 'admin'
    });

    await user.save();

    res.json({
      message: `Skin ${skin.name} donné à ${user.username}`,
      skin: {
        id: skin._id,
        name: skin.name,
        rarity: skin.rarity,
        weapon: skin.weapon
      }
    });
  } catch (error) {
    console.error('Erreur give skin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier le statut admin d'un utilisateur
router.put('/toggle-admin/:userId', authenticateAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas modifier votre propre statut admin' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Si on donne le statut admin, demander un mot de passe
    if (!user.isAdmin && password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.adminPassword = hashedPassword;
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `${user.username} est maintenant ${user.isAdmin ? 'admin' : 'utilisateur'}`,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Erreur toggle admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un utilisateur
router.delete('/user/:userId', authenticateAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: `Utilisateur ${user.username} supprimé` });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
