const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');

// Script pour créer le premier admin
async function createAdmin() {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs2freecase');
    console.log('✅ Connecté à MongoDB');

    // Vérifier s'il y a déjà des admins
    const adminCount = await User.countDocuments({ isAdmin: true });
    
    if (adminCount > 0) {
      console.log('⚠️  Des administrateurs existent déjà dans la base de données');
      console.log('Pour créer un nouvel admin, utilisez l\'interface web ou modifiez directement la base de données');
      process.exit(0);
    }

    // Demander les informations admin
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };

    console.log('🔧 Configuration du premier administrateur');
    console.log('=====================================');

    const username = await question('Nom d\'utilisateur admin: ');
    const password = await question('Mot de passe admin: ');

    if (!username || !password) {
      console.log('❌ Nom d\'utilisateur et mot de passe requis');
      rl.close();
      process.exit(1);
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'admin
    const admin = new User({
      username,
      adminPassword: hashedPassword,
      isAdmin: true,
      coins: 999999,
      createdAt: new Date()
    });

    await admin.save();

    console.log('✅ Administrateur créé avec succès !');
    console.log(`👤 Nom d'utilisateur: ${username}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log('💰 Coins initiaux: 999,999');
    console.log('');
    console.log('🌐 Vous pouvez maintenant accéder au panel admin à l\'adresse:');
    console.log('   http://localhost:3000/admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Gardez ces informations en sécurité !');

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;
