import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Achievements.css';

const Achievements = ({ userId, showUnlockedOnly = false }) => {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [categories, setCategories] = useState([]);
  const [rarities, setRarities] = useState([]);

  useEffect(() => {
    fetchAchievements();
    fetchCategories();
    fetchRarities();
    
    if (userId) {
      fetchUserAchievements();
    }
  }, [userId]);

  const fetchAchievements = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedRarity !== 'all') params.append('rarity', selectedRarity);
      if (userId) params.append('unlocked', 'true');
      
      const response = await axios.get(`/api/achievements?${params}`);
      setAchievements(response.data);
    } catch (error) {
      console.error('Erreur récupération achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAchievements = async () => {
    try {
      const response = await axios.get(`/api/achievements/user/${userId}`);
      setUserAchievements(response.data.achievements);
    } catch (error) {
      console.error('Erreur récupération achievements utilisateur:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/achievements/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
    }
  };

  const fetchRarities = async () => {
    try {
      const response = await axios.get('/api/achievements/rarities');
      setRarities(response.data);
    } catch (error) {
      console.error('Erreur récupération raretés:', error);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [selectedCategory, selectedRarity]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#b0b3b8',
      uncommon: '#5e98d9',
      rare: '#4b69ff',
      epic: '#8847ff',
      legendary: '#e4ae39'
    };
    return colors[rarity] || '#b0b3b8';
  };

  const getRarityGradient = (rarity) => {
    const gradients = {
      common: 'linear-gradient(135deg, #b0b3b8, #8a8d93)',
      uncommon: 'linear-gradient(135deg, #5e98d9, #4a7bb8)',
      rare: 'linear-gradient(135deg, #4b69ff, #3a52cc)',
      epic: 'linear-gradient(135deg, #8847ff, #6d36cc)',
      legendary: 'linear-gradient(135deg, #e4ae39, #d4a017)'
    };
    return gradients[rarity] || gradients.common;
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (showUnlockedOnly && userId) {
      return achievement.unlocked;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="achievements-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2>{t('achievements.title', 'Achievements')}</h2>
        
        {userId && (
          <div className="achievements-stats">
            <div className="stat-item">
              <span className="stat-value">{userAchievements.length}</span>
              <span className="stat-label">{t('achievements.unlocked', 'Débloqués')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{achievements.length}</span>
              <span className="stat-label">{t('achievements.total', 'Total')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {achievements.length > 0 ? Math.round((userAchievements.length / achievements.length) * 100) : 0}%
              </span>
              <span className="stat-label">{t('achievements.completion', 'Complétion')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="achievements-filters">
        <div className="filter-group">
          <label>{t('achievements.category', 'Catégorie')}:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">{t('achievements.allCategories', 'Toutes les catégories')}</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {t(`achievements.categories.${category._id}`, category._id)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>{t('achievements.rarity', 'Rareté')}:</label>
          <select 
            value={selectedRarity} 
            onChange={(e) => setSelectedRarity(e.target.value)}
          >
            <option value="all">{t('achievements.allRarities', 'Toutes les raretés')}</option>
            {rarities.map(rarity => (
              <option key={rarity._id} value={rarity._id}>
                {t(`achievements.rarities.${rarity._id}`, rarity._id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map((achievement) => (
          <div 
            key={achievement._id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
            style={{
              '--rarity-color': getRarityColor(achievement.rarity),
              '--rarity-gradient': getRarityGradient(achievement.rarity)
            }}
          >
            <div className="achievement-icon">
              {achievement.unlocked ? achievement.icon : '🔒'}
            </div>
            
            <div className="achievement-content">
              <h3 className="achievement-name">
                {achievement.unlocked ? achievement.name : '???'}
              </h3>
              
              <p className="achievement-description">
                {achievement.unlocked ? achievement.description : t('achievements.hidden', 'Achievement caché')}
              </p>
              
              <div className="achievement-meta">
                <span className="achievement-category">
                  {t(`achievements.categories.${achievement.category}`, achievement.category)}
                </span>
                <span className="achievement-rarity">
                  {t(`achievements.rarities.${achievement.rarity}`, achievement.rarity)}
                </span>
              </div>
              
              {achievement.unlocked && achievement.rewards && (
                <div className="achievement-rewards">
                  {achievement.rewards.xp > 0 && (
                    <span className="reward-item">
                      +{achievement.rewards.xp} XP
                    </span>
                  )}
                  {achievement.rewards.xcoins > 0 && (
                    <span className="reward-item">
                      +{achievement.rewards.xcoins} Xcoins
                    </span>
                  )}
                  {achievement.rewards.title && (
                    <span className="reward-item title">
                      {achievement.rewards.title}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {achievement.unlocked && (
              <div className="achievement-unlocked-badge">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="no-achievements">
          <div className="no-achievements-icon">🏆</div>
          <p>{t('achievements.noAchievements', 'Aucun achievement trouvé')}</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
