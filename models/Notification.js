const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'case_opened',
      'skin_obtained',
      'server_created',
      'server_joined',
      'achievement_unlocked',
      'daily_bonus',
      'payment_success',
      'admin_message',
      'system_update',
      'friend_request',
      'trade_offer',
      'level_up',
      'battlepass_tier',
      'premium_expired',
      'security_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours par défaut
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les performances
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthode statique pour créer une notification
NotificationSchema.statics.createNotification = async function(userId, type, title, message, data = {}, priority = 'medium') {
  try {
    const notification = new this({
      userId,
      type,
      title,
      message,
      data,
      priority
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Erreur création notification:', error);
    throw error;
  }
};

// Méthode statique pour obtenir les notifications non lues
NotificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    return await this.countDocuments({ 
      userId, 
      isRead: false,
      expiresAt: { $gt: new Date() }
    });
  } catch (error) {
    console.error('Erreur récupération notifications non lues:', error);
    return 0;
  }
};

// Méthode statique pour marquer toutes les notifications comme lues
NotificationSchema.statics.markAllAsRead = async function(userId) {
  try {
    return await this.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  } catch (error) {
    console.error('Erreur marquage notifications comme lues:', error);
    throw error;
  }
};

module.exports = mongoose.model('Notification', NotificationSchema);
