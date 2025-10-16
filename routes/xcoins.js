const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Middleware pour vérifier l'authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// ===========================================
// GESTION DES XCOINS
// ===========================================

// Obtenir le solde Xcoins de l'utilisateur
router.get('/balance', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      xcoins: user.xcoins,
      coins: user.coins,
      totalSpent: user.stats.totalSpent
    });

  } catch (error) {
    console.error('Erreur get balance:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter des Xcoins (pour les achats, bonus, etc.)
router.post('/add', ensureAuthenticated, [
  body('amount')
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage('Le montant doit être un nombre positif'),
  body('reason')
    .notEmpty()
    .trim()
    .withMessage('La raison est requise'),
  body('type')
    .isIn(['purchase', 'bonus', 'admin', 'refund'])
    .withMessage('Type de transaction invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { amount, reason, type, metadata = {} } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Ajouter les Xcoins
    user.xcoins += amount;

    // Créer une transaction
    const transaction = new Transaction({
      user: user._id,
      type: type,
      amount: amount,
      currency: 'xcoins',
      description: reason,
      status: 'completed',
      paymentMethod: 'internal',
      metadata: metadata
    });

    await transaction.save();
    await user.save();

    res.json({
      message: 'Xcoins ajoutés avec succès',
      newBalance: user.xcoins,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Erreur add xcoins:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Dépenser des Xcoins
router.post('/spend', ensureAuthenticated, [
  body('amount')
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage('Le montant doit être un nombre positif'),
  body('reason')
    .notEmpty()
    .trim()
    .withMessage('La raison est requise'),
  body('type')
    .isIn(['case_opening', 'purchase', 'transfer'])
    .withMessage('Type de transaction invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { amount, reason, type, metadata = {} } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur a assez de Xcoins
    if (user.xcoins < amount) {
      return res.status(400).json({ 
        error: 'Xcoins insuffisants',
        currentBalance: user.xcoins,
        requiredAmount: amount
      });
    }

    // Dépenser les Xcoins
    user.xcoins -= amount;
    user.stats.totalSpent += amount;

    // Créer une transaction
    const transaction = new Transaction({
      user: user._id,
      type: type,
      amount: -amount, // Montant négatif pour une dépense
      currency: 'xcoins',
      description: reason,
      status: 'completed',
      paymentMethod: 'internal',
      metadata: metadata
    });

    await transaction.save();
    await user.save();

    res.json({
      message: 'Xcoins dépensés avec succès',
      newBalance: user.xcoins,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Erreur spend xcoins:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// BONUS QUOTIDIEN
// ===========================================

// Réclamer le bonus quotidien
router.post('/daily-bonus', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur peut réclamer le bonus
    if (!user.canClaimDailyBonus()) {
      const lastClaimed = new Date(user.dailyBonus.lastClaimed);
      const nextBonus = new Date(lastClaimed.getTime() + 24 * 60 * 60 * 1000);
      
      return res.status(400).json({ 
        error: 'Bonus déjà réclamé aujourd\'hui',
        nextBonusAvailable: nextBonus
      });
    }

    // Réclamer le bonus
    const bonusAmount = user.claimDailyBonus();
    
    // Créer une transaction pour le bonus
    const transaction = new Transaction({
      user: user._id,
      type: 'bonus',
      amount: bonusAmount,
      currency: 'xcoins',
      description: `Bonus quotidien (streak: ${user.dailyBonus.streak})`,
      status: 'completed',
      paymentMethod: 'internal',
      metadata: {
        streak: user.dailyBonus.streak,
        bonusType: 'daily'
      }
    });

    await transaction.save();
    await user.save();

    res.json({
      message: 'Bonus quotidien réclamé avec succès',
      bonusAmount: bonusAmount,
      streak: user.dailyBonus.streak,
      newBalance: user.xcoins,
      transactionId: transaction._id
    });

  } catch (error) {
    console.error('Erreur daily bonus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Vérifier l'état du bonus quotidien
router.get('/daily-bonus-status', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const canClaim = user.canClaimDailyBonus();
    const nextBonusAmount = 50 + (user.dailyBonus.streak * 10);

    let nextBonusAvailable = null;
    if (!canClaim && user.dailyBonus.lastClaimed) {
      const lastClaimed = new Date(user.dailyBonus.lastClaimed);
      nextBonusAvailable = new Date(lastClaimed.getTime() + 24 * 60 * 60 * 1000);
    }

    res.json({
      canClaim: canClaim,
      streak: user.dailyBonus.streak,
      nextBonusAmount: nextBonusAmount,
      nextBonusAvailable: nextBonusAvailable,
      lastClaimed: user.dailyBonus.lastClaimed
    });

  } catch (error) {
    console.error('Erreur daily bonus status:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// HISTORIQUE DES TRANSACTIONS
// ===========================================

// Obtenir l'historique des transactions
router.get('/transactions', ensureAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.getUserHistory(req.user._id, limit, skip);
    const total = await Transaction.countDocuments({ user: req.user._id });

    res.json({
      transactions: transactions,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur get transactions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques de dépenses
router.get('/stats', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Calculer les statistiques des transactions
    const totalSpent = await Transaction.getUserTotalSpent(req.user._id, 'xcoins');
    
    // Statistiques par type de transaction
    const statsByType = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      totalSpent: totalSpent,
      currentBalance: user.xcoins,
      statsByType: statsByType,
      userStats: user.stats
    });

  } catch (error) {
    console.error('Erreur get stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// TRANSFERT ENTRE UTILISATEURS (ADMIN)
// ===========================================

// Transférer des Xcoins à un autre utilisateur (admin seulement)
router.post('/transfer', ensureAuthenticated, [
  body('recipientUsername')
    .notEmpty()
    .trim()
    .withMessage('Nom d\'utilisateur du destinataire requis'),
  body('amount')
    .isNumeric()
    .isFloat({ min: 0.01 })
    .withMessage('Le montant doit être un nombre positif'),
  body('reason')
    .notEmpty()
    .trim()
    .withMessage('La raison est requise')
], async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { recipientUsername, amount, reason } = req.body;

    // Trouver le destinataire
    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) {
      return res.status(404).json({ error: 'Destinataire non trouvé' });
    }

    // Vérifier que l'expéditeur a assez de Xcoins
    if (req.user.xcoins < amount) {
      return res.status(400).json({ 
        error: 'Xcoins insuffisants',
        currentBalance: req.user.xcoins,
        requiredAmount: amount
      });
    }

    // Effectuer le transfert
    req.user.xcoins -= amount;
    recipient.xcoins += amount;

    // Créer les transactions
    const senderTransaction = new Transaction({
      user: req.user._id,
      type: 'transfer',
      amount: -amount,
      currency: 'xcoins',
      description: `Transfert vers ${recipientUsername}: ${reason}`,
      status: 'completed',
      paymentMethod: 'internal',
      metadata: {
        recipient: recipientUsername,
        transferType: 'outgoing'
      }
    });

    const recipientTransaction = new Transaction({
      user: recipient._id,
      type: 'transfer',
      amount: amount,
      currency: 'xcoins',
      description: `Transfert de ${req.user.username}: ${reason}`,
      status: 'completed',
      paymentMethod: 'internal',
      metadata: {
        sender: req.user.username,
        transferType: 'incoming'
      }
    });

    await senderTransaction.save();
    await recipientTransaction.save();
    await req.user.save();
    await recipient.save();

    res.json({
      message: 'Transfert effectué avec succès',
      recipient: recipientUsername,
      amount: amount,
      newBalance: req.user.xcoins,
      transactionId: senderTransaction._id
    });

  } catch (error) {
    console.error('Erreur transfer:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
