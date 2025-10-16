const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Basculer vers une auth basée session (Passport)
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Non authentifié' });
};

// Anciennes routes JWT retirées

// Route pour obtenir les informations de l'utilisateur (avec sessions)
router.get('/me', ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    avatar: req.user.avatar,
    steamId: req.user.steamId,
    googleId: req.user.googleId,
    coins: req.user.coins,
    email: req.user.email
  });
});

// Route pour mettre à jour le profil utilisateur
router.put(
  '/me',
  ensureAuthenticated,
  body('username').optional().isString().isLength({ min: 3, max: 32 }),
  body('email').optional().isEmail(),
  body('avatar').optional().isURL(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, avatar } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true }
      );
      res.json({
        id: updatedUser._id,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        steamId: updatedUser.steamId,
        googleId: updatedUser.googleId,
        coins: updatedUser.coins,
        email: updatedUser.email
      });
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
  }
);

module.exports = router;