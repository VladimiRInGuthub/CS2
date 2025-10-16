import { API_CONFIG, getAuthHeaders, isAPIConfigured, getErrorMessage } from '../config/apiConfig';

class CSGOSkinsAPI {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.apiKey = API_CONFIG.API_KEY;
    this.cache = new Map();
    this.cacheTimeout = API_CONFIG.CACHE_TIMEOUT;
  }

  /**
   * Génère les headers d'authentification
   */
  getHeaders() {
    return getAuthHeaders();
  }

  /**
   * Vérifie si les données sont en cache et valides
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
   * Effectue une requête HTTP avec gestion d'erreur et retry
   */
  async makeRequest(endpoint, options = {}, retries = 3) {
    try {
      // Vérifier si l'API est configurée
      if (!isAPIConfigured()) {
        console.warn('⚠️ API CSGOSkins.gg non configurée, utilisation des données de fallback');
        throw new Error('API non configurée');
      }

      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getHeaders(),
        timeout: 10000, // 10 secondes
        ...options
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur requête CSGOSkins API:', error);
      
      // Retry logic
      if (retries > 0 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        console.log(`Tentative ${4 - retries}/3...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.makeRequest(endpoint, options, retries - 1);
      }
      
      throw error;
    }
  }

  /**
   * Récupère la liste des skins avec filtres
   */
  async getSkins(filters = {}) {
    const cacheKey = `skins_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams();
      
      // Filtres disponibles
      if (filters.weapon) params.append('weapon', filters.weapon);
      if (filters.color) params.append('color', filters.color);
      if (filters.rarity) params.append('rarity', filters.rarity);
      if (filters.type) params.append('type', filters.type);
      if (filters.exterior) params.append('exterior', filters.exterior);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      const endpoint = `${API_CONFIG.ENDPOINTS.SKINS}${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await this.makeRequest(endpoint);
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur récupération skins:', error);
      // Retourner des données de fallback en cas d'erreur
      return this.getFallbackSkins(filters);
    }
  }

  /**
   * Récupère les détails d'un skin spécifique
   */
  async getSkinDetails(skinId) {
    const cacheKey = `skin_${skinId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.makeRequest(`${API_CONFIG.ENDPOINTS.SKIN_DETAILS}/${skinId}`);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur récupération détails skin:', error);
      return null;
    }
  }

  /**
   * Récupère les cases disponibles
   */
  async getCases() {
    const cacheKey = 'cases';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.makeRequest(API_CONFIG.ENDPOINTS.CASES);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur récupération cases:', error);
      return this.getFallbackCases();
    }
  }

  /**
   * Récupère les détails d'une case
   */
  async getCaseDetails(caseId) {
    const cacheKey = `case_${caseId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.makeRequest(`${API_CONFIG.ENDPOINTS.CASE_DETAILS}/${caseId}`);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur récupération détails case:', error);
      return null;
    }
  }

  /**
   * Récupère les prix historiques d'un skin
   */
  async getSkinPriceHistory(skinId, days = 30) {
    const cacheKey = `price_history_${skinId}_${days}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.makeRequest(`${API_CONFIG.ENDPOINTS.PRICE_HISTORY}/${skinId}/price-history?days=${days}`);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur récupération historique prix:', error);
      return null;
    }
  }

  /**
   * Recherche de skins par nom
   */
  async searchSkins(query, filters = {}) {
    const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams({ q: query });
      
      // Ajouter les filtres de recherche
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const data = await this.makeRequest(`${API_CONFIG.ENDPOINTS.SEARCH}?${params.toString()}`);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erreur recherche skins:', error);
      return [];
    }
  }

  /**
   * Vérifie le statut de l'API
   */
  async checkAPIStatus() {
    try {
      const data = await this.makeRequest(API_CONFIG.ENDPOINTS.STATUS);
      return {
        status: 'online',
        data: data
      };
    } catch (error) {
      return {
        status: 'offline',
        error: getErrorMessage(error)
      };
    }
  }

  /**
   * Données de fallback en cas d'erreur API
   */
  getFallbackSkins(filters = {}) {
    const fallbackSkins = [
      {
        id: 'fallback-1',
        name: 'AK-47 | Redline',
        weapon: 'AK-47',
        rarity: 'Classified',
        price: 15.50,
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
        exterior: 'Field-Tested',
        statTrak: false,
        souvenir: false,
        category: 'Rifle'
      },
      {
        id: 'fallback-2',
        name: 'AWP | Dragon Lore',
        weapon: 'AWP',
        rarity: 'Covert',
        price: 2500.00,
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
        exterior: 'Factory New',
        statTrak: false,
        souvenir: false,
        category: 'Sniper'
      },
      {
        id: 'fallback-3',
        name: 'M4A4 | Howl',
        weapon: 'M4A4',
        rarity: 'Contraband',
        price: 5000.00,
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
        exterior: 'Factory New',
        statTrak: false,
        souvenir: false,
        category: 'Rifle'
      }
    ];

    // Appliquer les filtres de base
    let filteredSkins = fallbackSkins;
    
    if (filters.weapon) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.weapon.toLowerCase().includes(filters.weapon.toLowerCase())
      );
    }
    
    if (filters.rarity) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.rarity === filters.rarity
      );
    }

    return {
      skins: filteredSkins,
      total: filteredSkins.length,
      page: 1,
      limit: filters.limit || 50,
      fallback: true
    };
  }

  getFallbackCases() {
    return {
      cases: [
        {
          id: 'fallback-case-1',
          name: 'Chroma Case',
          description: 'Case contenant des skins colorés',
          price: 2.50,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
          rarity: 'Common',
          items: 50,
          fallback: true
        },
        {
          id: 'fallback-case-2',
          name: 'Operation Bravo Case',
          description: 'Case de l\'opération Bravo',
          price: 5.00,
          image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ/256fx256f',
          rarity: 'Rare',
          items: 30,
          fallback: true
        }
      ],
      fallback: true
    };
  }

  /**
   * Nettoie le cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtient les statistiques du cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Instance singleton
const csgoskinsAPI = new CSGOSkinsAPI();

export default csgoskinsAPI;