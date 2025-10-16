const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Server = require('../models/Server');
const User = require('../models/User');

// Middleware pour vérifier l'authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Non authentifié' });
};

// ===========================================
// RÉCUPÉRATION DES SERVEURS
// ===========================================

// Obtenir tous les serveurs actifs
router.get('/', async (req, res) => {
  try {
    const { 
      gameMode, 
      region, 
      status, 
      isOfficial, 
      page = 1, 
      limit = 20,
      sortBy = 'lastActivity',
      sortOrder = 'desc'
    } = req.query;

    // Construire la requête de filtrage
    let query = { status: { $in: ['online', 'starting'] } };
    
    if (gameMode && gameMode !== 'all') {
      query.gameMode = gameMode;
    }
    
    if (region && region !== 'all') {
      query.region = region;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (isOfficial === 'true') {
      query.isOfficial = true;
    }

    // Options de tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [servers, total] = await Promise.all([
      Server.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'username avatar')
        .lean(),
      Server.countDocuments(query)
    ]);

    res.json({
      servers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Erreur get servers:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir un serveur spécifique
router.get('/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId)
      .populate('owner', 'username avatar')
      .lean();

    if (!server) {
      return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    res.json({ server });

  } catch (error) {
    console.error('Erreur get server:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// CRÉATION DE SERVEUR
// ===========================================

// Créer un nouveau serveur
router.post('/', ensureAuthenticated, [
  body('name')
    .notEmpty()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  body('gameMode')
    .isIn(['deathmatch', 'retake', 'surf', 'bhop', 'duel', 'aim', 'kz', 'competitive', 'casual'])
    .withMessage('Mode de jeu invalide'),
  body('map')
    .notEmpty()
    .trim()
    .withMessage('La carte est requise'),
  body('maxPlayers')
    .isInt({ min: 2, max: 32 })
    .withMessage('Le nombre de joueurs doit être entre 2 et 32'),
  body('region')
    .isIn(['Europe', 'North America', 'Asia', 'South America', 'Oceania'])
    .withMessage('Région invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const {
      name,
      description,
      gameMode,
      map,
      maxPlayers,
      rounds,
      duration,
      allowedWeapons,
      bots,
      password,
      isPublic,
      region
    } = req.body;

    // Vérifier le nombre de serveurs de l'utilisateur
    const userServers = await Server.countDocuments({ owner: req.user._id });
    const maxServersPerUser = parseInt(process.env.MAX_SERVERS_PER_USER) || 3;
    
    if (userServers >= maxServersPerUser) {
      return res.status(400).json({ 
        error: 'Limite de serveurs atteinte',
        maxServers: maxServersPerUser
      });
    }

    // Créer le serveur
    const server = new Server({
      name,
      description: description || '',
      owner: req.user._id,
      ownerUsername: req.user.username,
      gameMode,
      map,
      maxPlayers,
      rounds: rounds || 30,
      duration: duration || 30,
      allowedWeapons: allowedWeapons || ['all'],
      bots: bots || 0,
      password: password || '',
      isPublic: isPublic !== false, // Par défaut public
      region: region || 'Europe',
      status: 'offline',
      skinchangerEnabled: true
    });

    await server.save();

    // Populate pour la réponse
    await server.populate('owner', 'username avatar');

    res.status(201).json({
      message: 'Serveur créé avec succès',
      server
    });

  } catch (error) {
    console.error('Erreur création serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// MODIFICATION DE SERVEUR
// ===========================================

// Modifier un serveur
router.put('/:serverId', ensureAuthenticated, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  body('gameMode')
    .optional()
    .isIn(['deathmatch', 'retake', 'surf', 'bhop', 'duel', 'aim', 'kz', 'competitive', 'casual'])
    .withMessage('Mode de jeu invalide'),
  body('maxPlayers')
    .optional()
    .isInt({ min: 2, max: 32 })
    .withMessage('Le nombre de joueurs doit être entre 2 et 32')
], async (req, res) => {
  try {
    const { serverId } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: errors.array() 
      });
    }

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire ou admin
    if (server.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Mettre à jour les champs autorisés
    const allowedFields = [
      'name', 'description', 'gameMode', 'map', 'maxPlayers', 
      'rounds', 'duration', 'allowedWeapons', 'bots', 'password', 
      'isPublic', 'region', 'skinchangerEnabled'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        server[field] = req.body[field];
      }
    });

    await server.save();
    await server.populate('owner', 'username avatar');

    res.json({
      message: 'Serveur modifié avec succès',
      server
    });

  } catch (error) {
    console.error('Erreur modification serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// SUPPRESSION DE SERVEUR
// ===========================================

// Supprimer un serveur
router.delete('/:serverId', ensureAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire ou admin
    if (server.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await Server.findByIdAndDelete(serverId);

    res.json({ message: 'Serveur supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// GESTION DU STATUT DES SERVEURS
// ===========================================

// Démarrer un serveur
router.post('/:serverId/start', ensureAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire ou admin
    if (server.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    if (server.status === 'online') {
      return res.status(400).json({ error: 'Serveur déjà en ligne' });
    }

    // Simuler le démarrage (dans un vrai projet, ceci appellerait l'API du serveur de jeu)
    server.status = 'starting';
    server.lastActivity = new Date();
    await server.save();

    // Simuler le passage en ligne après 5 secondes
    setTimeout(async () => {
      try {
        const updatedServer = await Server.findById(serverId);
        if (updatedServer) {
          updatedServer.status = 'online';
          updatedServer.currentPlayers = Math.floor(Math.random() * updatedServer.maxPlayers);
          updatedServer.ping = Math.floor(Math.random() * 50) + 10;
          await updatedServer.save();
        }
      } catch (error) {
        console.error('Erreur mise à jour statut serveur:', error);
      }
    }, 5000);

    res.json({ 
      message: 'Serveur en cours de démarrage',
      server 
    });

  } catch (error) {
    console.error('Erreur démarrage serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Arrêter un serveur
router.post('/:serverId/stop', ensureAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire ou admin
    if (server.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    server.status = 'offline';
    server.currentPlayers = 0;
    server.lastActivity = new Date();
    await server.save();

    res.json({ 
      message: 'Serveur arrêté',
      server 
    });

  } catch (error) {
    console.error('Erreur arrêt serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// STATISTIQUES DES SERVEURS
// ===========================================

// Obtenir les statistiques d'un serveur
router.get('/:serverId/stats', async (req, res) => {
  try {
    const { serverId } = req.params;

    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: 'Serveur non trouvé' });
    }

    res.json({ stats: server.stats });

  } catch (error) {
    console.error('Erreur get server stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Obtenir les statistiques globales
router.get('/stats/global', async (req, res) => {
  try {
    const totalServers = await Server.countDocuments();
    const onlineServers = await Server.countDocuments({ status: 'online' });
    const totalPlayers = await Server.aggregate([
      { $match: { status: 'online' } },
      { $group: { _id: null, total: { $sum: '$currentPlayers' } } }
    ]);

    const players = totalPlayers.length > 0 ? totalPlayers[0].total : 0;

    // Serveurs par mode de jeu
    const serversByMode = await Server.aggregate([
      { $match: { status: 'online' } },
      { $group: { _id: '$gameMode', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Serveurs par région
    const serversByRegion = await Server.aggregate([
      { $match: { status: 'online' } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalServers,
      onlineServers,
      totalPlayers: players,
      serversByMode,
      serversByRegion
    });

  } catch (error) {
    console.error('Erreur get global stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===========================================
// SERVEURS DE L'UTILISATEUR
// ===========================================

// Obtenir les serveurs de l'utilisateur
router.get('/user/my-servers', ensureAuthenticated, async (req, res) => {
  try {
    const servers = await Server.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('owner', 'username avatar')
      .lean();

    res.json({ servers });

  } catch (error) {
    console.error('Erreur get user servers:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
