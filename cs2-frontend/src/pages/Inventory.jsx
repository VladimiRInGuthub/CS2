import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { API_CONFIG } from '../config/apiConfig';
import './Inventory.css';

const Inventory = () => {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    weapon: 'all',
    rarity: 'all',
    quality: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('dateObtained');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState(null);

  const weapons = [
    'all', 'AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Desert Eagle', 'USP-S', 
    'Glock-18', 'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'P90', 
    'MP9', 'MAC-10', 'UMP-45', 'PP-Bizon', 'MP7', 'MP5-SD', 'FAMAS', 
    'Galil AR', 'SG 553', 'AUG', 'SSG 08', 'SCAR-20', 'G3SG1', 
    'M249', 'Negev', 'Nova', 'XM1014', 'MAG-7', 'Sawed-Off', 'Knife', 'Gloves'
  ];

  const rarities = [
    'all', 'Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 
    'Restricted', 'Classified', 'Covert', 'Contraband'
  ];

  const qualities = [
    'all', 'Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'
  ];

  const sortOptions = [
    { value: 'dateObtained', label: t('inventory.dateObtained') },
    { value: 'name', label: t('inventory.name') },
    { value: 'price', label: t('inventory.price') },
    { value: 'rarity', label: t('inventory.rarity') }
  ];

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await fetch('/api/inventory', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement inventaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const skin = item.skin;
    if (!skin) return false;

    // Filtre par arme
    if (filters.weapon !== 'all' && skin.weapon !== filters.weapon) {
      return false;
    }

    // Filtre par rareté
    if (filters.rarity !== 'all' && skin.rarity !== filters.rarity) {
      return false;
    }

    // Filtre par qualité
    if (filters.quality !== 'all' && skin.wear !== filters.quality) {
      return false;
    }

    // Filtre par recherche
    if (filters.search && !skin.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    const skinA = a.skin;
    const skinB = b.skin;
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = skinA.name.localeCompare(skinB.name);
        break;
      case 'price':
        comparison = (skinA.price || 0) - (skinB.price || 0);
        break;
      case 'rarity':
        const rarityOrder = {
          'Consumer Grade': 1,
          'Industrial Grade': 2,
          'Mil-Spec Grade': 3,
          'Restricted': 4,
          'Classified': 5,
          'Covert': 6,
          'Contraband': 7
        };
        comparison = (rarityOrder[skinA.rarity] || 0) - (rarityOrder[skinB.rarity] || 0);
        break;
      case 'dateObtained':
      default:
        comparison = new Date(b.obtainedAt) - new Date(a.obtainedAt);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const getRarityColor = (rarity) => {
    return API_CONFIG.RARITY_CONFIG[rarity]?.color || '#b0b3b8';
  };

  const getWearColor = (wear) => {
    return API_CONFIG.WEAR_CONFIG[wear]?.color || '#4b69ff';
  };

  const toggleFavorite = async (itemId) => {
    try {
      const response = await fetch(`/api/inventory/${itemId}/favorite`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setInventory(prev => prev.map(item => 
          item._id === itemId 
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        ));
      }
    } catch (error) {
      console.error('Erreur toggle favorite:', error);
    }
  };

  const equipSkin = async (itemId, weaponType) => {
    try {
      const response = await fetch(`/api/skinchanger/equip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          itemId,
          weaponType
        })
      });

      if (response.ok) {
        // Recharger l'inventaire pour mettre à jour les équipements
        loadInventory();
      }
    } catch (error) {
      console.error('Erreur équipement skin:', error);
    }
  };

  const showSkinDetails = (item) => {
    setSelectedSkin(item);
    setShowDetails(true);
  };

  const closeSkinDetails = () => {
    setShowDetails(false);
    setSelectedSkin(null);
  };

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <h1>{t('inventory.title')}</h1>
        {stats && (
          <div className="inventory-stats">
            <div className="stat-item">
              <span className="stat-label">{t('inventory.totalSkins')}</span>
              <span className="stat-value">{stats.totalSkins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('inventory.totalValue')}</span>
              <span className="stat-value">${stats.totalValue?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('inventory.favorites')}</span>
              <span className="stat-value">{stats.favorites}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="inventory-controls">
        <div className="filters-section">
          <div className="filter-group">
            <label>{t('inventory.filterBy')} {t('inventory.weapon')}:</label>
            <select 
              value={filters.weapon} 
              onChange={(e) => setFilters(prev => ({ ...prev, weapon: e.target.value }))}
            >
              {weapons.map(weapon => (
                <option key={weapon} value={weapon}>
                  {weapon === 'all' ? t('inventory.allSkins') : weapon}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('inventory.filterBy')} {t('inventory.rarity')}:</label>
            <select 
              value={filters.rarity} 
              onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value }))}
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? t('inventory.allSkins') : rarity}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('inventory.filterBy')} {t('inventory.quality')}:</label>
            <select 
              value={filters.quality} 
              onChange={(e) => setFilters(prev => ({ ...prev, quality: e.target.value }))}
            >
              {qualities.map(quality => (
                <option key={quality} value={quality}>
                  {quality === 'all' ? t('inventory.allSkins') : quality}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t('common.search')}:</label>
            <input
              type="text"
              placeholder={t('inventory.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        <div className="controls-section">
          <div className="sort-controls">
            <label>{t('inventory.sortBy')}:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button 
              className="sort-order-btn"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Display */}
      <div className={`inventory-display ${viewMode}`}>
        <AnimatePresence>
          {sortedInventory.map((item, index) => (
            <motion.div
              key={item._id}
              className="inventory-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="item-image-container">
                <img 
                  src={item.skin.image} 
                  alt={item.skin.name}
                  onClick={() => showSkinDetails(item)}
                />
                {item.isFavorite && (
                  <div className="favorite-badge">❤️</div>
                )}
                <div 
                  className="rarity-border"
                  style={{ borderColor: getRarityColor(item.skin.rarity) }}
                />
              </div>

              <div className="item-info">
                <h4 onClick={() => showSkinDetails(item)}>{item.skin.name}</h4>
                <p className="item-weapon">{item.skin.weapon}</p>
                <p 
                  className="item-rarity"
                  style={{ color: getRarityColor(item.skin.rarity) }}
                >
                  {item.skin.rarity}
                </p>
                <p 
                  className="item-wear"
                  style={{ color: getWearColor(item.skin.wear) }}
                >
                  {item.skin.wear}
                </p>
                {item.float && (
                  <p className="item-float">Float: {item.float.toFixed(4)}</p>
                )}
                <p className="item-price">${item.skin.price?.toFixed(2) || '0.00'}</p>
              </div>

              <div className="item-actions">
                <button 
                  className="favorite-btn"
                  onClick={() => toggleFavorite(item._id)}
                  title={item.isFavorite ? t('inventory.removeFromFavorites') : t('inventory.addToFavorites')}
                >
                  {item.isFavorite ? '❤️' : '🤍'}
                </button>
                <button 
                  className="equip-btn"
                  onClick={() => equipSkin(item._id, item.skin.weaponType)}
                  title={t('inventory.equipSkin')}
                >
                  ⚔️
                </button>
                <button 
                  className="details-btn"
                  onClick={() => showSkinDetails(item)}
                  title={t('inventory.viewDetails')}
                >
                  👁️
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedInventory.length === 0 && (
        <div className="empty-inventory">
          <h3>{t('inventory.noSkins')}</h3>
          <p>{t('inventory.noSkinsDescription')}</p>
        </div>
      )}

      {/* Skin Details Modal */}
      <AnimatePresence>
        {showDetails && selectedSkin && (
          <SkinDetailsModal
            skin={selectedSkin}
            onClose={closeSkinDetails}
            onEquip={equipSkin}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant modal pour les détails du skin
const SkinDetailsModal = ({ skin, onClose, onEquip, onToggleFavorite }) => {
  const { t } = useTranslation();

  const getRarityColor = (rarity) => {
    return API_CONFIG.RARITY_CONFIG[rarity]?.color || '#b0b3b8';
  };

  const getWearColor = (wear) => {
    return API_CONFIG.WEAR_CONFIG[wear]?.color || '#4b69ff';
  };

  return (
    <motion.div
      className="skin-details-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="skin-details-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{skin.skin.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="skin-image-large">
            <img src={skin.skin.image} alt={skin.skin.name} />
            <div 
              className="rarity-glow"
              style={{ 
                boxShadow: `0 0 30px ${getRarityColor(skin.skin.rarity)}40` 
              }}
            />
          </div>

          <div className="skin-details">
            <div className="detail-row">
              <span className="detail-label">{t('inventory.weapon')}:</span>
              <span className="detail-value">{skin.skin.weapon}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('inventory.rarity')}:</span>
              <span 
                className="detail-value"
                style={{ color: getRarityColor(skin.skin.rarity) }}
              >
                {skin.skin.rarity}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('inventory.quality')}:</span>
              <span 
                className="detail-value"
                style={{ color: getWearColor(skin.skin.wear) }}
              >
                {skin.skin.wear}
              </span>
            </div>
            {skin.float && (
              <div className="detail-row">
                <span className="detail-label">{t('inventory.float')}:</span>
                <span className="detail-value">{skin.float.toFixed(4)}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">{t('inventory.estimatedPrice')}:</span>
              <span className="detail-value">${skin.skin.price?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('inventory.obtainedAt')}:</span>
              <span className="detail-value">
                {new Date(skin.obtainedAt).toLocaleDateString()}
              </span>
            </div>
            {skin.caseOpened && (
              <div className="detail-row">
                <span className="detail-label">{t('inventory.obtainedFrom')}:</span>
                <span className="detail-value">{skin.caseOpened}</span>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              className="favorite-btn"
              onClick={() => onToggleFavorite(skin._id)}
            >
              {skin.isFavorite ? '❤️ ' + t('inventory.removeFromFavorites') : '🤍 ' + t('inventory.addToFavorites')}
            </button>
            <button 
              className="equip-btn"
              onClick={() => onEquip(skin._id, skin.skin.weaponType)}
            >
              ⚔️ {t('inventory.equipSkin')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Inventory;