const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
    
    // Niveaux de log
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    
    this.currentLevel = process.env.LOG_LEVEL || 'INFO';
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      pid: process.pid
    };
    
    return JSON.stringify(logEntry);
  }

  writeToFile(filename, message) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, message + '\n');
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.currentLevel];
  }

  error(message, data = {}) {
    if (!this.shouldLog('ERROR')) return;
    
    const formattedMessage = this.formatMessage('ERROR', message, data);
    console.error(`❌ ${message}`, data);
    this.writeToFile('error.log', formattedMessage);
  }

  warn(message, data = {}) {
    if (!this.shouldLog('WARN')) return;
    
    const formattedMessage = this.formatMessage('WARN', message, data);
    console.warn(`⚠️ ${message}`, data);
    this.writeToFile('warn.log', formattedMessage);
  }

  info(message, data = {}) {
    if (!this.shouldLog('INFO')) return;
    
    const formattedMessage = this.formatMessage('INFO', message, data);
    console.log(`ℹ️ ${message}`, data);
    this.writeToFile('info.log', formattedMessage);
  }

  debug(message, data = {}) {
    if (!this.shouldLog('DEBUG')) return;
    
    const formattedMessage = this.formatMessage('DEBUG', message, data);
    console.log(`🐛 ${message}`, data);
    this.writeToFile('debug.log', formattedMessage);
  }

  // Logs spécialisés
  security(message, data = {}) {
    this.warn(`🔒 SECURITY: ${message}`, data);
    this.writeToFile('security.log', this.formatMessage('WARN', `SECURITY: ${message}`, data));
  }

  performance(message, data = {}) {
    this.info(`⚡ PERFORMANCE: ${message}`, data);
    this.writeToFile('performance.log', this.formatMessage('INFO', `PERFORMANCE: ${message}`, data));
  }

  userAction(userId, action, data = {}) {
    this.info(`👤 USER ACTION: ${action}`, { userId, ...data });
    this.writeToFile('user-actions.log', this.formatMessage('INFO', `USER ACTION: ${action}`, { userId, ...data }));
  }

  adminAction(adminId, action, data = {}) {
    this.info(`🔧 ADMIN ACTION: ${action}`, { adminId, ...data });
    this.writeToFile('admin-actions.log', this.formatMessage('INFO', `ADMIN ACTION: ${action}`, { adminId, ...data }));
  }

  apiCall(method, url, statusCode, duration, data = {}) {
    this.debug(`🌐 API CALL: ${method} ${url}`, { statusCode, duration, ...data });
    this.writeToFile('api-calls.log', this.formatMessage('DEBUG', `API CALL: ${method} ${url}`, { statusCode, duration, ...data }));
  }

  // Nettoyer les anciens logs
  cleanupOldLogs() {
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
    const now = Date.now();

    try {
      const files = fs.readdirSync(this.logDir);
      
      files.forEach(file => {
        if (file.endsWith('.log')) {
          const filePath = path.join(this.logDir, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            fs.unlinkSync(filePath);
            this.info(`🗑️ Ancien log supprimé: ${file}`);
          }
        }
      });
    } catch (error) {
      this.error('Erreur nettoyage logs', { error: error.message });
    }
  }

  // Obtenir les statistiques des logs
  getLogStats() {
    try {
      const files = fs.readdirSync(this.logDir);
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        files: {}
      };

      files.forEach(file => {
        if (file.endsWith('.log')) {
          const filePath = path.join(this.logDir, file);
          const fileStats = fs.statSync(filePath);
          
          stats.totalFiles++;
          stats.totalSize += fileStats.size;
          stats.files[file] = {
            size: fileStats.size,
            lastModified: fileStats.mtime,
            lines: this.countLines(filePath)
          };
        }
      });

      return stats;
    } catch (error) {
      this.error('Erreur récupération stats logs', { error: error.message });
      return null;
    }
  }

  countLines(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.split('\n').length - 1;
    } catch (error) {
      return 0;
    }
  }
}

// Instance singleton
const logger = new Logger();

// Nettoyer les anciens logs au démarrage
logger.cleanupOldLogs();

// Nettoyer les logs toutes les 24 heures
setInterval(() => {
  logger.cleanupOldLogs();
}, 24 * 60 * 60 * 1000);

module.exports = logger;
