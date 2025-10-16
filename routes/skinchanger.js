const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const User = require('../models/User');
const Skin = require('../models/Skin');

// Appliquer un skin à une arme
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { weaponType, skinId } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur possède ce skin
    const user = await User.findById(userId).populate('inventory.skin');
    const userSkin = user.inventory.find(item => item.skin._id.toString() === skinId);
    
    if (!userSkin) {
      return res.status(400).json({ error: 'Vous ne possédez pas ce skin' });
    }

    // Mettre à jour les skins équipés de l'utilisateur
    const equippedSkins = user.equippedSkins || {};
    equippedSkins[weaponType] = skinId;

    await User.findByIdAndUpdate(userId, { equippedSkins });

    res.json({ 
      success: true, 
      message: 'Skin appliqué avec succès',
      equippedSkins 
    });

  } catch (error) {
    console.error('Erreur application skin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les skins équipés de l'utilisateur
router.get('/equipped', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('inventory.skin');
    
    const equippedSkins = user.equippedSkins || {};
    
    // Populer les détails des skins équipés
    const equippedSkinsDetails = {};
    for (const [weaponType, skinId] of Object.entries(equippedSkins)) {
      if (skinId) {
        const skin = await Skin.findById(skinId);
        equippedSkinsDetails[weaponType] = skin;
      }
    }

    res.json({ equippedSkins: equippedSkinsDetails });

  } catch (error) {
    console.error('Erreur récupération skins équipés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Retirer un skin équipé
router.post('/unequip', authMiddleware, async (req, res) => {
  try {
    const { weaponType } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const equippedSkins = user.equippedSkins || {};
    delete equippedSkins[weaponType];

    await User.findByIdAndUpdate(userId, { equippedSkins });

    res.json({ 
      success: true, 
      message: 'Skin retiré avec succès',
      equippedSkins 
    });

  } catch (error) {
    console.error('Erreur retrait skin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les skins disponibles pour une arme spécifique
router.get('/weapon/:weaponType', authMiddleware, async (req, res) => {
  try {
    const { weaponType } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId).populate('inventory.skin');
    
    // Filtrer les skins par type d'arme
    const weaponSkins = user.inventory.filter(item => {
      const skin = item.skin;
      if (!skin) return false;
      
      return skin.weaponType === weaponType || 
             (weaponType === 'knife' && skin.category === 'Knife') ||
             (weaponType === 'gloves' && skin.category === 'Gloves');
    });

    res.json({ skins: weaponSkins.map(item => item.skin) });

  } catch (error) {
    console.error('Erreur récupération skins arme:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
