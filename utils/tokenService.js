const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class TokenService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    this.expiresIn = '24h';
  }

  // Générer un token de vérification email
  generateEmailVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Générer un token de réinitialisation de mot de passe
  generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Générer un JWT pour l'authentification
  generateAuthToken(user) {
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  // Vérifier un JWT
  verifyAuthToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }

  // Générer un hash pour les tokens
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Générer un token sécurisé pour les sessions
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Générer un token pour les webhooks
  generateWebhookToken(data) {
    const payload = {
      timestamp: Date.now(),
      data: data
    };
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  // Vérifier un token de webhook
  verifyWebhookToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
