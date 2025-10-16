const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting pour différentes actions
const createRateLimiters = () => {
  return {
    // Rate limiting général
    general: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // 1000 requêtes par IP
      message: {
        error: 'Trop de requêtes',
        message: 'Vous avez dépassé la limite de requêtes. Veuillez réessayer dans 15 minutes.',
        retryAfter: 15 * 60
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
    }),

    // Rate limiting pour l'authentification
    auth: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // 10 tentatives de connexion
      message: {
        error: 'Trop de tentatives de connexion',
        message: 'Vous avez dépassé la limite de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
        retryAfter: 15 * 60
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true,
      handler: (req, res) => {
        res.status(429).json({
          error: 'Trop de tentatives de connexion',
          message: 'Vous avez dépassé la limite de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
          retryAfter: 15 * 60
        });
      }
    }),

    // Rate limiting pour les actions coûteuses
    expensive: rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 20, // 20 actions coûteuses
      message: {
        error: 'Limite d\'actions dépassée',
        message: 'Vous avez dépassé la limite d\'actions. Veuillez réessayer dans 5 minutes.',
        retryAfter: 5 * 60
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
    }),

    // Rate limiting pour les API
    api: rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 100, // 100 requêtes API par minute
      message: {
        error: 'Limite API dépassée',
        message: 'Vous avez dépassé la limite de requêtes API. Veuillez réessayer dans 1 minute.',
        retryAfter: 60
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
    })
  };
};

// Configuration de sécurité Helmet
const createSecurityConfig = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com"
        ],
        fontSrc: [
          "'self'", 
          "https://fonts.gstatic.com",
          "data:"
        ],
        imgSrc: [
          "'self'", 
          "data:", 
          "https:", 
          "blob:",
          "https://steamcommunity-a.akamaihd.net",
          "https://ui-avatars.com"
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Nécessaire pour React
          "https://js.stripe.com"
        ],
        connectSrc: [
          "'self'", 
          "https://api.stripe.com",
          "https://csgoskins.gg"
        ],
        frameSrc: [
          "'self'", 
          "https://js.stripe.com"
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: { action: 'deny' },
    xssFilter: true
  });
};

// Validation des entrées
const createValidators = () => {
  return {
    // Validation pour l'inscription
    register: [
      body('username')
        .isLength({ min: 3, max: 50 })
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
      body('email')
        .isEmail()
        .withMessage('Veuillez entrer un email valide')
        .normalizeEmail(),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial')
    ],

    // Validation pour la connexion
    login: [
      body('email')
        .isEmail()
        .withMessage('Veuillez entrer un email valide')
        .normalizeEmail(),
      body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
    ],

    // Validation pour les IDs MongoDB
    mongoId: [
      param('id')
        .isMongoId()
        .withMessage('ID invalide')
    ],

    // Validation pour les requêtes de pagination
    pagination: [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Le numéro de page doit être un entier positif'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('La limite doit être un entier entre 1 et 100')
    ],

    // Validation pour les Xcoins
    xcoins: [
      body('amount')
        .isInt({ min: 1, max: 1000000 })
        .withMessage('Le montant doit être un entier entre 1 et 1 000 000')
    ],

    // Validation pour les cases
    case: [
      body('name')
        .isLength({ min: 3, max: 100 })
        .withMessage('Le nom de la case doit contenir entre 3 et 100 caractères')
        .trim(),
      body('description')
        .isLength({ min: 10, max: 500 })
        .withMessage('La description doit contenir entre 10 et 500 caractères')
        .trim(),
      body('price')
        .isInt({ min: 1, max: 100000 })
        .withMessage('Le prix doit être un entier entre 1 et 100 000')
    ],

    // Validation pour les serveurs
    server: [
      body('name')
        .isLength({ min: 3, max: 100 })
        .withMessage('Le nom du serveur doit contenir entre 3 et 100 caractères')
        .trim(),
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La description ne peut pas dépasser 500 caractères')
        .trim(),
      body('maxPlayers')
        .isInt({ min: 2, max: 64 })
        .withMessage('Le nombre maximum de joueurs doit être entre 2 et 64')
    ]
  };
};

// Middleware de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: 'Les données fournies ne sont pas valides',
      details: errors.array()
    });
  }
  next();
};

// Middleware de sanitization
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          // Nettoyer les chaînes de caractères
          obj[key] = obj[key]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:text\/html/gi, '')
            .replace(/vbscript:/gi, '')
            .trim();
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

// Middleware de vérification CSRF (simplifié)
const csrfProtection = (req, res, next) => {
  // Pour les requêtes POST, PUT, DELETE
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session.csrfToken;

    if (!token || !sessionToken || token !== sessionToken) {
      return res.status(403).json({
        error: 'Token CSRF invalide',
        message: 'Votre session a expiré. Veuillez recharger la page.'
      });
    }
  }

  next();
};

// Middleware de génération de token CSRF
const generateCSRFToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

// Middleware de vérification des permissions
const checkPermissions = (requiredPermissions = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Vous devez être connecté pour accéder à cette ressource.'
      });
    }

    // Vérifier si l'utilisateur est banni
    if (req.user.isBanned) {
      return res.status(403).json({
        error: 'Compte suspendu',
        message: 'Votre compte a été suspendu. Contactez le support pour plus d\'informations.',
        banReason: req.user.banReason,
        banExpires: req.user.banExpires
      });
    }

    // Vérifier les permissions spécifiques
    if (requiredPermissions.length > 0) {
      const userPermissions = req.user.permissions || [];
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission) || req.user.isAdmin
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Permissions insuffisantes',
          message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.'
        });
      }
    }

    next();
  };
};

// Middleware de logging de sécurité
const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    };

    // Logger les tentatives suspectes
    if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 429) {
      console.warn('🚨 Tentative suspecte:', logData);
    }

    // Logger les erreurs serveur
    if (res.statusCode >= 500) {
      console.error('💥 Erreur serveur:', logData);
    }

    // Logger les actions d'administration
    if (req.path.startsWith('/api/admin')) {
      console.log('🔧 Action admin:', logData);
    }
  });

  next();
};

module.exports = {
  createRateLimiters,
  createSecurityConfig,
  createValidators,
  validate,
  sanitizeInput,
  csrfProtection,
  generateCSRFToken,
  checkPermissions,
  securityLogger
};
