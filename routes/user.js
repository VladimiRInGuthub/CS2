const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('stats level xp achievements inventory caseHistory')
      .populate('inventory.skin', 'name weapon rarity price')
      .populate('achievements', 'name description icon');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Calculer les statistiques avancées
    const inventoryStats = user.getInventoryStats();
    const totalValue = inventoryStats.totalValue;
    
    // Statistiques des cases
    const caseStats = {
      totalOpened: user.stats.totalCasesOpened,
      totalSpent: user.stats.totalSpent,
      averageValue: user.stats.totalCasesOpened > 0 ? totalValue / user.stats.totalCasesOpened : 0
    };

    // Statistiques de rareté
    const rarityStats = user.stats.rarityBreakdown;

    // Dernières cases ouvertes
    const recentCases = user.caseHistory.slice(-5).reverse();

    res.json({
      level: user.stats.level,
      xp: user.stats.xp,
      achievements: user.achievements,
      inventory: {
        totalSkins: inventoryStats.totalSkins,
        favorites: inventoryStats.favorites,
        totalValue: totalValue
      },
      cases: caseStats,
      rarityBreakdown: rarityStats,
      recentCases: recentCases
    });
  } catch (error) {
    console.error('Erreur récupération stats utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires -adminPassword')
      .populate('inventory.skin', 'name weapon rarity image price')
      .populate('achievements', 'name description icon');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erreur récupération profil utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const { username, displayName, preferences } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (displayName) updateData.displayName = displayName;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires -adminPassword');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Profil mis à jour avec succès', user });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;