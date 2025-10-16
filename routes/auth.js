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

// ✅ GOOGLE LOGIN
router.get('/google', (req, res, next) => {
  console.log('[AUTH] Google login initiated');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// ✅ GOOGLE CALLBACK
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      console.error('[AUTH] Google callback error:', err);
      return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('[AUTH] req.logIn failed:', err);
        return res.redirect(`${config.FRONTEND_URL}/login?error=login_failed`);
      }
      console.log('[AUTH] Google login success for user', user.username || user.googleId);
      res.redirect(`${config.FRONTEND_URL}/dashboard`);
    });
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

// ✅ Route de test pour créer un utilisateur temporaire (développement uniquement)
router.get('/test-login', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Créer ou trouver un utilisateur de test
    let testUser = await User.findOne({ username: 'testuser' });
    
    if (!testUser) {
      testUser = new User({
        username: 'testuser',
        displayName: 'Utilisateur Test',
        steamId: '76561199825131626',
        avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        coins: 1000,
        level: 1,
        xp: 0,
        isAdmin: false,
        isBanned: false,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await testUser.save();
      console.log('[AUTH] Utilisateur de test créé:', testUser.username);
    }
    
    // Connecter l'utilisateur
    req.logIn(testUser, (err) => {
      if (err) {
        console.error('[AUTH] Erreur connexion test:', err);
        return res.status(500).json({ message: 'Erreur lors de la connexion de test' });
      }
      
      console.log('[AUTH] Connexion de test réussie pour:', testUser.username);
      res.redirect(`${config.FRONTEND_URL}/dashboard`);
    });
    
  } catch (error) {
    console.error('[AUTH] Erreur route test:', error);
    res.status(500).json({ message: 'Erreur serveur' });
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
