const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');

// Script d'initialisation des achievements
const initializeAchievements = async () => {
  try {
    console.log('🚀 Initialisation des achievements...');
    
    // Créer les achievements par défaut
    await Achievement.createDefaultAchievements();
    
    console.log('✅ Achievements initialisés avec succès !');
  } catch (error) {
    console.error('❌ Erreur initialisation achievements:', error);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  // Connexion à MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skincase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('📦 Connexion MongoDB établie');
    return initializeAchievements();
  })
  .then(() => {
    console.log('🎉 Initialisation terminée');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur:', error);
    process.exit(1);
  });
}

module.exports = initializeAchievements;
