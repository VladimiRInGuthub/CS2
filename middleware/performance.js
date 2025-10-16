const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cacheManager = require('../utils/cache');

// Configuration de sécurité avec Helmet
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Pour permettre les intégrations tierces
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Compression gzip
const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Niveau de compression optimal
  threshold: 1024, // Compresser seulement les fichiers > 1KB
});

// Rate limiting général
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limite de 1000 requêtes par IP par fenêtre
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Trop de requêtes',
      message: 'Vous avez dépassé la limite de requêtes. Veuillez réessayer dans 15 minutes.',
      retryAfter: 15 * 60
    });
  }
});

// Rate limiting pour l'authentification
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limite de 10 tentatives de connexion par IP
  message: {
    error: 'Trop de tentatives de connexion',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne pas compter les connexions réussies
  handler: (req, res) => {
    res.status(429).json({
      error: 'Trop de tentatives de connexion',
      message: 'Vous avez dépassé la limite de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
      retryAfter: 15 * 60
    });
  }
});

// Rate limiting pour les API
const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limite de 100 requêtes API par minute
  message: {
    error: 'Limite API dépassée',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Limite API dépassée',
      message: 'Vous avez dépassé la limite de requêtes API. Veuillez réessayer dans 1 minute.',
      retryAfter: 60
    });
  }
});

// Rate limiting pour les actions coûteuses
const expensiveActionRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limite de 20 actions coûteuses par IP
  message: {
    error: 'Limite d\'actions dépassée',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Limite d\'actions dépassée',
      message: 'Vous avez dépassé la limite d\'actions. Veuillez réessayer dans 5 minutes.',
      retryAfter: 5 * 60
    });
  }
});

// Middleware de cache intelligent
const smartCacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    // Ne pas mettre en cache les requêtes POST, PUT, DELETE
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return next();
    }

    // Ne pas mettre en cache les requêtes d'administration
    if (req.path.startsWith('/api/admin')) {
      return next();
    }

    // Ne pas mettre en cache les requêtes d'authentification
    if (req.path.startsWith('/auth')) {
      return next();
    }

    // Générer une clé de cache basée sur l'URL et l'utilisateur
    const userId = req.user?.id || 'anonymous';
    const cacheKey = `route:${req.method}:${req.originalUrl}:${userId}`;
    
    try {
      // Essayer de récupérer depuis le cache
      const cachedResponse = await cacheManager.get(cacheKey);
      if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }

      // Intercepter la réponse pour la mettre en cache
      const originalJson = res.json;
      res.json = function(data) {
        // Mettre en cache seulement les réponses réussies
        if (res.statusCode === 200 && data) {
          cacheManager.set(cacheKey, data, ttl);
          res.set('X-Cache', 'MISS');
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Erreur middleware cache:', error);
      next();
    }
  };
};

// Middleware de validation des entrées
const inputValidationMiddleware = (req, res, next) => {
  // Nettoyer les entrées pour éviter les injections
  const cleanInput = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'string') {
          // Nettoyer les chaînes de caractères
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
        } else if (typeof obj[key] === 'object') {
          cleanInput(obj[key]);
        }
      }
    }
  };

  if (req.body) {
    cleanInput(req.body);
  }
  if (req.query) {
    cleanInput(req.query);
  }
  if (req.params) {
    cleanInput(req.params);
  }

  next();
};

// Middleware de logging des performances
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    };

    // Logger seulement les requêtes lentes ou les erreurs
    if (duration > 1000 || res.statusCode >= 400) {
      console.log('🐌 Requête lente ou erreur:', logData);
    }

    // Logger les requêtes d'administration
    if (req.path.startsWith('/api/admin')) {
      console.log('🔧 Requête admin:', logData);
    }
  });

  next();
};

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur serveur:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Ne pas exposer les détails d'erreur en production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Erreur serveur',
    message: isDevelopment ? err.message : 'Une erreur est survenue',
    ...(isDevelopment && { stack: err.stack })
  });
};

// Middleware de maintenance
const maintenanceMiddleware = (req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({
      error: 'Maintenance en cours',
      message: 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
      estimatedTime: process.env.MAINTENANCE_ETA || '30 minutes'
    });
  }
  next();
};

module.exports = {
  securityMiddleware,
  compressionMiddleware,
  generalRateLimit,
  authRateLimit,
  apiRateLimit,
  expensiveActionRateLimit,
  smartCacheMiddleware,
  inputValidationMiddleware,
  performanceMiddleware,
  errorHandler,
  maintenanceMiddleware
};
