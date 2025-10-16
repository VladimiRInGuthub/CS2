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
  BASE_URL: 'https://csgoskins.gg/api',
  
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
  
  // Raretés CS2
  RARITIES: {
    CONSUMER: 'Consumer Grade',
    INDUSTRIAL: 'Industrial Grade',
    MILSPEC: 'Mil-Spec Grade',
    RESTRICTED: 'Restricted',
    CLASSIFIED: 'Classified',
    COVERT: 'Covert',
    CONTRABAND: 'Contraband'
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

export default API_CONFIG;


