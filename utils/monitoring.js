const os = require('os');
const logger = require('./logger');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0,
        responseTimes: []
      },
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      cpu: {
        usage: 0,
        loadAverage: []
      },
      database: {
        connections: 0,
        queries: 0,
        slowQueries: 0,
        averageQueryTime: 0
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0
      }
    };

    this.startTime = Date.now();
    this.intervalId = null;
    
    this.startMonitoring();
  }

  startMonitoring() {
    // Collecter les métriques toutes les 30 secondes
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, 30000);

    logger.info('📊 Monitoring des performances démarré');
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    logger.info('📊 Monitoring des performances arrêté');
  }

  collectMetrics() {
    try {
      // Métriques mémoire
      const memUsage = process.memoryUsage();
      this.metrics.memory = {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      };

      // Métriques CPU
      const loadAvg = os.loadavg();
      this.metrics.cpu = {
        usage: process.cpuUsage(),
        loadAverage: loadAvg
      };

      // Calculer le taux de succès des requêtes
      const successRate = this.metrics.requests.total > 0 ? 
        (this.metrics.requests.successful / this.metrics.requests.total) * 100 : 0;

      // Calculer le temps de réponse moyen
      if (this.metrics.requests.responseTimes.length > 0) {
        this.metrics.requests.averageResponseTime = 
          this.metrics.requests.responseTimes.reduce((a, b) => a + b, 0) / 
          this.metrics.requests.responseTimes.length;
      }

      // Calculer le taux de hit du cache
      const totalCacheRequests = this.metrics.cache.hits + this.metrics.cache.misses;
      this.metrics.cache.hitRate = totalCacheRequests > 0 ? 
        (this.metrics.cache.hits / totalCacheRequests) * 100 : 0;

      // Logger les métriques importantes
      this.logMetrics();

      // Alerter si les métriques sont critiques
      this.checkCriticalMetrics();

    } catch (error) {
      logger.error('Erreur collecte métriques', { error: error.message });
    }
  }

  logMetrics() {
    logger.performance('Métriques système', {
      uptime: Math.round((Date.now() - this.startTime) / 1000 / 60), // minutes
      memory: this.metrics.memory,
      cpu: {
        loadAverage: this.metrics.cpu.loadAverage[0] // 1 minute load average
      },
      requests: {
        total: this.metrics.requests.total,
        successRate: this.metrics.requests.total > 0 ? 
          (this.metrics.requests.successful / this.metrics.requests.total) * 100 : 0,
        averageResponseTime: Math.round(this.metrics.requests.averageResponseTime)
      },
      cache: {
        hitRate: Math.round(this.metrics.cache.hitRate)
      }
    });
  }

  checkCriticalMetrics() {
    // Alerter si la mémoire est trop élevée
    if (this.metrics.memory.percentage > 90) {
      logger.warn('🚨 Utilisation mémoire critique', {
        percentage: this.metrics.memory.percentage,
        used: this.metrics.memory.used,
        total: this.metrics.memory.total
      });
    }

    // Alerter si le load average est trop élevé
    if (this.metrics.cpu.loadAverage[0] > os.cpus().length * 2) {
      logger.warn('🚨 Charge CPU critique', {
        loadAverage: this.metrics.cpu.loadAverage[0],
        cpuCount: os.cpus().length
      });
    }

    // Alerter si le taux de succès est trop bas
    const successRate = this.metrics.requests.total > 0 ? 
      (this.metrics.requests.successful / this.metrics.requests.total) * 100 : 100;
    
    if (successRate < 95) {
      logger.warn('🚨 Taux de succès des requêtes faible', {
        successRate: Math.round(successRate),
        total: this.metrics.requests.total,
        failed: this.metrics.requests.failed
      });
    }

    // Alerter si le temps de réponse moyen est trop élevé
    if (this.metrics.requests.averageResponseTime > 2000) {
      logger.warn('🚨 Temps de réponse moyen élevé', {
        averageResponseTime: Math.round(this.metrics.requests.averageResponseTime),
        totalRequests: this.metrics.requests.total
      });
    }
  }

  // Enregistrer une requête
  recordRequest(responseTime, success = true) {
    this.metrics.requests.total++;
    
    if (success) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }

    // Garder seulement les 1000 derniers temps de réponse
    this.metrics.requests.responseTimes.push(responseTime);
    if (this.metrics.requests.responseTimes.length > 1000) {
      this.metrics.requests.responseTimes.shift();
    }
  }

  // Enregistrer une requête de cache
  recordCacheRequest(hit = true) {
    if (hit) {
      this.metrics.cache.hits++;
    } else {
      this.metrics.cache.misses++;
    }
  }

  // Enregistrer une requête de base de données
  recordDatabaseQuery(queryTime, isSlow = false) {
    this.metrics.database.queries++;
    
    if (isSlow) {
      this.metrics.database.slowQueries++;
    }

    // Calculer le temps moyen des requêtes
    const totalQueries = this.metrics.database.queries;
    this.metrics.database.averageQueryTime = 
      ((this.metrics.database.averageQueryTime * (totalQueries - 1)) + queryTime) / totalQueries;
  }

  // Obtenir les métriques actuelles
  getMetrics() {
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString()
    };
  }

  // Obtenir les métriques formatées pour l'admin
  getFormattedMetrics() {
    const uptime = Date.now() - this.startTime;
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    return {
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      memory: {
        used: `${this.metrics.memory.used} MB`,
        total: `${this.metrics.memory.total} MB`,
        percentage: `${this.metrics.memory.percentage}%`
      },
      cpu: {
        loadAverage: this.metrics.cpu.loadAverage[0].toFixed(2)
      },
      requests: {
        total: this.metrics.requests.total.toLocaleString(),
        successful: this.metrics.requests.successful.toLocaleString(),
        failed: this.metrics.requests.failed.toLocaleString(),
        successRate: this.metrics.requests.total > 0 ? 
          `${((this.metrics.requests.successful / this.metrics.requests.total) * 100).toFixed(1)}%` : '100%',
        averageResponseTime: `${Math.round(this.metrics.requests.averageResponseTime)}ms`
      },
      database: {
        queries: this.metrics.database.queries.toLocaleString(),
        slowQueries: this.metrics.database.slowQueries.toLocaleString(),
        averageQueryTime: `${Math.round(this.metrics.database.averageQueryTime)}ms`
      },
      cache: {
        hits: this.metrics.cache.hits.toLocaleString(),
        misses: this.metrics.cache.misses.toLocaleString(),
        hitRate: `${this.metrics.cache.hitRate.toFixed(1)}%`
      }
    };
  }

  // Réinitialiser les métriques
  resetMetrics() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageResponseTime: 0,
        responseTimes: []
      },
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      cpu: {
        usage: 0,
        loadAverage: []
      },
      database: {
        connections: 0,
        queries: 0,
        slowQueries: 0,
        averageQueryTime: 0
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0
      }
    };
    
    logger.info('📊 Métriques réinitialisées');
  }
}

// Instance singleton
const performanceMonitor = new PerformanceMonitor();

// Middleware pour enregistrer les requêtes
const requestMonitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const success = res.statusCode < 400;
    
    performanceMonitor.recordRequest(responseTime, success);
    
    // Logger les requêtes lentes
    if (responseTime > 1000) {
      logger.performance('Requête lente détectée', {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }
  });

  next();
};

module.exports = {
  performanceMonitor,
  requestMonitoringMiddleware
};
