// Utilitaires pour les images de skins
import { getSkinImageUrl as getEnhancedSkinImageUrl, generateEnhancedSkinImage } from './cs2SkinImages';

export const generateSkinImage = (skin) => {
  // Utiliser la nouvelle fonction améliorée
  return generateEnhancedSkinImage(skin);
};

export const getSkinImageUrl = (skin) => {
  // Utiliser la nouvelle fonction améliorée qui inclut les vraies images Steam
  return getEnhancedSkinImageUrl(skin);
};

export default {
  generateSkinImage,
  getSkinImageUrl
};
