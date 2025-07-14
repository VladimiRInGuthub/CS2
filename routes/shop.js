const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const User = require('../models/User');

const CASE_PRICE = 250;

router.post('/buy', auth, async (req, res) => {
  try {
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