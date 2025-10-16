const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier l'authentification
const ensureAuthenticated = async (req, res, next) => {
  try {
    // Vérifier la session Passport
    if (req.isAuthenticated()) {
      req.user = req.user;
      return next();
    }

    // Vérifier le token JWT dans les headers (pour les API calls)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
          return res.status(401).json({ message: 'Token invalide' });
        }
        
        req.user = user;
        return next();
      } catch (jwtError) {
        return res.status(401).json({ message: 'Token invalide' });
      }
    }

    // Aucune authentification trouvée
    return res.status(401).json({ message: 'Authentification requise' });
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour vérifier les droits administrateur
const ensureAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Droits administrateur requis' });
    }

    next();
  } catch (error) {
    console.error('Erreur middleware admin:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour vérifier si l'utilisateur est banni
const checkBanStatus = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    if (req.user.isBanned) {
      const now = new Date();
      if (req.user.banExpires && req.user.banExpires > now) {
        return res.status(403).json({ 
          message: 'Compte suspendu',
          reason: req.user.banReason,
          expiresAt: req.user.banExpires
        });
      } else if (req.user.banExpires && req.user.banExpires <= now) {
        // Le bannissement a expiré, le réactiver
        req.user.isBanned = false;
        req.user.banReason = undefined;
        req.user.banExpires = undefined;
        await req.user.save();
      }
    }

    next();
  } catch (error) {
    console.error('Erreur middleware ban check:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour logger l'activité utilisateur
const logUserActivity = async (req, res, next) => {
  try {
    if (req.user) {
      // Mettre à jour la dernière activité
      req.user.lastActivity = new Date();
      
      // Ajouter à l'historique de connexion
      const loginEntry = {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      };
      
      req.user.loginHistory = req.user.loginHistory || [];
      req.user.loginHistory.unshift(loginEntry);
      
      // Garder seulement les 10 dernières entrées
      if (req.user.loginHistory.length > 10) {
        req.user.loginHistory = req.user.loginHistory.slice(0, 10);
      }
      
      // Sauvegarder de manière asynchrone pour ne pas bloquer la requête
      req.user.save().catch(err => console.error('Erreur sauvegarde activité:', err));
    }
    
    next();
  } catch (error) {
    console.error('Erreur middleware log activity:', error);
    next(); // Continuer même en cas d'erreur
  }
};

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
  checkBanStatus,
  logUserActivity
};
