/**
 * Configuration de l'API backend
 * Gère les appels vers le serveur backend (port 5000)
 */

// URL de base de l'API backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configuration axios pour les appels API
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important pour les sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    STEAM: '/auth/steam',
    GOOGLE: '/auth/google',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  
  // API principales
  XCOINS: '/api/xcoins',
  PAYMENT: '/api/payment',
  CASES: '/api/cases',
  INVENTORY: '/api/inventory',
  USERS: '/api/users',
  ROOMS: '/api/rooms',
  SHOP: '/api/shop',
  SKINCHANGER: '/api/skinchanger',
  SKINS: '/api/skins',
  SERVERS: '/api/servers',
  NOTIFICATIONS: '/api/notifications',
  STATS: '/api/stats',
  ACHIEVEMENTS: '/api/achievements',
  BATTLEPASS: '/api/battlepass',
  PREMIUM: '/api/premium',
  ADMIN: '/api/admin'
};

// Fonction pour construire une URL complète
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Fonction pour vérifier si l'API est accessible
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default apiConfig;
