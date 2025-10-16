/**
 * Images de skins CS2 qui fonctionnent réellement
 * Utilise des URLs d'images hébergées sur des CDN publics
 */

// Plus d'URLs Steam - utilisation uniquement des images de placeholder générées
export const WORKING_SKIN_IMAGES = {};

/**
 * Génère une image SVG de fallback améliorée
 */
export const generateFallbackSkinImage = (skin) => {
  const rarityColors = {
    'Consumer Grade': '#B0B3B8',
    'Industrial Grade': '#5E98D9',
    'Mil-Spec Grade': '#4B69FF',
    'Restricted': '#8847FF',
    'Classified': '#D32CE6',
    'Covert': '#EB4B4B',
    'Contraband': '#E4AE39',
    'Uncommon': '#5E98D9',
    'Rare': '#4B69FF',
    'Epic': '#8847FF',
    'Legendary': '#D32CE6'
  };

  const color = rarityColors[skin.rarity] || '#666666';
  const weaponIcon = getWeaponIcon(skin.weapon);

  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${skin.name.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}20;stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color}40;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color}60;stop-opacity:1" />
        </linearGradient>
        <filter id="glow-${skin.name.replace(/\s+/g, '')}">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Fond avec gradient -->
      <rect width="200" height="150" fill="url(#bg-${skin.name.replace(/\s+/g, '')})" rx="10"/>
      
      <!-- Bordure avec effet de brillance -->
      <rect width="200" height="150" fill="none" stroke="${color}" stroke-width="3" rx="10" filter="url(#glow-${skin.name.replace(/\s+/g, '')})"/>
      
      <!-- Icône d'arme stylisée -->
      <g transform="translate(100, 75)">
        ${weaponIcon}
      </g>
      
      <!-- Texte avec ombre -->
      <text x="100" y="110" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#FFFFFF" filter="url(#glow-${skin.name.replace(/\s+/g, '')})">${skin.rarity}</text>
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
 * Obtient l'URL de l'image pour un skin avec fallback intelligent
 */
export const getWorkingSkinImageUrl = (skin) => {
  if (!skin) return null;

  // Si on a déjà une image de placeholder générée (data:image/svg)
  if (skin.image && skin.image.startsWith('data:image/svg')) {
    return skin.image;
  }

  // Toujours utiliser le SVG généré pour éviter les erreurs d'URLs externes
  return generateFallbackSkinImage(skin);
};

const skinImageUtils = {
  WORKING_SKIN_IMAGES,
  generateFallbackSkinImage,
  getWorkingSkinImageUrl
};

export default skinImageUtils;
