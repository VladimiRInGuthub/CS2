const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

const CASE_PRICE = 250;

router.post('/buy', ensureAuthenticated, body('item').optional().isString(), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    if (user.coins < CASE_PRICE) {
      return res.status(400).json({ error: 'Pas assez de coins' });
    }

    user.coins -= CASE_PRICE;
    await user.save();

    res.json({ message: 'Caisse achetée', coins: user.coins });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;