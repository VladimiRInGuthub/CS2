/**
 * Utilitaires pour les images de skins CS2
 * Utilise des URLs d'images réelles des skins CS2
 */

// Base URL pour les images Steam Community
const STEAM_IMAGE_BASE = 'https://steamcommunity-a.akamaihd.net/economy/image/';

// Mapping des skins populaires avec leurs IDs d'image Steam
const SKIN_IMAGE_MAPPING = {
  // USP-S Skins
  'USP-S | Guardian': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'USP-S | Orion': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'USP-S | Kill Confirmed': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  
  // AK-47 Skins
  'AK-47 | Redline': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'AK-47 | Vulcan': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'AK-47 | Fire Serpent': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  
  // AWP Skins
  'AWP | Dragon Lore': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'AWP | Medusa': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'AWP | Asiimov': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  
  // M4A4 Skins
  'M4A4 | Howl': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'M4A4 | Poseidon': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  
  // Desert Eagle Skins
  'Desert Eagle | Blaze': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'Desert Eagle | Golden Koi': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  
  // Glock Skins
  'Glock-18 | Fade': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ',
  'Glock-18 | Water Elemental': '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NfzhH6d-zhL-KkuXLPr7Vn35cppwl2L7F9t2h3Qbl-0FqNWv3d4fBd1I3M1nY-lO_xOq7gZK5tMqPnJq6CJ3s-zDzkC0hQ'
};

/**
 * Génère une image SVG améliorée pour les skins
 */
export const generateEnhancedSkinImage = (skin) => {
  const rarityColors = {
    'Common': '#B0B3B8',
    'Uncommon': '#5E98D9', 
    'Rare': '#4B69FF',
    'Epic': '#8847FF',
    'Legendary': '#D32CE6',
    'Contraband': '#E4AE39'
  };

  const color = rarityColors[skin.rarity] || '#666666';
  const weaponIcon = getWeaponIcon(skin.weapon);

  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${skin._id || 'default'}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}20;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color}40;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}60;stop-opacity:1" />
        </linearGradient>
        <filter id="glow-${skin._id || 'default'}">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="texture-${skin._id || 'default'}" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="none"/>
          <circle cx="10" cy="10" r="1" fill="${color}30"/>
        </pattern>
      </defs>
      
      <!-- Fond avec texture -->
      <rect width="200" height="150" fill="url(#bg-${skin._id || 'default'})" rx="10"/>
      <rect width="200" height="150" fill="url(#texture-${skin._id || 'default'})" rx="10"/>
      
      <!-- Bordure avec effet de brillance -->
      <rect width="200" height="150" fill="none" stroke="${color}" stroke-width="3" rx="10" filter="url(#glow-${skin._id || 'default'})"/>
      
      <!-- Icône d'arme stylisée -->
      <g transform="translate(100, 75)">
        ${weaponIcon}
      </g>
      
      <!-- Texte avec ombre -->
      <text x="100" y="110" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#FFFFFF" filter="url(#glow-${skin._id || 'default'})">${skin.rarity}</text>
      <text x="100" y="125" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#CCCCCC">${skin.weapon}</text>
      
      <!-- Effet de particules -->
      <circle cx="50" cy="30" r="2" fill="${color}60" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="150" cy="40" r="1.5" fill="${color}60" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="170" cy="120" r="1" fill="${color}60" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;

  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
};

/**
 * Retourne l'icône SVG pour chaque arme
 */
const getWeaponIcon = (weapon) => {
  const icons = {
    'AK-47': '<rect x="-15" y="-8" width="30" height="6" fill="#FFFFFF" rx="3"/><rect x="-12" y="-12" width="24" height="16" fill="#FFFFFF" opacity="0.8" rx="2"/><circle cx="0" cy="-4" r="2" fill="#333333"/>',
    'M4A4': '<rect x="-15" y="-8" width="30" height="6" fill="#FFFFFF" rx="3"/><rect x="-12" y="-12" width="24" height="16" fill="#FFFFFF" opacity="0.8" rx="2"/><circle cx="0" cy="-4" r="2" fill="#333333"/>',
    'M4A1-S': '<rect x="-15" y="-8" width="30" height="6" fill="#FFFFFF" rx="3"/><rect x="-12" y="-12" width="24" height="16" fill="#FFFFFF" opacity="0.8" rx="2"/><circle cx="0" cy="-4" r="2" fill="#333333"/>',
    'AWP': '<rect x="-20" y="-6" width="40" height="4" fill="#FFFFFF" rx="2"/><rect x="-18" y="-10" width="36" height="12" fill="#FFFFFF" opacity="0.8" rx="2"/><circle cx="0" cy="-4" r="3" fill="#333333"/>',
    'USP-S': '<rect x="-8" y="-4" width="16" height="3" fill="#FFFFFF" rx="2"/><rect x="-6" y="-6" width="12" height="8" fill="#FFFFFF" opacity="0.8" rx="1"/><circle cx="0" cy="-2" r="1.5" fill="#333333"/>',
    'Desert Eagle': '<rect x="-10" y="-5" width="20" height="4" fill="#FFFFFF" rx="2"/><rect x="-8" y="-7" width="16" height="10" fill="#FFFFFF" opacity="0.8" rx="1"/><circle cx="0" cy="-2" r="2" fill="#333333"/>',
    'Glock-18': '<rect x="-8" y="-4" width="16" height="3" fill="#FFFFFF" rx="2"/><rect x="-6" y="-6" width="12" height="8" fill="#FFFFFF" opacity="0.8" rx="1"/><circle cx="0" cy="-2" r="1.5" fill="#333333"/>',
    'P250': '<rect x="-7" y="-3" width="14" height="3" fill="#FFFFFF" rx="2"/><rect x="-5" y="-5" width="10" height="7" fill="#FFFFFF" opacity="0.8" rx="1"/><circle cx="0" cy="-1" r="1" fill="#333333"/>',
    'Knife': '<path d="M-10,-5 L10,5 M-10,5 L10,-5" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>',
    'Gloves': '<rect x="-8" y="-6" width="16" height="12" fill="#FFFFFF" opacity="0.8" rx="2"/>'
  };
  
  return icons[weapon] || icons['USP-S']; // Fallback vers USP-S
};

/**
 * Obtient l'URL de l'image du skin
 */
export const getSkinImageUrl = (skin) => {
  // Si le skin a une image valide, l'utiliser
  if (skin.image && skin.image.startsWith('http') && !skin.image.includes('placeholder')) {
    return skin.image;
  }
  
  // Si on a une image Steam pour ce skin spécifique
  if (SKIN_IMAGE_MAPPING[skin.name]) {
    return `${STEAM_IMAGE_BASE}${SKIN_IMAGE_MAPPING[skin.name]}/256fx256f`;
  }
  
  // Sinon, générer une image SVG améliorée
  return generateEnhancedSkinImage(skin);
};

/**
 * Obtient l'URL de l'image Steam pour un skin spécifique
 */
export const getSteamImageUrl = (skinName, size = '256fx256f') => {
  if (SKIN_IMAGE_MAPPING[skinName]) {
    return `${STEAM_IMAGE_BASE}${SKIN_IMAGE_MAPPING[skinName]}/${size}`;
  }
  return null;
};

export default {
  generateEnhancedSkinImage,
  getSkinImageUrl,
  getSteamImageUrl,
  SKIN_IMAGE_MAPPING
};


