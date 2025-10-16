const express = require('express');
const router = express.Router();
const User = require('../models/User');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// Obtenir l'inventaire de l'utilisateur connecté
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'inventory.skin',
      model: 'Skin'
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ inventory: user.inventory || [] });
  } catch (error) {
    console.error('Erreur récupération inventaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
