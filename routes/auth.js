const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/config');
const morgan = require('morgan');

// Simple request logger for this router (optional if global)
router.use(morgan('tiny'));

// ✅ STEAM LOGIN
router.get('/steam', (req, res, next) => {
  console.log('[AUTH] Steam login initiated');
  next();
}, passport.authenticate('steam'));

// ✅ STEAM CALLBACK avec session
router.get('/steam/return', (req, res, next) => {
  passport.authenticate('steam', (err, user) => {
    if (err || !user) {
      console.error('[AUTH] Steam callback error:', err);
      return res.redirect(`${config.FRONTEND_URL}/login`);
    }

    // Créer la session utilisateur
    req.logIn(user, (err) => {
      if (err) {
        console.error('[AUTH] req.logIn failed:', err);
        return res.redirect(`${config.FRONTEND_URL}/login`);
      }
      console.log('[AUTH] Login success for user', user.username || user.steamId);
      res.redirect(`${config.FRONTEND_URL}/dashboard`);
    });
  })(req, res, next);
});

// Google auth retiré pour simplification; réactiver si nécessaire

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
router.get('/logout', (req, res, next) => {
  const username = req.user?.username || req.user?.steamId;
  req.logout((err) => {
    if (err) {
      console.error('[AUTH] Logout error:', err);
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
    req.session.destroy(() => {
      console.log('[AUTH] Logout success for user', username);
      res.clearCookie('connect.sid');
      res.redirect(`${config.FRONTEND_URL}/login`);
    });
  });
});

module.exports = router;
