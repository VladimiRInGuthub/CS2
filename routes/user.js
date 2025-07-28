const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Route de vérification de token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Token valide',
    user: {
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar
    }
  });
});

// Route pour obtenir les informations de l'utilisateur (avec JWT)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    avatar: req.user.avatar,
    steamId: req.user.steamId,
    googleId: req.user.googleId
  });
});

// Route pour obtenir les informations de l'utilisateur (avec sessions)
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      steamId: req.user.steamId,
      googleId: req.user.googleId,
      coins: req.user.coins,
      email: req.user.email
    });
  } else {
    res.status(401).json({ message: 'Non authentifié' });
  }
});

// Route pour mettre à jour le profil utilisateur
router.put('/me', (req, res) => {
  if (req.isAuthenticated()) {
    const { username, email, avatar } = req.body;
    
    // Validation des données
    if (username && username.length < 3) {
      return res.status(400).json({ message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' });
    }
    
    if (email && !email.includes('@')) {
      return res.status(400).json({ message: 'Email invalide' });
    }
    
    // Mise à jour des champs autorisés
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    
    User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    )
    .then(updatedUser => {
      res.json({
        id: updatedUser._id,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        steamId: updatedUser.steamId,
        googleId: updatedUser.googleId,
        coins: updatedUser.coins,
        email: updatedUser.email
      });
    })
    .catch(error => {
      console.error('Erreur mise à jour profil:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    });
  } else {
    res.status(401).json({ message: 'Non authentifié' });
  }
});

module.exports = router;