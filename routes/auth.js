const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// ✅ STEAM LOGIN
router.get('/steam', passport.authenticate('steam'));

// ✅ STEAM CALLBACK avec session
router.get('/steam/return', (req, res, next) => {
  passport.authenticate('steam', (err, user) => {
    if (err || !user) return res.redirect(`${config.FRONTEND_URL}/login`);

    // Créer la session utilisateur
    req.logIn(user, (err) => {
      if (err) return res.redirect(`${config.FRONTEND_URL}/login`);
      res.redirect(`${config.FRONTEND_URL}/dashboard`);
    });
  })(req, res, next);
});

// ✅ GOOGLE LOGIN
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// ✅ GOOGLE CALLBACK avec redirection + JWT
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) return res.redirect(`${config.FRONTEND_URL}/login`);

    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${config.FRONTEND_URL}/?token=${token}`);
  })(req, res, next);
});

// ✅ Vérifier l'état de la session
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      coins: req.user.coins
    });
  } else {
    res.status(401).json({ message: 'Non authentifié' });
  }
});

// ✅ Déconnexion
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    res.json({ message: 'Déconnecté avec succès' });
  });
});

module.exports = router;
