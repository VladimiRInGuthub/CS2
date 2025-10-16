/**
 * Service API gratuit pour les skins CS2
 * Utilise plusieurs sources gratuites et open-source
 */

import { getWorkingSkinImageUrl } from '../utils/workingSkinImages';

class FreeSkinAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    this.baseUrls = {
      // URLs désactivées - utilisation uniquement des images de placeholder
    };
    // Désactiver les APIs externes non disponibles
    this.externalAPIsEnabled = false;
  }

  /**
   * Vérifie si les données sont en cache
   */
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Met en cache les données
   */
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Effectue une requête HTTP avec gestion d'erreur
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Erreur requête API:', error.message);
      return null;
    }
  }

  /**
   * Récupère les skins depuis l'API CSAPI (désactivée - utilise les données locales)
   */
  async getSkinsFromCSAPI(filters = {}) {
    // API externe désactivée, retourner null pour utiliser le fallback local
    console.log('API externe désactivée, utilisation des données locales');
    return null;
  }

  /**
   * Récupère les détails d'un skin spécifique
   */
  async getSkinDetails(skinName) {
    const cacheKey = `skin_${skinName}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Utiliser directement la base de données locale
    const localData = this.getLocalSkinData(skinName);
    if (localData) {
      this.setCachedData(cacheKey, localData);
    }
    return localData;
  }

  /**
   * Génère l'URL Steam Community pour un skin (désactivée)
   */
  generateSteamImageUrl(skinData) {
    // Fonction désactivée - utilisation des images de placeholder
    return null;
  }

  /**
   * Recherche de skins par nom
   */
  async searchSkins(query) {
    const cacheKey = `search_${query}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Utiliser directement la recherche locale
    const results = this.searchLocalSkins(query);
    this.setCachedData(cacheKey, results);
    return results;
  }

  /**
   * Base de données locale de skins populaires avec images de placeholder
   */
  getLocalSkinData(skinName) {
    // Utiliser la nouvelle méthode getAllLocalSkins pour obtenir les données
    const allSkins = this.getAllLocalSkins();
    const skinMap = {};
    
    allSkins.forEach(skin => {
      skinMap[skin.name] = skin;
    });

    return skinMap[skinName] || null;
  }

  /**
   * Génère une image de placeholder pour un skin
   */
  generatePlaceholderImage(skinName, weapon, rarity) {
    // Couleurs par rareté
    const rarityColors = {
      'Consumer Grade': '#B0B3B8',
      'Industrial Grade': '#5E98D9',
      'Mil-Spec Grade': '#4B69FF',
      'Restricted': '#8847FF',
      'Classified': '#D32CE6',
      'Covert': '#EB4B4B',
      'Contraband': '#E4AE39'
    };
    
    const color = rarityColors[rarity] || '#666666';
    
    // Utiliser des URLs de placeholder externes qui fonctionnent
    const weaponIcons = {
      'AK-47': '🔫',
      'M4A4': '🔫',
      'M4A1-S': '🔫',
      'AWP': '🎯',
      'USP-S': '🔫',
      'Desert Eagle': '🔫',
      'Glock-18': '🔫',
      'P250': '🔫',
      'Five-SeveN': '🔫',
      'P90': '🔫',
      'MAC-10': '🔫',
      'UMP-45': '🔫',
      'MP9': '🔫',
      'FAMAS': '🔫',
      'Galil AR': '🔫'
    };
    
    const icon = weaponIcons[weapon] || '🔫';
    
    // Utiliser un service de placeholder simple et fiable
    const encodedWeapon = encodeURIComponent(weapon);
    const encodedSkin = encodeURIComponent(skinName.split(' | ')[1] || skinName);
    const encodedColor = encodeURIComponent(color);
    
    // Utiliser placeholder.com avec des paramètres personnalisés
    return `https://via.placeholder.com/200x150/${color.replace('#', '')}/FFFFFF?text=${encodedWeapon}+${encodedSkin}`;
  }


  /**
   * Obtient tous les skins locaux disponibles
   */
  getAllLocalSkins() {
    const localSkins = {
      'USP-S | Guardian': {
        name: 'USP-S | Guardian',
        weapon: 'USP-S',
        rarity: 'Uncommon',
        image: this.generatePlaceholderImage('USP-S | Guardian', 'USP-S', 'Uncommon'),
        exterior: 'Field-Tested',
        price: 0.15,
        statTrak: false,
        souvenir: false
      },
      'AK-47 | Redline': {
        name: 'AK-47 | Redline',
        weapon: 'AK-47',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('AK-47 | Redline', 'AK-47', 'Classified'),
        exterior: 'Field-Tested',
        price: 15.50,
        statTrak: false,
        souvenir: false
      },
      'AWP | Dragon Lore': {
        name: 'AWP | Dragon Lore',
        weapon: 'AWP',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('AWP | Dragon Lore', 'AWP', 'Covert'),
        exterior: 'Factory New',
        price: 2500.00,
        statTrak: false,
        souvenir: false
      },
      'M4A4 | Howl': {
        name: 'M4A4 | Howl',
        weapon: 'M4A4',
        rarity: 'Contraband',
        image: this.generatePlaceholderImage('M4A4 | Howl', 'M4A4', 'Contraband'),
        exterior: 'Factory New',
        price: 5000.00,
        statTrak: false,
        souvenir: false
      },
      'Desert Eagle | Blaze': {
        name: 'Desert Eagle | Blaze',
        weapon: 'Desert Eagle',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('Desert Eagle | Blaze', 'Desert Eagle', 'Covert'),
        exterior: 'Factory New',
        price: 800.00,
        statTrak: false,
        souvenir: false
      },
      'Glock-18 | Fade': {
        name: 'Glock-18 | Fade',
        weapon: 'Glock-18',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('Glock-18 | Fade', 'Glock-18', 'Covert'),
        exterior: 'Factory New',
        price: 1200.00,
        statTrak: false,
        souvenir: false
      },
      'AWP | Asiimov': {
        name: 'AWP | Asiimov',
        weapon: 'AWP',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('AWP | Asiimov', 'AWP', 'Covert'),
        exterior: 'Field-Tested',
        price: 45.00,
        statTrak: false,
        souvenir: false
      },
      'AK-47 | Vulcan': {
        name: 'AK-47 | Vulcan',
        weapon: 'AK-47',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('AK-47 | Vulcan', 'AK-47', 'Covert'),
        exterior: 'Field-Tested',
        price: 120.00,
        statTrak: false,
        souvenir: false
      },
      'M4A1-S | Hyper Beast': {
        name: 'M4A1-S | Hyper Beast',
        weapon: 'M4A1-S',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('M4A1-S | Hyper Beast', 'M4A1-S', 'Covert'),
        exterior: 'Field-Tested',
        price: 85.00,
        statTrak: false,
        souvenir: false
      },
      'USP-S | Orion': {
        name: 'USP-S | Orion',
        weapon: 'USP-S',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('USP-S | Orion', 'USP-S', 'Classified'),
        exterior: 'Field-Tested',
        price: 25.00,
        statTrak: false,
        souvenir: false
      },
      'AK-47 | Fire Serpent': {
        name: 'AK-47 | Fire Serpent',
        weapon: 'AK-47',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('AK-47 | Fire Serpent', 'AK-47', 'Covert'),
        exterior: 'Field-Tested',
        price: 180.00,
        statTrak: false,
        souvenir: false
      },
      'M4A4 | Poseidon': {
        name: 'M4A4 | Poseidon',
        weapon: 'M4A4',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('M4A4 | Poseidon', 'M4A4', 'Covert'),
        exterior: 'Field-Tested',
        price: 95.00,
        statTrak: false,
        souvenir: false
      },
      'AWP | Medusa': {
        name: 'AWP | Medusa',
        weapon: 'AWP',
        rarity: 'Covert',
        image: this.generatePlaceholderImage('AWP | Medusa', 'AWP', 'Covert'),
        exterior: 'Field-Tested',
        price: 220.00,
        statTrak: false,
        souvenir: false
      },
      'Glock-18 | Water Elemental': {
        name: 'Glock-18 | Water Elemental',
        weapon: 'Glock-18',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('Glock-18 | Water Elemental', 'Glock-18', 'Classified'),
        exterior: 'Field-Tested',
        price: 8.50,
        statTrak: false,
        souvenir: false
      },
      'P250 | Asiimov': {
        name: 'P250 | Asiimov',
        weapon: 'P250',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('P250 | Asiimov', 'P250', 'Classified'),
        exterior: 'Field-Tested',
        price: 12.00,
        statTrak: false,
        souvenir: false
      },
      'Five-SeveN | Hyper Beast': {
        name: 'Five-SeveN | Hyper Beast',
        weapon: 'Five-SeveN',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('Five-SeveN | Hyper Beast', 'Five-SeveN', 'Classified'),
        exterior: 'Field-Tested',
        price: 6.50,
        statTrak: false,
        souvenir: false
      },
      'P90 | Asiimov': {
        name: 'P90 | Asiimov',
        weapon: 'P90',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('P90 | Asiimov', 'P90', 'Classified'),
        exterior: 'Field-Tested',
        price: 15.00,
        statTrak: false,
        souvenir: false
      },
      'MAC-10 | Neon Rider': {
        name: 'MAC-10 | Neon Rider',
        weapon: 'MAC-10',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('MAC-10 | Neon Rider', 'MAC-10', 'Classified'),
        exterior: 'Field-Tested',
        price: 4.20,
        statTrak: false,
        souvenir: false
      },
      'UMP-45 | Blaze': {
        name: 'UMP-45 | Blaze',
        weapon: 'UMP-45',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('UMP-45 | Blaze', 'UMP-45', 'Classified'),
        exterior: 'Field-Tested',
        price: 3.80,
        statTrak: false,
        souvenir: false
      },
      'MP9 | Hot Rod': {
        name: 'MP9 | Hot Rod',
        weapon: 'MP9',
        rarity: 'Classified',
        image: this.generatePlaceholderImage('MP9 | Hot Rod', 'MP9', 'Classified'),
        exterior: 'Field-Tested',
        price: 2.50,
        statTrak: false,
        souvenir: false
      },
      'FAMAS | Pulse': {
        name: 'FAMAS | Pulse',
        weapon: 'FAMAS',
        rarity: 'Restricted',
        image: this.generatePlaceholderImage('FAMAS | Pulse', 'FAMAS', 'Restricted'),
        exterior: 'Field-Tested',
        price: 1.20,
        statTrak: false,
        souvenir: false
      },
      'Galil AR | Eco': {
        name: 'Galil AR | Eco',
        weapon: 'Galil AR',
        rarity: 'Restricted',
        image: this.generatePlaceholderImage('Galil AR | Eco', 'Galil AR', 'Restricted'),
        exterior: 'Field-Tested',
        price: 0.85,
        statTrak: false,
        souvenir: false
      }
    };

    return Object.values(localSkins);
  }

  /**
   * Recherche locale de skins
   */
  searchLocalSkins(query) {
    // Obtenir tous les skins locaux
    const allLocalSkins = this.getAllLocalSkins();
    const filtered = allLocalSkins.filter(skin => 
      skin.name.toLowerCase().includes(query.toLowerCase()) ||
      skin.weapon.toLowerCase().includes(query.toLowerCase())
    );

    return {
      skins: filtered,
      total: filtered.length,
      page: 1,
      limit: 50
    };
  }

  /**
   * Récupère tous les skins disponibles
   */
  async getAllSkins(filters = {}) {
    try {
      // Utiliser directement la base locale (APIs externes désactivées)
      const allLocalSkins = this.getAllLocalSkins();
      let filteredSkins = [...allLocalSkins];

      // Appliquer les filtres
      if (filters.weapon) {
        filteredSkins = filteredSkins.filter(skin => 
          skin.weapon.toLowerCase().includes(filters.weapon.toLowerCase())
        );
      }

      if (filters.rarity) {
        filteredSkins = filteredSkins.filter(skin => 
          skin.rarity.toLowerCase().includes(filters.rarity.toLowerCase())
        );
      }

      // Appliquer le tri
      if (filters.orderBy) {
        switch (filters.orderBy) {
          case 'rarity':
            const rarityOrder = ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 'Restricted', 'Classified', 'Covert', 'Contraband'];
            filteredSkins.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
            break;
          case 'lowestPrice':
            filteredSkins.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case 'highestPrice':
            filteredSkins.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          case 'alphabetically':
            filteredSkins.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default: // popularity - tri par défaut
            break;
        }
      }

      return {
        skins: filteredSkins,
        total: filteredSkins.length,
        page: 1,
        limit: 50
      };
    } catch (error) {
      console.error('Erreur récupération skins:', error);
      return {
        skins: [],
        total: 0,
        page: 1,
        limit: 50
      };
    }
  }

  /**
   * Obtient l'URL de l'image pour un skin
   */
  getSkinImageUrl(skinData) {
    return getWorkingSkinImageUrl(skinData);
  }

  /**
   * Nettoie le cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Vérifie le statut des APIs
   */
  async checkAPIStatus() {
    const status = {
      csapi: false, // Désactivée
      steam: true,  // On assume que Steam est disponible pour les images
      community: false // Désactivée
    };

    // Les APIs externes sont désactivées, on utilise uniquement les données locales
    console.log('Mode local activé - APIs externes désactivées');
    
    return status;
  }
}

// Instance singleton
const freeSkinAPI = new FreeSkinAPI();

export default freeSkinAPI;
