import React, { useState, useRef, useEffect } from 'react';
import './OptimizedImage.css';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallback = null,
  lazy = true,
  placeholder = null,
  onLoad = null,
  onError = null,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!lazy || isInView) return;

    // Intersection Observer pour le lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Charger 50px avant que l'image soit visible
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView]);

  useEffect(() => {
    if (isInView && src && !isLoaded && !hasError) {
      // Précharger l'image
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.(img);
      };
      
      img.onerror = () => {
        setHasError(true);
        if (fallback) {
          setImageSrc(fallback);
        }
        onError?.(new Error('Erreur de chargement de l\'image'));
      };
      
      img.src = src;
    }
  }, [isInView, src, isLoaded, hasError, fallback, onLoad, onError]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      {...props}
    >
      {!isLoaded && !hasError && (
        <div className="image-placeholder">
          {placeholder ? (
            <img src={placeholder} alt="" className="placeholder-image" />
          ) : (
            <div className="skeleton-image">
              <div className="skeleton-shimmer"></div>
            </div>
          )}
        </div>
      )}
      
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}
      
      {hasError && !fallback && (
        <div className="image-error">
          <div className="error-icon">🖼️</div>
          <span>Image non disponible</span>
        </div>
      )}
    </div>
  );
};

// Composant pour les images de skins avec optimisations spécifiques
export const SkinImage = ({ 
  skin, 
  size = 'medium', 
  showRarity = true, 
  className = '',
  ...props 
}) => {
  const getImageUrl = (skin) => {
    if (!skin) return null;
    
    // Priorité: image personnalisée > image API > fallback
    if (skin.image) return skin.image;
    if (skin.steamImage) return skin.steamImage;
    
    // Fallback vers une image générique basée sur l'arme
    return `https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f`;
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Consumer Grade': '#b0b3b8',
      'Industrial Grade': '#5e98d9',
      'Mil-Spec Grade': '#4b69ff',
      'Restricted': '#8847ff',
      'Classified': '#d32ce6',
      'Covert': '#eb4b4b',
      'Contraband': '#e4ae39'
    };
    return colors[rarity] || '#b0b3b8';
  };

  const getSizeClass = (size) => {
    const sizes = {
      small: 'skin-image-small',
      medium: 'skin-image-medium',
      large: 'skin-image-large',
      xl: 'skin-image-xl'
    };
    return sizes[size] || 'skin-image-medium';
  };

  return (
    <div 
      className={`skin-image-container ${getSizeClass(size)} ${className}`}
      style={showRarity && skin?.rarity ? {
        '--rarity-color': getRarityColor(skin.rarity)
      } : {}}
      {...props}
    >
      <OptimizedImage
        src={getImageUrl(skin)}
        alt={skin?.name || 'Skin CS2'}
        className="skin-image"
        fallback="https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhhwszJemkV08-jgZKKkuXLPr7Vn35cppwl3r3E9NWt3gLm_xE_N2-mJ4WQc1M3Y1rW-lfolO3p1pO-vJzJz3Rl6XJw5CjD30vgzA/256fx256f"
        lazy={true}
      />
      
      {showRarity && skin?.rarity && (
        <div className="rarity-indicator">
          <div 
            className="rarity-bar"
            style={{ backgroundColor: getRarityColor(skin.rarity) }}
          ></div>
        </div>
      )}
      
      {skin?.name && (
        <div className="skin-name-overlay">
          <span className="skin-name">{skin.name}</span>
          {skin.weapon && (
            <span className="skin-weapon">{skin.weapon}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour les avatars utilisateur optimisés
export const UserAvatar = ({ 
  user, 
  size = 'medium', 
  className = '',
  showOnlineStatus = false,
  ...props 
}) => {
  const getAvatarUrl = (user) => {
    if (user?.avatar) return user.avatar;
    if (user?.username) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff&size=128`;
    }
    return 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=128';
  };

  const getSizeClass = (size) => {
    const sizes = {
      small: 'avatar-small',
      medium: 'avatar-medium',
      large: 'avatar-large',
      xl: 'avatar-xl'
    };
    return sizes[size] || 'avatar-medium';
  };

  return (
    <div 
      className={`user-avatar-container ${getSizeClass(size)} ${className}`}
      {...props}
    >
      <OptimizedImage
        src={getAvatarUrl(user)}
        alt={user?.username || 'Utilisateur'}
        className="user-avatar"
        fallback="https://ui-avatars.com/api/?name=User&background=random&color=fff&size=128"
        lazy={true}
      />
      
      {showOnlineStatus && user?.lastLogin && (
        <div className="online-status">
          <div 
            className={`status-dot ${Date.now() - new Date(user.lastLogin) < 300000 ? 'online' : 'offline'}`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
