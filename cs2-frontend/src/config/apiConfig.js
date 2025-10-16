/**
 * Configuration de l'API CSGOSkins.gg
 * 
 * Pour utiliser cette API, vous devez :
 * 1. Créer un compte sur https://csgoskins.gg/api/
 * 2. Souscrire à un plan (Pro: 179€/mois, Business: 279€/mois)
 * 3. Générer une clé API depuis votre tableau de bord
 * 4. Ajouter la clé dans votre fichier .env.local :
 *    REACT_APP_CSGOSKINS_API_KEY=votre_cle_api_ici
 */

export const API_CONFIG = {
  // URL de base de l'API CSGOSkins.gg
  BASE_URL: process.env.REACT_APP_CSGOSKINS_BASE_URL || 'https://csgoskins.gg/api',
  
  // Clé API (à définir dans .env.local)
  API_KEY: process.env.REACT_APP_CSGOSKINS_API_KEY || '',
  
  // Configuration du cache
  CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  
  // Limite de résultats par page
  DEFAULT_LIMIT: 20,
  
  // Endpoints disponibles
  ENDPOINTS: {
    SKINS: '/v1/skins',
    SKIN_DETAILS: '/v1/skins',
    CASES: '/v1/cases',
    SEARCH: '/v1/skins/search',
    PRICE_HISTORY: '/v1/skins',
    STATUS: '/v1/status'
  },
  
  // Options de tri disponibles
  ORDER_OPTIONS: {
    POPULARITY: 'popularity',
    RARITY: 'rarity',
    LOWEST_PRICE: 'lowestPrice',
    HIGHEST_PRICE: 'highestPrice',
    NEWEST: 'newest',
    OLDEST: 'oldest',
    ALPHABETICALLY: 'alphabetically'
  },
  
  // Raretés CS2 avec couleurs et probabilités
  RARITIES: {
    CONSUMER: 'Consumer Grade',
    INDUSTRIAL: 'Industrial Grade',
    MILSPEC: 'Mil-Spec Grade',
    RESTRICTED: 'Restricted',
    CLASSIFIED: 'Classified',
    COVERT: 'Covert',
    CONTRABAND: 'Contraband'
  },
  
  // Configuration des raretés avec couleurs et probabilités
  RARITY_CONFIG: {
    'Consumer Grade': {
      color: '#b0b3b8',
      percentage: 79.92,
      weight: 1
    },
    'Industrial Grade': {
      color: '#5e98d9',
      percentage: 15.98,
      weight: 1
    },
    'Mil-Spec Grade': {
      color: '#4b69ff',
      percentage: 3.2,
      weight: 1
    },
    'Restricted': {
      color: '#8847ff',
      percentage: 0.64,
      weight: 1
    },
    'Classified': {
      color: '#d32ce6',
      percentage: 0.16,
      weight: 1
    },
    'Covert': {
      color: '#eb4b4b',
      percentage: 0.06,
      weight: 1
    },
    'Contraband': {
      color: '#e4ae39',
      percentage: 0.02,
      weight: 1
    }
  },
  
  // Configuration des qualités d'usure
  WEAR_CONFIG: {
    'Factory New': {
      min: 0.00,
      max: 0.07,
      color: '#4b69ff'
    },
    'Minimal Wear': {
      min: 0.07,
      max: 0.15,
      color: '#8847ff'
    },
    'Field-Tested': {
      min: 0.15,
      max: 0.38,
      color: '#d32ce6'
    },
    'Well-Worn': {
      min: 0.38,
      max: 0.45,
      color: '#eb4b4b'
    },
    'Battle-Scarred': {
      min: 0.45,
      max: 1.00,
      color: '#e4ae39'
    }
  },
  
  // Couleurs disponibles
  COLORS: [
    'Black', 'Blue', 'Brown', 'Cyan', 'Gold', 'Gray', 'Green',
    'Orange', 'Pink', 'Purple', 'Red', 'White', 'Yellow'
  ],
  
  // Armes disponibles
  WEAPONS: [
    'AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Desert Eagle', 'USP-S', 'Glock-18',
    'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'P90', 'MP9', 'MAC-10',
    'UMP-45', 'PP-Bizon', 'MP7', 'MP5-SD', 'FAMAS', 'Galil AR', 'SG 553',
    'AUG', 'SSG 08', 'SCAR-20', 'G3SG1', 'M249', 'Negev', 'Nova', 'XM1014',
    'MAG-7', 'Sawed-Off', 'Knife', 'Gloves'
  ],
  
  // Catégories d'armes
  WEAPON_CATEGORIES: {
    'Rifle': ['AK-47', 'M4A4', 'M4A1-S', 'AUG', 'SG 553', 'Galil AR', 'FAMAS'],
    'Pistol': ['Glock-18', 'USP-S', 'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'Desert Eagle'],
    'Sniper': ['AWP', 'SSG 08', 'SCAR-20', 'G3SG1'],
    'SMG': ['MAC-10', 'MP9', 'UMP-45', 'PP-Bizon', 'MP7', 'MP5-SD', 'P90'],
    'Shotgun': ['Nova', 'XM1014', 'MAG-7', 'Sawed-Off'],
    'LMG': ['M249', 'Negev'],
    'Knife': ['Knife'],
    'Gloves': ['Gloves']
  },
  
  // États des skins
  EXTERIORS: [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred'
  ]
};

// Fonction pour vérifier si l'API est configurée
export const isAPIConfigured = () => {
  return API_CONFIG.API_KEY && API_CONFIG.API_KEY !== '';
};

// Fonction pour obtenir les headers d'authentification
export const getAuthHeaders = () => {
  if (!isAPIConfigured()) {
    console.warn('⚠️ Clé API CSGOSkins.gg non configurée. Utilisation du mode hors ligne.');
    return {};
  }
  
  return {
    'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Configuration des erreurs API
export const API_ERRORS = {
  NETWORK_ERROR: 'Erreur de réseau',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  RATE_LIMITED: 'Limite de requêtes atteinte',
  SERVER_ERROR: 'Erreur serveur',
  TIMEOUT: 'Timeout de la requête'
};

// Fonction pour obtenir le message d'erreur
export const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        return API_ERRORS.UNAUTHORIZED;
      case 403:
        return API_ERRORS.FORBIDDEN;
      case 404:
        return API_ERRORS.NOT_FOUND;
      case 429:
        return API_ERRORS.RATE_LIMITED;
      case 500:
        return API_ERRORS.SERVER_ERROR;
      default:
        return API_ERRORS.SERVER_ERROR;
    }
  } else if (error.request) {
    return API_ERRORS.NETWORK_ERROR;
  } else {
    return error.message || API_ERRORS.SERVER_ERROR;
  }
};

export default API_CONFIG;


