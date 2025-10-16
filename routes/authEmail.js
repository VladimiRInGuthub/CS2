const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const emailService = require('../utils/email');
const tokenService = require('../utils/tokenService');
const config = require('../config/config');

// Middleware pour vérifier l'authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// ===========================================
// INSCRIPTION AVEC EMAIL/PASSWORD
// ===========================================

router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('username')
    .isLength({ min: 3, max: 50 })
    .trim()
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères'),
  body('displayName')
    .optional()
    .isLength({ max: 50 })
    .trim()
], async (req, res) => {
  try {
    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { email, password, username, displayName } = req.body;

    // Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
    }

    // Générer le token de vérification
    const verificationToken = tokenService.generateEmailVerificationToken();

    // Créer l'utilisateur
    const user = new User({
      email,
      password,
      username,
      displayName: displayName || username,
      emailVerificationToken: tokenService.hashToken(verificationToken),
      emailVerified: false
    });

    await user.save();

    // Envoyer l'email de vérification
    await emailService.sendVerificationEmail(user, verificationToken);

    // Créer une transaction pour le bonus de bienvenue
    const welcomeTransaction = new Transaction({
      user: user._id,
      type: 'bonus',
      amount: 1000,
      currency: 'xcoins',
      description: 'Bonus de bienvenue',
      status: 'completed',
      paymentMethod: 'internal'
    });
    await welcomeTransaction.save();

    res.status(201).json({ 
      message: 'Compte créé avec succès. Vérifiez votre email pour activer votre compte.',
      userId: user._id
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

// ===========================================
// CONNEXION AVEC EMAIL/PASSWORD
// ===========================================

router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur avec le mot de passe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si le compte est vérifié
    if (!user.emailVerified) {
      return res.status(401).json({ 
        error: 'Compte non vérifié', 
        message: 'Veuillez vérifier votre email avant de vous connecter' 
      });
    }

    // Vérifier si le compte est banni
    if (user.isBanned) {
      return res.status(403).json({ 
        error: 'Compte banni', 
        reason: user.banReason 
      });
    }

    // Mettre à jour les informations de connexion
    user.lastLogin = new Date();
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    await user.save();

    // Créer la session
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la connexion' });
      }
      
      res.json({
        message: 'Connexion réussie',
        user: {
          id: user._id,
          username: user.username,
          displayName: user.getDisplayName(),
          email: user.email,
          avatar: user.avatar,
          coins: user.coins,
          xcoins: user.xcoins,
          level: user.stats.level,
          isAdmin: user.isAdmin
        }
      });
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// ===========================================
// VÉRIFICATION D'EMAIL
// ===========================================

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token de vérification requis' });
    }

    const hashedToken = tokenService.hashToken(token);
    const user = await User.findOne({ 
      emailVerificationToken: hashedToken 
    });

    if (!user) {
      return res.status(400).json({ error: 'Token de vérification invalide' });
    }

    // Vérifier si le compte est déjà vérifié
    if (user.emailVerified) {
      return res.status(400).json({ error: 'Compte déjà vérifié' });
    }

    // Activer le compte
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Envoyer l'email de bienvenue
    await emailService.sendWelcomeEmail(user);

    res.json({ message: 'Email vérifié avec succès' });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
  }
});

// ===========================================
// DEMANDE DE RÉINITIALISATION DE MOT DE PASSE
// ===========================================

router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return res.json({ 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
      });
    }

    // Générer le token de réinitialisation
    const resetToken = tokenService.generatePasswordResetToken();
    user.passwordResetToken = tokenService.hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 heure
    await user.save();

    // Envoyer l'email de réinitialisation
    await emailService.sendPasswordResetEmail(user, resetToken);

    res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
    });

  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// RÉINITIALISATION DE MOT DE PASSE
// ===========================================

router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Token requis'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { token, password } = req.body;

    const hashedToken = tokenService.hashToken(token);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });

  } catch (error) {
    console.error('Erreur reset password:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// RENVOYER L'EMAIL DE VÉRIFICATION
// ===========================================

router.post('/resend-verification', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Compte déjà vérifié' });
    }

    // Générer un nouveau token
    const verificationToken = tokenService.generateEmailVerificationToken();
    user.emailVerificationToken = tokenService.hashToken(verificationToken);
    await user.save();

    // Renvoyer l'email
    await emailService.sendVerificationEmail(user, verificationToken);

    res.json({ message: 'Email de vérification renvoyé' });

  } catch (error) {
    console.error('Erreur resend verification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// INFORMATIONS UTILISATEUR CONNECTÉ
// ===========================================

router.get('/me', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user._id,
      username: user.username,
      displayName: user.getDisplayName(),
      email: user.email,
      avatar: user.avatar,
      coins: user.coins,
      xcoins: user.xcoins,
      level: user.stats.level,
      xp: user.stats.xp,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      preferences: user.preferences,
      stats: user.stats,
      canClaimDailyBonus: user.canClaimDailyBonus()
    });

  } catch (error) {
    console.error('Erreur get user:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// DÉCONNEXION
// ===========================================

router.post('/logout', ensureAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Déconnexion réussie' });
    });
  });
});

module.exports = router;
