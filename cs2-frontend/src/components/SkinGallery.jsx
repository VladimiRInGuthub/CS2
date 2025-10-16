import React, { useState, useEffect, useMemo } from 'react';
import csgoskinsAPI from '../services/csgoskinsApi';
import DarkVeil from './DarkVeil';
import CoinIcon from './CoinIcon';

/**
 * Composant SkinGallery - Affiche les skins CS2 avec données réelles de l'API
 */
const SkinGallery = ({ onSkinSelect, showPrices = true, showFilters = true }) => {
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    weapon: '',
    rarity: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    orderBy: 'popularity'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiStatus, setApiStatus] = useState(true);

  // Options de filtres
  const weaponOptions = [
    'AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Desert Eagle', 'USP-S', 'Glock-18', 
    'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'P90', 'MP9', 'MAC-10', 
    'UMP-45', 'PP-Bizon', 'MP7', 'MP5-SD', 'FAMAS', 'Galil AR', 'SG 553', 
    'AUG', 'SSG 08', 'SCAR-20', 'G3SG1', 'M249', 'Negev', 'Nova', 'XM1014', 
    'MAG-7', 'Sawed-Off', 'Knife', 'Gloves'
  ];

  const rarityOptions = [
    'Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 
    'Restricted', 'Classified', 'Covert', 'Contraband'
  ];

  const colorOptions = [
    'Black', 'Blue', 'Brown', 'Cyan', 'Gold', 'Gray', 'Green', 
    'Orange', 'Pink', 'Purple', 'Red', 'White', 'Yellow'
  ];

  const orderOptions = [
    { value: 'popularity', label: 'Popularité' },
    { value: 'rarity', label: 'Rareté' },
    { value: 'lowestPrice', label: 'Prix croissant' },
    { value: 'highestPrice', label: 'Prix décroissant' },
    { value: 'newest', label: 'Plus récent' },
    { value: 'alphabetically', label: 'Alphabétique' }
  ];

  // Charger les skins
  useEffect(() => {
    loadSkins();
  }, [filters, currentPage]);

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        loadSkins();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadSkins = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier le statut de l'API
      const isApiAvailable = await csgoskinsAPI.checkAPIStatus();
      setApiStatus(isApiAvailable);

      const apiFilters = {
        ...filters,
        limit: 20,
        page: currentPage
      };

      // Nettoyer les filtres vides
      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key] === '' || apiFilters[key] === null) {
          delete apiFilters[key];
        }
      });

      const data = await csgoskinsAPI.getSkins(apiFilters);
      
      if (data && data.skins) {
        setSkins(data.skins);
        setTotalPages(Math.ceil(data.total / 20) || 1);
      } else {
        setSkins([]);
      }
    } catch (err) {
      console.error('Erreur chargement skins:', err);
      setError('Erreur lors du chargement des skins');
      setSkins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await csgoskinsAPI.searchSkins(searchQuery);
      setSkins(results.skins || results);
      setTotalPages(1);
    } catch (err) {
      console.error('Erreur recherche:', err);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      weapon: '',
      rarity: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      orderBy: 'popularity'
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Consumer Grade': '#B0B3B8',
      'Industrial Grade': '#5E98D9',
      'Mil-Spec Grade': '#4B69FF',
      'Restricted': '#8847FF',
      'Classified': '#D32CE6',
      'Covert': '#EB4B4B',
      'Contraband': '#E4AE39'
    };
    return colors[rarity] || '#666666';
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const handleSkinClick = (skin) => {
    if (onSkinSelect) {
      onSkinSelect(skin);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      {/* Fond animé */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DarkVeil hueShift={120} noiseIntensity={0.03} scanlineIntensity={0.02} speed={0.15} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '10px', textShadow: '0 0 20px #00ff88' }}>
          🎨 Galerie de Skins CS2
        </h1>
        {!apiStatus && (
          <div style={{ 
            background: 'rgba(255, 193, 7, 0.2)', 
            border: '1px solid #ffc107', 
            borderRadius: '8px', 
            padding: '10px', 
            margin: '10px auto',
            maxWidth: '400px',
            color: '#ffc107'
          }}>
            ⚠️ Mode hors ligne - Affichage des données en cache
          </div>
        )}
      </div>

      {/* Filtres et recherche */}
      {showFilters && (
        <div style={{ 
          background: 'rgba(28, 28, 42, 0.9)', 
          borderRadius: '15px', 
          padding: '25px', 
          marginBottom: '30px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Barre de recherche */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Rechercher un skin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '25px',
                border: '2px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00ff88'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />
          </div>

          {/* Filtres */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <select
              value={filters.weapon}
              onChange={(e) => handleFilterChange('weapon', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none'
              }}
            >
              <option value="">Toutes les armes</option>
              {weaponOptions.map(weapon => (
                <option key={weapon} value={weapon}>{weapon}</option>
              ))}
            </select>

            <select
              value={filters.rarity}
              onChange={(e) => handleFilterChange('rarity', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none'
              }}
            >
              <option value="">Toutes les raretés</option>
              {rarityOptions.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>

            <select
              value={filters.color}
              onChange={(e) => handleFilterChange('color', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none'
              }}
            >
              <option value="">Toutes les couleurs</option>
              {colorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            <select
              value={filters.orderBy}
              onChange={(e) => handleFilterChange('orderBy', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none'
              }}
            >
              {orderOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Prix min/max */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <input
              type="number"
              placeholder="Prix minimum ($)"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
            <input
              type="number"
              placeholder="Prix maximum ($)"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={clearFilters}
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #ee5a24)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              🗑️ Effacer les filtres
            </button>
            <button
              onClick={loadSkins}
              style={{
                background: 'linear-gradient(90deg, #00ff88, #00d4aa)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {loading && (
          <div style={{ textAlign: 'center', color: '#fff', fontSize: '1.2rem' }}>
            <div style={{ 
              background: 'rgba(28, 28, 42, 0.9)', 
              padding: '20px', 
              borderRadius: '15px',
              display: 'inline-block',
              backdropFilter: 'blur(15px)'
            }}>
              🔄 Chargement des skins...
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#ff6b6b', 
            fontSize: '1.2rem',
            background: 'rgba(28, 28, 42, 0.9)', 
            padding: '20px', 
            borderRadius: '15px',
            margin: '20px auto',
            maxWidth: '500px',
            backdropFilter: 'blur(15px)'
          }}>
            ❌ {error}
          </div>
        )}

        {!loading && !error && skins.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#cfcfff', 
            fontSize: '1.2rem',
            background: 'rgba(28, 28, 42, 0.9)', 
            padding: '20px', 
            borderRadius: '15px',
            margin: '20px auto',
            maxWidth: '500px',
            backdropFilter: 'blur(15px)'
          }}>
            🔍 Aucun skin trouvé avec ces critères
          </div>
        )}

        {/* Grille des skins */}
        {!loading && !error && skins.length > 0 && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '25px',
              marginBottom: '30px'
            }}>
              {skins.map((skin) => (
                <div
                  key={skin.id}
                  onClick={() => handleSkinClick(skin)}
                  style={{
                    background: 'rgba(28, 28, 42, 0.9)',
                    borderRadius: '15px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    border: `2px solid ${getRarityColor(skin.rarity)}`,
                    backdropFilter: 'blur(15px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 12px 40px ${getRarityColor(skin.rarity)}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Image du skin */}
                  <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <img
                      src={skin.image || '/api/placeholder/200/150'}
                      alt={skin.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: `2px solid ${getRarityColor(skin.rarity)}`
                      }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4=';
                      }}
                    />
                    
                    {/* Badges */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {skin.statTrak && (
                        <div style={{
                          background: '#ff6b6b',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ST
                        </div>
                      )}
                      {skin.souvenir && (
                        <div style={{
                          background: '#ffd700',
                          color: '#000',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          SV
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informations du skin */}
                  <h3 style={{ 
                    color: '#fff', 
                    fontSize: '1.1rem', 
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
                      color: getRarityColor(skin.rarity), 
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {skin.rarity}
                    </span>
                    <span style={{ 
                      color: '#cfcfff', 
                      fontSize: '0.8rem'
                    }}>
                      {skin.exterior}
                    </span>
                  </div>

                  {showPrices && (
                    <div style={{ 
                      color: '#FFD700', 
                      fontWeight: 'bold', 
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      <CoinIcon size={16} />
                      {formatPrice(skin.price)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: '10px',
                marginTop: '30px'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    background: currentPage === 1 ? '#333' : 'linear-gradient(90deg, #00ff88, #00d4aa)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ← Précédent
                </button>

                <span style={{ 
                  color: '#fff', 
                  fontSize: '1rem',
                  background: 'rgba(28, 28, 42, 0.9)',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(15px)'
                }}>
                  Page {currentPage} sur {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    background: currentPage === totalPages ? '#333' : 'linear-gradient(90deg, #00ff88, #00d4aa)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SkinGallery;


