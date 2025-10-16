const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Case = require('../models/Case');
const Skin = require('../models/Skin');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Middleware pour vérifier l'authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// ===========================================
// RÉCUPÉRATION DES CASES
// ===========================================

// Obtenir toutes les cases actives
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const cases = await Case.find(query)
      .sort({ sortOrder: 1, isFeatured: -1, createdAt: -1 })
      .populate('items.skinId', 'name weapon rarity image price category')
      .populate('featuredItems.skinId', 'name weapon rarity image price category');

    res.json({ cases });

  } catch (error) {
    console.error('Erreur get cases:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir une case spécifique
router.get('/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findById(caseId)
      .populate('items.skinId', 'name weapon rarity image price category wear')
      .populate('featuredItems.skinId', 'name weapon rarity image price category wear');

    if (!caseData) {
      return res.status(404).json({ error: 'Case non trouvée' });
    }

    if (!caseData.isActive) {
      return res.status(404).json({ error: 'Case non disponible' });
    }

    res.json({ case: caseData });

  } catch (error) {
    console.error('Erreur get case:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques d'une case
router.get('/:caseId/stats', async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ error: 'Case non trouvée' });
    }

    // Calculer les statistiques récentes
    const recentOpens = await Transaction.find({
      relatedCase: caseId,
      type: 'case_opening',
      status: 'completed',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Dernières 24h
    }).countDocuments();

    const stats = {
      ...caseData.getStats(),
      recentOpens,
      dropRates: caseData.dropRates,
      totalItems: caseData.items.length
    };

    res.json({ stats });

  } catch (error) {
    console.error('Erreur get case stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// OUVERTURE DE CASE
// ===========================================

// Ouvrir une case
router.post('/:caseId/open', ensureAuthenticated, async (req, res) => {
  try {
    const { caseId } = req.params;

    // Vérifier que la case existe et est active
    const caseData = await Case.findById(caseId)
      .populate('items.skinId', 'name weapon rarity image price category wear');
    
    if (!caseData || !caseData.isActive) {
      return res.status(404).json({ error: 'Case non trouvée ou inactive' });
    }

    // Vérifier que la case a des items
    if (caseData.items.length === 0) {
      return res.status(400).json({ error: 'Case vide' });
    }

    // Vérifier que l'utilisateur a assez de Xcoins
    const user = await User.findById(req.user._id);
    if (user.xcoins < caseData.price) {
      return res.status(400).json({ 
        error: 'Xcoins insuffisants',
        required: caseData.price,
        current: user.xcoins
      });
    }

    // Générer le skin gagné
    const randomItem = caseData.getRandomSkin();
    if (!randomItem) {
      return res.status(500).json({ error: 'Erreur génération skin' });
    }

    // Récupérer les détails du skin
    const skin = await Skin.findById(randomItem.skinId);
    if (!skin) {
      return res.status(500).json({ error: 'Skin non trouvé' });
    }

    // Générer un float aléatoire selon la qualité
    const float = generateRandomFloat(skin.wear);

    // Débiter les Xcoins
    user.xcoins -= caseData.price;
    user.stats.totalSpent += caseData.price;
    user.stats.totalCasesOpened += 1;
    user.stats.totalSkinsObtained += 1;
    user.stats.rarityBreakdown[skin.rarity] += 1;

    // Ajouter le skin à l'inventaire
    const inventoryItem = {
      skin: skin._id,
      obtainedAt: new Date(),
      caseOpened: caseData.name,
      caseId: caseData._id,
      float: float,
      stickers: [], // Peut être étendu plus tard
      isFavorite: false
    };

    user.inventory.push(inventoryItem);

    // Ajouter à l'historique des cases
    const caseHistoryItem = {
      caseId: caseData._id,
      caseName: caseData.name,
      skinId: skin._id,
      skinName: skin.name,
      skinRarity: skin.rarity,
      skinWeapon: skin.weapon,
      openedAt: new Date(),
      cost: caseData.price
    };

    user.caseHistory.push(caseHistoryItem);

    // Créer une transaction
    const transaction = new Transaction({
      user: user._id,
      type: 'case_opening',
      amount: -caseData.price,
      currency: 'xcoins',
      description: `Ouverture de case: ${caseData.name}`,
      status: 'completed',
      paymentMethod: 'internal',
      relatedCase: caseData._id,
      relatedSkin: skin._id,
      metadata: {
        caseName: caseData.name,
        skinName: skin.name,
        skinRarity: skin.rarity,
        float: float
      }
    });

    // Mettre à jour les statistiques de la case
    caseData.stats.totalOpened += 1;
    caseData.stats.totalRevenue += caseData.price;
    caseData.stats.lastOpened = new Date();

    // Sauvegarder tout
    await user.save();
    await transaction.save();
    await caseData.save();

    // Préparer la réponse
    const result = {
      success: true,
      case: {
        id: caseData._id,
        name: caseData.name,
        price: caseData.price
      },
      skin: {
        id: skin._id,
        name: skin.name,
        weapon: skin.weapon,
        rarity: skin.rarity,
        image: skin.image,
        price: skin.price,
        category: skin.category,
        wear: skin.wear,
        float: float
      },
      user: {
        newBalance: user.xcoins,
        totalSpent: user.stats.totalSpent,
        totalCasesOpened: user.stats.totalCasesOpened
      },
      transactionId: transaction._id
    };

    res.json(result);

  } catch (error) {
    console.error('Erreur ouverture case:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// HISTORIQUE DES OUVERTURES
// ===========================================

// Obtenir l'historique des ouvertures de l'utilisateur
router.get('/history/user', ensureAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const history = user.caseHistory
      .sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt))
      .slice(skip, skip + limit);

    const total = user.caseHistory.length;

    res.json({
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur get history:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir l'historique global des ouvertures récentes
router.get('/history/global', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const recentOpens = await Transaction.find({
      type: 'case_opening',
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'username avatar')
    .populate('relatedCase', 'name image')
    .populate('relatedSkin', 'name weapon rarity image')
    .select('user relatedCase relatedSkin createdAt metadata');

    res.json({ recentOpens });

  } catch (error) {
    console.error('Erreur get global history:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// STATISTIQUES GLOBALES
// ===========================================

// Obtenir les statistiques globales des cases
router.get('/stats/global', async (req, res) => {
  try {
    const totalCases = await Case.countDocuments({ isActive: true });
    const totalOpens = await Transaction.countDocuments({ 
      type: 'case_opening', 
      status: 'completed' 
    });
    const totalRevenue = await Transaction.aggregate([
      {
        $match: {
          type: 'case_opening',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $abs: '$amount' } }
        }
      }
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Top cases les plus ouvertes
    const topCases = await Transaction.aggregate([
      {
        $match: {
          type: 'case_opening',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$relatedCase',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'cases',
          localField: '_id',
          foreignField: '_id',
          as: 'case'
        }
      }
    ]);

    res.json({
      totalCases,
      totalOpens,
      totalRevenue: revenue,
      topCases: topCases.map(item => ({
        case: item.case[0],
        opens: item.count
      }))
    });

  } catch (error) {
    console.error('Erreur get global stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// FONCTIONS UTILITAIRES
// ===========================================

// Générer un float aléatoire selon la qualité
function generateRandomFloat(wear) {
  const wearRanges = {
    'Factory New': { min: 0.00, max: 0.07 },
    'Minimal Wear': { min: 0.07, max: 0.15 },
    'Field-Tested': { min: 0.15, max: 0.38 },
    'Well-Worn': { min: 0.38, max: 0.45 },
    'Battle-Scarred': { min: 0.45, max: 1.00 }
  };

  const range = wearRanges[wear] || wearRanges['Field-Tested'];
  return Math.random() * (range.max - range.min) + range.min;
}

module.exports = router;