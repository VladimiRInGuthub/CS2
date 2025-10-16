import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('level');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType, timeRange]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stats/leaderboard?type=${selectedType}&limit=50`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Erreur récupération leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank <= 3) return 'top-three';
    if (rank <= 10) return 'top-ten';
    return 'regular';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTypeLabel = (type) => {
    const labels = {
      level: t('leaderboard.level', 'Niveau'),
      xp: t('leaderboard.xp', 'XP'),
      cases: t('leaderboard.cases', 'Cases'),
      skins: t('leaderboard.skins', 'Skins'),
      spent: t('leaderboard.spent', 'Dépensé')
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>{t('leaderboard.title', 'Classement')}</h1>
        <div className="leaderboard-filters">
          <div className="filter-group">
            <label>{t('leaderboard.type', 'Type')}:</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="level">{t('leaderboard.level', 'Niveau')}</option>
              <option value="xp">{t('leaderboard.xp', 'XP')}</option>
              <option value="cases">{t('leaderboard.cases', 'Cases')}</option>
              <option value="skins">{t('leaderboard.skins', 'Skins')}</option>
              <option value="spent">{t('leaderboard.spent', 'Dépensé')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t('leaderboard.timeRange', 'Période')}:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">{t('leaderboard.allTime', 'Tout le temps')}</option>
              <option value="month">{t('leaderboard.thisMonth', 'Ce mois')}</option>
              <option value="week">{t('leaderboard.thisWeek', 'Cette semaine')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-list">
          {leaderboard.map((player, index) => (
            <div 
              key={player.username}
              className={`leaderboard-item ${getRankClass(player.rank)}`}
            >
              <div className="rank">
                <span className="rank-icon">{getRankIcon(player.rank)}</span>
              </div>
              
              <div className="player-info">
                <div className="player-avatar">
                  <img 
                    src={player.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.username)}&background=random&color=fff`}
                    alt={player.username}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.username)}&background=random&color=fff`;
                    }}
                  />
                </div>
                <div className="player-details">
                  <div className="player-name">{player.username}</div>
                  <div className="player-level">Niveau {player.level}</div>
                </div>
              </div>
              
              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">{getTypeLabel(selectedType)}:</span>
                  <span className="stat-value">
                    {selectedType === 'spent' ? 
                      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(player[selectedType] || 0) :
                      formatNumber(player[selectedType] || 0)
                    }
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('leaderboard.xp', 'XP')}:</span>
                  <span className="stat-value">{formatNumber(player.xp)}</span>
                </div>
              </div>
              
              <div className="player-badges">
                {player.rank <= 3 && (
                  <div className="badge top-player">
                    {player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : '🥉'}
                  </div>
                )}
                {player.totalCasesOpened >= 1000 && (
                  <div className="badge case-master">📦</div>
                )}
                {player.totalSkinsObtained >= 500 && (
                  <div className="badge skin-collector">✨</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {leaderboard.length === 0 && (
          <div className="no-data">
            <div className="no-data-icon">🏆</div>
            <p>{t('leaderboard.noData', 'Aucune donnée disponible')}</p>
          </div>
        )}
      </div>
      
      <div className="leaderboard-footer">
        <p>{t('leaderboard.lastUpdated', 'Dernière mise à jour')}: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Leaderboard;
