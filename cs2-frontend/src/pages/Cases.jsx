import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CaseOpening from '../components/CaseOpening';
import { API_CONFIG } from '../config/apiConfig';
import './Cases.css';

const Cases = () => {
  const { t } = useTranslation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isOpeningCase, setIsOpeningCase] = useState(false);
  const [user, setUser] = useState(null);
  const [recentDrops, setRecentDrops] = useState([]);

  const categories = [
    { id: 'all', name: t('cases.allCategories'), icon: '📦' },
    { id: 'starter', name: t('cases.starter'), icon: '🌟' },
    { id: 'premium', name: t('cases.premium'), icon: '💎' },
    { id: 'legendary', name: t('cases.legendary'), icon: '👑' },
    { id: 'knife', name: t('cases.knife'), icon: '🔪' },
    { id: 'gloves', name: t('cases.gloves'), icon: '🧤' },
    { id: 'special', name: t('cases.special'), icon: '⭐' }
  ];

  useEffect(() => {
    loadCases();
    loadUser();
    loadRecentDrops();
  }, []);

  const loadCases = async () => {
    try {
      const response = await fetch('/api/cases', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases);
      }
    } catch (error) {
      console.error('Erreur chargement cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const response = await fetch('/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  };

  const loadRecentDrops = async () => {
    try {
      const response = await fetch('/api/cases/history/global?limit=10', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentDrops(data.recentOpens);
      }
    } catch (error) {
      console.error('Erreur chargement drops récents:', error);
    }
  };

  const filteredCases = selectedCategory === 'all' 
    ? cases 
    : cases.filter(caseItem => caseItem.category === selectedCategory);

  const openCase = (caseData) => {
    setSelectedCase(caseData);
    setIsOpeningCase(true);
  };

  const closeCaseOpening = () => {
    setIsOpeningCase(false);
    setSelectedCase(null);
    // Recharger les données utilisateur après ouverture
    loadUser();
    loadRecentDrops();
  };

  const handleCaseOpened = (result) => {
    // L'ouverture est gérée par le composant CaseOpening
    console.log('Case ouverte:', result);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': '#b0b3b8',
      'Uncommon': '#5e98d9',
      'Rare': '#4b69ff',
      'Epic': '#8847ff',
      'Legendary': '#d32ce6'
    };
    return colors[rarity] || colors['Common'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'starter': '#4CAF50',
      'premium': '#2196F3',
      'legendary': '#FF9800',
      'knife': '#F44336',
      'gloves': '#9C27B0',
      'special': '#FF5722'
    };
    return colors[category] || '#666';
  };

  if (loading) {
    return (
      <div className="cases-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="cases-page">
      {/* Header */}
      <div className="cases-header">
        <h1>{t('cases.title')}</h1>
        <p>{t('cases.availableCases')}</p>
        {user && (
          <div className="user-balance">
            <span className="balance-label">{t('dashboard.currentBalance')}:</span>
            <span className="balance-amount">{user.xcoins} Xcoins</span>
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <div className="categories-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              borderColor: selectedCategory === category.id ? getCategoryColor(category.id) : 'transparent'
            }}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Cases Grid */}
      <div className="cases-grid">
        <AnimatePresence>
          {filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem._id}
              className="case-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openCase(caseItem)}
            >
              <div className="case-image-container">
                <img src={caseItem.image} alt={caseItem.name} />
                {caseItem.isFeatured && (
                  <div className="featured-badge">
                    <span>⭐ {t('cases.featured')}</span>
                  </div>
                )}
                <div className="case-overlay">
                  <div className="case-price">
                    {caseItem.price} Xcoins
                  </div>
                </div>
              </div>
              
              <div className="case-info">
                <h3>{caseItem.name}</h3>
                <p className="case-description">{caseItem.shortDescription || caseItem.description}</p>
                
                <div className="case-stats">
                  <div className="stat">
                    <span className="stat-label">{t('cases.totalItems')}</span>
                    <span className="stat-value">{caseItem.totalItems}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{t('cases.totalOpened')}</span>
                    <span className="stat-value">{caseItem.stats?.totalOpened || 0}</span>
                  </div>
                </div>

                <div className="case-rarity">
                  <span 
                    className="rarity-badge"
                    style={{ 
                      backgroundColor: getRarityColor(caseItem.rarity),
                      color: '#fff'
                    }}
                  >
                    {caseItem.rarity}
                  </span>
                </div>
              </div>

              <button 
                className="open-case-btn"
                disabled={!user || user.xcoins < caseItem.price}
              >
                {!user ? t('auth.login') : 
                 user.xcoins < caseItem.price ? t('cases.insufficientFunds') : 
                 t('cases.openCase')}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recent Drops */}
      {recentDrops.length > 0 && (
        <div className="recent-drops">
          <h2>{t('cases.recentDrops')}</h2>
          <div className="drops-list">
            {recentDrops.map((drop, index) => (
              <motion.div
                key={index}
                className="drop-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="drop-user">
                  <img src={drop.user?.avatar || '/default-avatar.png'} alt={drop.user?.username} />
                  <span>{drop.user?.username}</span>
                </div>
                <div className="drop-skin">
                  <img src={drop.relatedSkin?.image} alt={drop.relatedSkin?.name} />
                  <div className="skin-info">
                    <span className="skin-name">{drop.relatedSkin?.name}</span>
                    <span 
                      className="skin-rarity"
                      style={{ color: getRarityColor(drop.relatedSkin?.rarity) }}
                    >
                      {drop.relatedSkin?.rarity}
                    </span>
                  </div>
                </div>
                <div className="drop-case">
                  <span>{drop.relatedCase?.name}</span>
                </div>
                <div className="drop-time">
                  {new Date(drop.createdAt).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Case Opening Modal */}
      <AnimatePresence>
        {isOpeningCase && selectedCase && (
          <CaseOpening
            caseData={selectedCase}
            onOpen={handleCaseOpened}
            onClose={closeCaseOpening}
            userBalance={user?.xcoins || 0}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cases;