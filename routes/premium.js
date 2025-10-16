const express = require('express');
const router = express.Router();
const Premium = require('../models/Premium');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { ensureAuthenticated } = require('../middleware/auth');

// @route   GET /api/premium/plans
// @desc    Get available premium plans
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'monthly',
        name: 'Premium Mensuel',
        description: 'Accès premium pour 1 mois',
        price: 9.99,
        currency: 'EUR',
        duration: '1 mois',
        features: [
          'Bonus Xcoins quotidien x2',
          'Réduction 10% sur les cases',
          'Accès aux cases exclusives',
          'Support prioritaire',
          'Interface sans publicité',
          'Accès au battlepass premium'
        ],
        popular: false
      },
      {
        id: 'yearly',
        name: 'Premium Annuel',
        description: 'Accès premium pour 1 an (2 mois gratuits)',
        price: 99.99,
        currency: 'EUR',
        duration: '12 mois',
        originalPrice: 119.88,
        discount: 17,
        features: [
          'Bonus Xcoins quotidien x3',
          'Réduction 15% sur les cases',
          'Accès aux cases exclusives',
          'Support prioritaire',
          'Interface sans publicité',
          'Accès au battlepass premium',
          'Avatar personnalisé',
          'Priorité sur les serveurs'
        ],
        popular: true
      },
      {
        id: 'lifetime',
        name: 'Premium à Vie',
        description: 'Accès premium permanent',
        price: 199.99,
        currency: 'EUR',
        duration: 'À vie',
        features: [
          'Bonus Xcoins quotidien x5',
          'Réduction 20% sur les cases',
          'Accès aux cases exclusives',
          'Support prioritaire',
          'Interface sans publicité',
          'Accès au battlepass premium',
          'Avatar personnalisé',
          'Priorité sur les serveurs',
          'Badge exclusif',
          'Accès aux fonctionnalités bêta'
        ],
        popular: false
      }
    ];
    
    res.json({ plans });
  } catch (error) {
    console.error('Erreur récupération plans premium:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/premium/status
// @desc    Get user premium status
// @access  Private
router.get('/status', ensureAuthenticated, async (req, res) => {
  try {
    const premium = await Premium.findOne({ userId: req.user.id });
    
    if (!premium) {
      return res.json({
        isActive: false,
        plan: null,
        timeRemaining: null,
        benefits: {}
      });
    }
    
    const isActive = premium.isCurrentlyActive();
    const timeRemaining = premium.getTimeRemaining();
    const benefits = premium.getActiveBenefits();
    
    res.json({
      isActive,
      plan: premium.plan,
      startDate: premium.startDate,
      endDate: premium.endDate,
      timeRemaining,
      benefits,
      autoRenew: premium.autoRenew,
      usage: premium.usage
    });
  } catch (error) {
    console.error('Erreur récupération statut premium:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/premium/purchase
// @desc    Purchase premium subscription
// @access  Private
router.post('/purchase', ensureAuthenticated, async (req, res) => {
  try {
    const { plan, paymentMethod } = req.body;
    
    if (!plan || !['monthly', 'yearly', 'lifetime'].includes(plan)) {
      return res.status(400).json({ message: 'Plan invalide' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'utilisateur a déjà un abonnement actif
    const existingPremium = await Premium.findOne({ userId: req.user.id });
    if (existingPremium && existingPremium.isCurrentlyActive()) {
      return res.status(400).json({ message: 'Vous avez déjà un abonnement premium actif' });
    }
    
    // Définir les prix et bénéfices selon le plan
    const planConfig = {
      monthly: {
        price: 9.99,
        benefits: {
          xcoinsBonus: 100,
          caseDiscount: 10,
          exclusiveCases: true,
          prioritySupport: true,
          adFree: true,
          customAvatar: false,
          battlepassAccess: true,
          serverPriority: false
        }
      },
      yearly: {
        price: 99.99,
        benefits: {
          xcoinsBonus: 150,
          caseDiscount: 15,
          exclusiveCases: true,
          prioritySupport: true,
          adFree: true,
          customAvatar: true,
          battlepassAccess: true,
          serverPriority: true
        }
      },
      lifetime: {
        price: 199.99,
        benefits: {
          xcoinsBonus: 200,
          caseDiscount: 20,
          exclusiveCases: true,
          prioritySupport: true,
          adFree: true,
          customAvatar: true,
          battlepassAccess: true,
          serverPriority: true
        }
      }
    };
    
    const config = planConfig[plan];
    
    // Vérifier si l'utilisateur a assez de Xcoins (simulation)
    if (user.xcoins < config.price * 100) { // Convertir en Xcoins (1 EUR = 100 Xcoins)
      return res.status(400).json({ 
        message: 'Xcoins insuffisants',
        required: config.price * 100,
        current: user.xcoins
      });
    }
    
    // Débiter les Xcoins
    user.xcoins -= config.price * 100;
    await user.save();
    
    // Créer ou mettre à jour l'abonnement premium
    let premium;
    if (existingPremium) {
      premium = existingPremium;
    } else {
      premium = new Premium({ userId: req.user.id });
    }
    
    // Activer le premium
    premium.activate(plan, null, paymentMethod || 'manual', config.price, 'EUR');
    premium.benefits = config.benefits;
    await premium.save();
    
    // Ajouter le bonus Xcoins
    user.xcoins += config.benefits.xcoinsBonus;
    await user.save();
    
    // Envoyer une notification
    await Notification.createNotification(
      req.user.id,
      'premium_activated',
      'Premium activé !',
      `Félicitations ! Votre abonnement premium ${plan} a été activé. Profitez de tous les avantages !`,
      { plan, benefits: config.benefits },
      'high'
    );
    
    res.json({
      message: 'Abonnement premium activé avec succès !',
      plan,
      benefits: config.benefits,
      timeRemaining: premium.getTimeRemaining(),
      remainingXcoins: user.xcoins
    });
  } catch (error) {
    console.error('Erreur achat premium:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/premium/cancel
// @desc    Cancel premium subscription
// @access  Private
router.post('/cancel', ensureAuthenticated, async (req, res) => {
  try {
    const premium = await Premium.findOne({ userId: req.user.id });
    
    if (!premium) {
      return res.status(404).json({ message: 'Aucun abonnement premium trouvé' });
    }
    
    if (!premium.isCurrentlyActive()) {
      return res.status(400).json({ message: 'Abonnement non actif' });
    }
    
    // Annuler le renouvellement automatique
    premium.cancel();
    await premium.save();
    
    // Envoyer une notification
    await Notification.createNotification(
      req.user.id,
      'premium_cancelled',
      'Abonnement premium annulé',
      'Votre abonnement premium ne sera pas renouvelé automatiquement. Il reste actif jusqu\'à la date d\'expiration.',
      { plan: premium.plan, endDate: premium.endDate },
      'medium'
    );
    
    res.json({
      message: 'Abonnement premium annulé avec succès',
      endDate: premium.endDate,
      timeRemaining: premium.getTimeRemaining()
    });
  } catch (error) {
    console.error('Erreur annulation premium:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/premium/stats
// @desc    Get premium statistics
// @access  Private (Admin only)
router.get('/stats', ensureAuthenticated, async (req, res) => {
  try {
    // Vérifier les droits administrateur
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const stats = await Premium.getStats();
    const activeUsers = await Premium.getActiveUsers();
    
    res.json({
      stats: stats[0] || {},
      activeUsers: activeUsers.length,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Erreur récupération stats premium:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/premium/cleanup
// @desc    Cleanup expired premium subscriptions
// @access  Private (Admin only)
router.post('/cleanup', ensureAuthenticated, async (req, res) => {
  try {
    // Vérifier les droits administrateur
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const result = await Premium.cleanupExpired();
    
    res.json({
      message: 'Nettoyage des abonnements expirés terminé',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Erreur nettoyage premium:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
