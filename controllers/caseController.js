const Case = require('../models/Case');
const Skin = require('../models/Skin');
const User = require('../models/User');

// 🎁 Obtenir toutes les cases disponibles
exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({ isActive: true }).populate('items.skinId');
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🎁 Obtenir une case spécifique
exports.getCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id).populate('items.skinId');
    if (!caseItem) {
      return res.status(404).json({ error: 'Case introuvable' });
    }
    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🎲 Ouvrir une case
exports.openCase = async (req, res) => {
  try {
    const { caseId } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Vérifier que la case existe
    const caseItem = await Case.findById(caseId).populate('items.skinId');
    if (!caseItem || !caseItem.isActive) {
      return res.status(404).json({ error: 'Case introuvable ou inactive' });
    }

    // Vérifier que l'utilisateur a assez de coins
    if (user.coins < caseItem.price) {
      return res.status(400).json({ error: 'Coins insuffisants' });
    }

    // 🎯 Logique de sélection du skin basée sur les probabilités
    const selectedSkin = selectRandomSkin(caseItem.items);
    
    // Récupérer l'objet complet du skin (si ce n'est pas déjà le cas)
    let skinObj = selectedSkin;
    if (!selectedSkin.image) {
      // selectedSkin est probablement un ObjectId, il faut le chercher
      skinObj = await Skin.findById(selectedSkin);
      if (!skinObj) {
        return res.status(500).json({ error: 'Skin introuvable' });
      }
    }
    
    // Déduire les coins
    user.coins -= caseItem.price;
    
    // Ajouter le skin à l'inventaire (avec toutes les infos nécessaires)
    const inventoryItem = {
      skinId: skinObj._id.toString(),
      rarity: skinObj.rarity,
      name: skinObj.name,
      weapon: skinObj.weapon,
      image: skinObj.image,
      wear: skinObj.wear,
      obtainedAt: new Date(),
      caseOpened: caseItem.name,
      caseId: caseItem._id.toString()
    };
    
    user.inventory.push(inventoryItem);

    // Ajouter à l'historique des ouvertures
    if (!user.caseHistory) {
      user.caseHistory = [];
    }
    
    user.caseHistory.push({
      caseId: caseItem._id,
      caseName: caseItem.name,
      skinId: skinObj._id,
      skinName: skinObj.name,
      skinRarity: skinObj.rarity,
      skinWeapon: skinObj.weapon,
      skinImage: skinObj.image,
      openedAt: new Date(),
      cost: caseItem.price
    });

    // Mettre à jour les statistiques
    if (!user.stats) {
      user.stats = {
        totalCasesOpened: 0,
        totalSpent: 0,
        totalSkinsObtained: 0,
        rarityBreakdown: {
          Common: 0,
          Uncommon: 0,
          Rare: 0,
          Epic: 0,
          Legendary: 0
        }
      };
    }

    user.stats.totalCasesOpened += 1;
    user.stats.totalSpent += caseItem.price;
    user.stats.totalSkinsObtained += 1;
    user.stats.rarityBreakdown[skinObj.rarity] += 1;

    // Sauvegarder les changements
    await user.save();

    // Retourner le résultat
    res.json({
      success: true,
      skin: skinObj,
      newBalance: user.coins,
      caseName: caseItem.name,
      cost: caseItem.price,
      message: `Félicitations ! Vous avez obtenu ${skinObj.name} (${skinObj.rarity})`,
      stats: user.stats
    });

  } catch (error) {
    console.error('Erreur ouverture case:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ouverture de la case' });
  }
};

// 🎯 Fonction pour sélectionner un skin aléatoire basé sur les probabilités
function selectRandomSkin(items) {
  // Calculer la somme totale des probabilités
  const totalWeight = items.reduce((sum, item) => sum + item.dropRate, 0);
  
  // Générer un nombre aléatoire entre 0 et la somme totale
  let random = Math.random() * totalWeight;
  
  // Parcourir les items et sélectionner celui correspondant
  for (const item of items) {
    random -= item.dropRate;
    if (random <= 0) {
      return item.skinId;
    }
  }
  
  // Fallback (ne devrait jamais arriver)
  return items[0].skinId;
}

// 📊 Obtenir les statistiques d'ouverture de cases
exports.getCaseStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Compter les skins par rareté
    const stats = {
      totalSkins: user.inventory.length,
      byRarity: {
        Common: 0,
        Uncommon: 0,
        Rare: 0,
        Epic: 0,
        Legendary: 0
      },
      byWeapon: {}
    };

    user.inventory.forEach(skin => {
      stats.byRarity[skin.rarity] = (stats.byRarity[skin.rarity] || 0) + 1;
      stats.byWeapon[skin.weapon] = (stats.byWeapon[skin.weapon] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 📈 Obtenir l'historique des ouvertures de cases
exports.getCaseHistory = async (req, res) => {
  try {
    console.log('getCaseHistory called, req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const history = user.caseHistory || [];
    
    // Trier par date (plus récent en premier)
    history.sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt));
    
    // Limiter à 50 dernières ouvertures
    const limitedHistory = history.slice(0, 50);

    res.json(limitedHistory);
  } catch (error) {
    console.error('Erreur getCaseHistory:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// 📊 Obtenir les statistiques détaillées de l'utilisateur
exports.getUserStats = async (req, res) => {
  try {
    console.log('getUserStats called, req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const stats = user.stats || {
      totalCasesOpened: 0,
      totalSpent: 0,
      totalSkinsObtained: 0,
      rarityBreakdown: {
        Common: 0,
        Uncommon: 0,
        Rare: 0,
        Epic: 0,
        Legendary: 0
      }
    };

    // Calculer les pourcentages de rareté
    const rarityPercentages = {};
    if (stats.totalSkinsObtained > 0) {
      Object.keys(stats.rarityBreakdown).forEach(rarity => {
        rarityPercentages[rarity] = ((stats.rarityBreakdown[rarity] / stats.totalSkinsObtained) * 100).toFixed(1);
      });
    }

    // Calculer la valeur moyenne par case
    const averageValue = stats.totalCasesOpened > 0 ? (stats.totalSpent / stats.totalCasesOpened).toFixed(0) : 0;

    res.json({
      ...stats,
      rarityPercentages,
      averageValue,
      inventoryValue: user.inventory.length
    });
  } catch (error) {
    console.error('Erreur getUserStats:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};
