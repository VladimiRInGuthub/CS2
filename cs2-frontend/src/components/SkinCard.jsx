import React, { useState } from 'react';
import { getSkinImageUrl } from '../utils/skinImages';

/**
 * Composant SkinCard - Affichage amélioré d'un skin
 */
const SkinCard = ({ 
  skin, 
  showPrice = false, 
  showStats = false, 
  onClick = null,
  size = 'medium',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!skin) return null;

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': '#B0B3B8',
      'Uncommon': '#5E98D9', 
      'Rare': '#4B69FF',
      'Epic': '#8847FF',
      'Legendary': '#D32CE6',
      'Contraband': '#E4AE39'
    };
    return colors[rarity] || '#666666';
  };

  const getSizeStyles = () => {
    const sizes = {
      small: { width: '120px', height: '90px', fontSize: '0.8rem' },
      medium: { width: '200px', height: '150px', fontSize: '1rem' },
      large: { width: '280px', height: '210px', fontSize: '1.2rem' }
    };
    return sizes[size] || sizes.medium;
  };

  const sizeStyles = getSizeStyles();

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(skin);
    }
  };

  return (
    <div
      className={`skin-card ${className}`}
      onClick={handleClick}
      style={{
        backgroundColor: 'rgba(28, 28, 42, 0.9)',
        borderRadius: '15px',
        padding: '15px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: `2px solid ${getRarityColor(skin.rarity)}`,
        backdropFilter: 'blur(15px)',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        width: sizeStyles.width,
        height: 'auto',
        minHeight: '200px'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = `0 12px 40px ${getRarityColor(skin.rarity)}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
        }
      }}
    >
      {/* Image du skin */}
      <div style={{ 
        width: '100%', 
        height: sizeStyles.height, 
        borderRadius: '10px',
        marginBottom: '15px',
        border: `2px solid ${getRarityColor(skin.rarity)}`,
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {imageLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '14px',
            zIndex: 1
          }}>
            🔄 Chargement...
          </div>
        )}
        
        {!imageError ? (
          <img 
            src={getSkinImageUrl(skin)} 
            alt={skin.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
            textAlign: 'center',
            padding: '10px',
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${getRarityColor(skin.rarity)}20, ${getRarityColor(skin.rarity)}40)`
          }}>
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🖼️</div>
            <div>Aucune image</div>
          </div>
        )}
        
        {/* Badge de rareté */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: getRarityColor(skin.rarity),
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {skin.rarity}
        </div>
      </div>
      
      {/* Informations du skin */}
      <h3 style={{ 
        color: '#fff', 
        fontSize: sizeStyles.fontSize, 
        marginBottom: '8px',
        lineHeight: '1.3',
        height: '2.6em',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {skin.name}
      </h3>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <span style={{ 
          color: '#cfcfff', 
          fontSize: '0.8rem'
        }}>
          {skin.weapon}
        </span>
        <span style={{ 
          color: '#cfcfff', 
          fontSize: '0.8rem'
        }}>
          {skin.exterior || 'Field-Tested'}
        </span>
      </div>

      {/* Prix si demandé */}
      {showPrice && skin.price && (
        <div style={{ 
          color: '#FFD700', 
          fontWeight: 'bold', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          💰 ${parseFloat(skin.price).toFixed(2)}
        </div>
      )}

      {/* Statistiques si demandées */}
      {showStats && (
        <div style={{ 
          marginTop: '10px',
          padding: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#cfcfff'
        }}>
          <div>Rareté: {skin.rarity}</div>
          <div>État: {skin.exterior || 'Field-Tested'}</div>
          {skin.statTrak && <div style={{ color: '#ff6b6b' }}>StatTrak™</div>}
          {skin.souvenir && <div style={{ color: '#ffd700' }}>Souvenir</div>}
        </div>
      )}
    </div>
  );
};

export default SkinCard;


