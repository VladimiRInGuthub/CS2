const config = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  // JWT plus utilisé pour auth principale; conserver si besoin pour d'autres services
  JWT_SECRET: process.env.JWT_SECRET || 'deprecated-not-used-for-auth',
  STEAM_API_KEY: process.env.STEAM_API_KEY || 'votre_steam_api_key_ici',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/skincase'
};

// Debug: Vérifier si la clé Steam est chargée
if (config.STEAM_API_KEY && config.STEAM_API_KEY !== 'votre_steam_api_key_ici') {
  console.log('✅ Clé API Steam chargée:', config.STEAM_API_KEY.substring(0, 8) + '...');
} else {
  console.log('❌ Clé API Steam non configurée ou invalide');
}

module.exports = config; 