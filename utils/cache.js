const NodeCache = require('node-cache');
const redis = require('redis');

class CacheManager {
  constructor() {
    // Cache en mémoire pour les données fréquemment utilisées
    this.memoryCache = new NodeCache({
      stdTTL: 300, // 5 minutes par défaut
      checkperiod: 60, // Vérification toutes les minutes
      useClones: false // Performance optimisée
    });

    // Cache Redis pour les données partagées (si disponible)
    this.redisClient = null;
    this.redisEnabled = false;
    
    this.initializeRedis();
  }

  async initializeRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redisClient = redis.createClient({
          url: process.env.REDIS_URL
        });
        
        await this.redisClient.connect();
        this.redisEnabled = true;
        console.log('✅ Redis connecté pour le cache distribué');
      } else {
        console.log('⚠️ Redis non configuré - utilisation du cache mémoire uniquement');
      }
    } catch (error) {
      console.warn('⚠️ Erreur connexion Redis:', error.message);
      this.redisEnabled = false;
    }
  }

  // Générer une clé de cache
  generateKey(prefix, identifier) {
    return `${prefix}:${identifier}`;
  }

  // Obtenir une valeur du cache
  async get(key) {
    try {
      // Essayer d'abord le cache mémoire
      let value = this.memoryCache.get(key);
      if (value !== undefined) {
        return value;
      }

      // Si Redis est disponible, essayer Redis
      if (this.redisEnabled && this.redisClient) {
        const redisValue = await this.redisClient.get(key);
        if (redisValue) {
          const parsedValue = JSON.parse(redisValue);
          // Mettre en cache mémoire pour les prochaines requêtes
          this.memoryCache.set(key, parsedValue);
          return parsedValue;
        }
      }

      return null;
    } catch (error) {
      console.error('Erreur récupération cache:', error);
      return null;
    }
  }

  // Définir une valeur dans le cache
  async set(key, value, ttl = 300) {
    try {
      // Mettre en cache mémoire
      this.memoryCache.set(key, value, ttl);

      // Si Redis est disponible, mettre en cache Redis
      if (this.redisEnabled && this.redisClient) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(value));
      }

      return true;
    } catch (error) {
      console.error('Erreur mise en cache:', error);
      return false;
    }
  }

  // Supprimer une valeur du cache
  async del(key) {
    try {
      // Supprimer du cache mémoire
      this.memoryCache.del(key);

      // Si Redis est disponible, supprimer de Redis
      if (this.redisEnabled && this.redisClient) {
        await this.redisClient.del(key);
      }

      return true;
    } catch (error) {
      console.error('Erreur suppression cache:', error);
      return false;
    }
  }

  // Vider tout le cache
  async flush() {
    try {
      // Vider le cache mémoire
      this.memoryCache.flushAll();

      // Si Redis est disponible, vider Redis
      if (this.redisEnabled && this.redisClient) {
        await this.redisClient.flushAll();
      }

      return true;
    } catch (error) {
      console.error('Erreur vidage cache:', error);
      return false;
    }
  }

  // Obtenir les statistiques du cache
  getStats() {
    const memoryStats = this.memoryCache.getStats();
    
    return {
      memory: {
        keys: memoryStats.keys,
        hits: memoryStats.hits,
        misses: memoryStats.misses,
        hitRate: memoryStats.hits / (memoryStats.hits + memoryStats.misses) || 0
      },
      redis: {
        enabled: this.redisEnabled,
        connected: this.redisEnabled && this.redisClient?.isOpen
      }
    };
  }

  // Méthodes spécialisées pour les données fréquentes
  async getGlobalStats() {
    return await this.get('global:stats');
  }

  async setGlobalStats(stats, ttl = 300) {
    return await this.set('global:stats', stats, ttl);
  }

  async getUserStats(userId) {
    return await this.get(this.generateKey('user:stats', userId));
  }

  async setUserStats(userId, stats, ttl = 600) {
    return await this.set(this.generateKey('user:stats', userId), stats, ttl);
  }

  async getCases() {
    return await this.get('cases:all');
  }

  async setCases(cases, ttl = 1800) {
    return await this.set('cases:all', cases, ttl);
  }

  async getServers() {
    return await this.get('servers:all');
  }

  async setServers(servers, ttl = 30) {
    return await this.set('servers:all', servers, ttl);
  }

  async getLeaderboard(type) {
    return await this.get(this.generateKey('leaderboard', type));
  }

  async setLeaderboard(type, data, ttl = 300) {
    return await this.set(this.generateKey('leaderboard', type), data, ttl);
  }

  async getBattlepass() {
    return await this.get('battlepass:active');
  }

  async setBattlepass(battlepass, ttl = 600) {
    return await this.set('battlepass:active', battlepass, ttl);
  }

  // Invalider les caches liés à un utilisateur
  async invalidateUserCache(userId) {
    const keys = [
      this.generateKey('user:stats', userId),
      this.generateKey('leaderboard', 'level'),
      this.generateKey('leaderboard', 'xp'),
      this.generateKey('leaderboard', 'cases'),
      this.generateKey('leaderboard', 'skins')
    ];

    for (const key of keys) {
      await this.del(key);
    }
  }

  // Invalider les caches globaux
  async invalidateGlobalCache() {
    const keys = [
      'global:stats',
      'cases:all',
      'servers:all',
      'battlepass:active'
    ];

    for (const key of keys) {
      await this.del(key);
    }
  }

  // Middleware pour le cache automatique
  cacheMiddleware(ttl = 300) {
    return async (req, res, next) => {
      // Générer une clé de cache basée sur l'URL et les paramètres
      const cacheKey = `route:${req.method}:${req.originalUrl}`;
      
      // Essayer de récupérer depuis le cache
      const cachedResponse = await this.get(cacheKey);
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Intercepter la réponse pour la mettre en cache
      const originalJson = res.json;
      res.json = function(data) {
        // Mettre en cache seulement les réponses réussies
        if (res.statusCode === 200) {
          cacheManager.set(cacheKey, data, ttl);
        }
        return originalJson.call(this, data);
      };

      next();
    };
  }

  // Nettoyer les caches expirés
  async cleanup() {
    try {
      // Le cache mémoire se nettoie automatiquement
      // Pour Redis, on peut ajouter une logique de nettoyage si nécessaire
      console.log('🧹 Nettoyage du cache terminé');
    } catch (error) {
      console.error('Erreur nettoyage cache:', error);
    }
  }

  // Fermer les connexions
  async close() {
    try {
      if (this.redisEnabled && this.redisClient) {
        await this.redisClient.quit();
      }
      console.log('✅ Connexions cache fermées');
    } catch (error) {
      console.error('Erreur fermeture cache:', error);
    }
  }
}

// Instance singleton
const cacheManager = new CacheManager();

module.exports = cacheManager;
