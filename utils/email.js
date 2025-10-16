const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  async init() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Vérifier la connexion
      await this.transporter.verify();
      console.log('✅ Service email configuré avec succès');
    } catch (error) {
      console.warn('⚠️ Service email non configuré:', error.message);
      this.transporter = null;
    }
  }

  async sendEmail(to, subject, html, text = null) {
    if (!this.transporter) {
      console.warn('Service email non disponible');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@skincase.gg',
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email envoyé:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a259ff; margin: 0;">🎯 SkinCase</h1>
          <p style="color: #cfcfff; margin: 10px 0;">Vérification de votre compte</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #fff; margin-top: 0;">Bonjour ${user.username} !</h2>
          <p style="color: #cfcfff; line-height: 1.6;">
            Merci de vous être inscrit sur SkinCase ! Pour activer votre compte et commencer à ouvrir des cases, 
            veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(90deg, #a259ff, #3f2b96); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(162, 89, 255, 0.4);">
            ✅ Vérifier mon compte
          </a>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #cfcfff; font-size: 14px; margin: 0;">
            <strong>Note :</strong> Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte sur SkinCase, 
            vous pouvez ignorer cet e-mail.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="color: #888; font-size: 12px; margin: 0;">
            SkinCase - Plateforme de cases CS2 avec Skinchanger intégré
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, '🎯 Vérification de votre compte SkinCase', html);
  }

  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a259ff; margin: 0;">🎯 SkinCase</h1>
          <p style="color: #cfcfff; margin: 10px 0;">Réinitialisation de mot de passe</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #fff; margin-top: 0;">Bonjour ${user.username} !</h2>
          <p style="color: #cfcfff; line-height: 1.6;">
            Vous avez demandé une réinitialisation de votre mot de passe SkinCase. 
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(90deg, #a259ff, #3f2b96); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(162, 89, 255, 0.4);">
            🔐 Réinitialiser mon mot de passe
          </a>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #cfcfff; font-size: 14px; margin: 0;">
            <strong>Sécurité :</strong> Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, 
            vous pouvez ignorer cet e-mail en toute sécurité.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="color: #888; font-size: 12px; margin: 0;">
            SkinCase - Plateforme de cases CS2 avec Skinchanger intégré
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, '🔐 Réinitialisation de mot de passe SkinCase', html);
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a259ff; margin: 0;">🎯 SkinCase</h1>
          <p style="color: #cfcfff; margin: 10px 0;">Bienvenue dans la communauté !</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #fff; margin-top: 0;">Félicitations ${user.username} !</h2>
          <p style="color: #cfcfff; line-height: 1.6;">
            Votre compte SkinCase est maintenant actif ! Vous pouvez commencer à :
          </p>
          <ul style="color: #cfcfff; line-height: 1.8;">
            <li>🎁 Ouvrir des cases et obtenir des skins rares</li>
            <li>🎮 Rejoindre nos serveurs CS2 avec Skinchanger intégré</li>
            <li>🎯 Personnaliser vos loadouts d'armes</li>
            <li>🏆 Débloquer des achievements et monter de niveau</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.FRONTEND_URL}/dashboard" 
             style="background: linear-gradient(90deg, #a259ff, #3f2b96); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    font-weight: bold;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(162, 89, 255, 0.4);">
            🚀 Commencer l'aventure
          </a>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="color: #cfcfff; font-size: 14px; margin: 0;">
            <strong>Bonus de bienvenue :</strong> Vous avez reçu 1000 Xcoins pour commencer ! 
            Consultez votre tableau de bord pour voir vos statistiques.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, '🎯 Bienvenue sur SkinCase !', html);
  }

  htmlToText(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

module.exports = new EmailService();
