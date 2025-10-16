const Server = require('../models/Server');
const Notification = require('../models/Notification');

class ServerCleanup {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutes
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Service de nettoyage des serveurs déjà en cours');
      return;
    }

    console.log('🚀 Démarrage du service de nettoyage des serveurs...');
    this.isRunning = true;
    
    // Exécuter immédiatement
    this.performCleanup();
    
    // Puis toutes les 5 minutes
    this.intervalId = setInterval(() => {
      this.performCleanup();
    }, this.cleanupInterval);
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️  Service de nettoyage des serveurs déjà arrêté');
      return;
    }

    console.log('🛑 Arrêt du service de nettoyage des serveurs...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async performCleanup() {
    try {
      console.log('🧹 Nettoyage des serveurs en cours...');
      
      const now = new Date();
      const cleanupStats = {
        serversStopped: 0,
        serversDeleted: 0,
        notificationsSent: 0
      };

      // 1. Arrêter les serveurs inactifs
      const inactiveServers = await Server.find({
        status: { $in: ['online', 'starting'] },
        lastActivity: { $lt: new Date(now.getTime() - 30 * 60 * 1000) } // 30 minutes d'inactivité
      });

      for (const server of inactiveServers) {
        server.status = 'stopping';
        server.lastActivity = now;
        await server.save();
        
        cleanupStats.serversStopped++;
        
        // Notifier le propriétaire
        await Notification.createNotification(
          server.owner,
          'server_auto_stopped',
          'Serveur arrêté automatiquement',
          `Votre serveur "${server.name}" a été arrêté automatiquement après 30 minutes d'inactivité.`,
          { serverId: server._id, serverName: server.name },
          'medium'
        );
        
        cleanupStats.notificationsSent++;
      }

      // 2. Supprimer les serveurs arrêtés depuis plus de 24h
      const oldStoppedServers = await Server.find({
        status: 'offline',
        updatedAt: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } // 24 heures
      });

      for (const server of oldStoppedServers) {
        // Notifier le propriétaire avant suppression
        await Notification.createNotification(
          server.owner,
          'server_deleted',
          'Serveur supprimé automatiquement',
          `Votre serveur "${server.name}" a été supprimé automatiquement après 24 heures d'inactivité.`,
          { serverId: server._id, serverName: server.name },
          'medium'
        );
        
        await Server.findByIdAndDelete(server._id);
        cleanupStats.serversDeleted++;
        cleanupStats.notificationsSent++;
      }

      // 3. Nettoyer les serveurs avec auto-cleanup activé
      const autoCleanupServers = await Server.find({
        'autoCleanup.enabled': true,
        status: { $in: ['online', 'starting'] },
        lastActivity: { 
          $lt: new Date(now.getTime() - server.autoCleanup.idleTimeoutMinutes * 60 * 1000)
        }
      });

      for (const server of autoCleanupServers) {
        server.status = 'stopping';
        server.lastActivity = now;
        await server.save();
        
        cleanupStats.serversStopped++;
        
        await Notification.createNotification(
          server.owner,
          'server_auto_stopped',
          'Serveur arrêté automatiquement',
          `Votre serveur "${server.name}" a été arrêté automatiquement selon vos paramètres d'auto-cleanup.`,
          { serverId: server._id, serverName: server.name },
          'medium'
        );
        
        cleanupStats.notificationsSent++;
      }

      // 4. Mettre à jour les statistiques des serveurs
      await this.updateServerStats();

      if (cleanupStats.serversStopped > 0 || cleanupStats.serversDeleted > 0) {
        console.log(`✅ Nettoyage terminé: ${cleanupStats.serversStopped} serveurs arrêtés, ${cleanupStats.serversDeleted} serveurs supprimés, ${cleanupStats.notificationsSent} notifications envoyées`);
      }

    } catch (error) {
      console.error('❌ Erreur lors du nettoyage des serveurs:', error);
    }
  }

  async updateServerStats() {
    try {
      const stats = await Server.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalServers = await Server.countDocuments();
      const onlineServers = await Server.countDocuments({ status: 'online' });
      const offlineServers = await Server.countDocuments({ status: 'offline' });

      console.log(`📊 Statistiques serveurs: ${totalServers} total, ${onlineServers} en ligne, ${offlineServers} hors ligne`);
    } catch (error) {
      console.error('Erreur mise à jour stats serveurs:', error);
    }
  }

  // Méthode pour forcer le nettoyage manuel
  async forceCleanup() {
    console.log('🔧 Nettoyage forcé des serveurs...');
    await this.performCleanup();
  }

  // Méthode pour obtenir les statistiques
  async getStats() {
    try {
      const totalServers = await Server.countDocuments();
      const onlineServers = await Server.countDocuments({ status: 'online' });
      const offlineServers = await Server.countDocuments({ status: 'offline' });
      const startingServers = await Server.countDocuments({ status: 'starting' });
      const stoppingServers = await Server.countDocuments({ status: 'stopping' });

      return {
        total: totalServers,
        online: onlineServers,
        offline: offlineServers,
        starting: startingServers,
        stopping: stoppingServers,
        isRunning: this.isRunning
      };
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      return null;
    }
  }
}

// Instance singleton
const serverCleanup = new ServerCleanup();

module.exports = serverCleanup;