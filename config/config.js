module.exports = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3001',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  // JWT plus utilisé pour auth principale; conserver si besoin pour d'autres services
  JWT_SECRET: process.env.JWT_SECRET || 'deprecated-not-used-for-auth',
  STEAM_API_KEY: process.env.STEAM_API_KEY || 'votre_steam_api_key_ici',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cs2freecase'
}; 