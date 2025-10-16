import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './UserProfileDropdown.css';

const UserProfileDropdown = ({ user, onLogout, isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserStats();
    }
  }, [isOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/stats');
      setUserStats(response.data);
    } catch (error) {
      console.error('Erreur récupération stats utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      onLogout();
      navigate('/');
    }
  };

  const getLevelProgress = () => {
    if (!userStats) return 0;
    const currentLevelXP = (userStats.level - 1) * 1000;
    const nextLevelXP = userStats.level * 1000;
    const progressXP = userStats.xp - currentLevelXP;
    const totalXPNeeded = nextLevelXP - currentLevelXP;
    return Math.min(100, (progressXP / totalXPNeeded) * 100);
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

  if (!isOpen) return null;

  return (
    <div className="user-profile-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <div className="user-info">
          <div className="user-avatar">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff`} 
              alt={user.username}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff`;
              }}
            />
          </div>
          <div className="user-details">
            <div className="username">{user.username}</div>
            <div className="user-level">
              Niveau {userStats?.level || 1}
            </div>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="dropdown-content">
        {/* XP Progress */}
        {userStats && (
          <div className="xp-progress">
            <div className="xp-info">
              <span className="xp-current">{userStats.xp.toLocaleString()} XP</span>
              <span className="xp-next">{(userStats.level * 1000).toLocaleString()} XP</span>
            </div>
            <div className="xp-bar">
              <div 
                className="xp-fill" 
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {userStats && (
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-icon">🎁</div>
              <div className="stat-info">
                <div className="stat-value">{userStats.totalCasesOpened}</div>
                <div className="stat-label">Cases ouvertes</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✨</div>
              <div className="stat-info">
                <div className="stat-value">{userStats.totalSkinsObtained}</div>
                <div className="stat-label">Skins obtenues</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-value">{userStats.achievements?.length || 0}</div>
                <div className="stat-label">Succès</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="dropdown-nav">
          <Link to="/dashboard" className="nav-link" onClick={onClose}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">{t('navigation.dashboard', 'Tableau de bord')}</span>
          </Link>
          <Link to="/inventory" className="nav-link" onClick={onClose}>
            <span className="nav-icon">🎒</span>
            <span className="nav-text">{t('navigation.inventory', 'Inventaire')}</span>
          </Link>
          <Link to="/skinchanger" className="nav-link" onClick={onClose}>
            <span className="nav-icon">🎨</span>
            <span className="nav-text">{t('navigation.skinchanger', 'Skinchanger')}</span>
          </Link>
          <Link to="/servers" className="nav-link" onClick={onClose}>
            <span className="nav-icon">🖥️</span>
            <span className="nav-text">{t('navigation.servers', 'Serveurs')}</span>
          </Link>
          <Link to="/profile" className="nav-link" onClick={onClose}>
            <span className="nav-icon">👤</span>
            <span className="nav-text">{t('profile.title', 'Profil')}</span>
          </Link>
          <Link to="/settings" className="nav-link" onClick={onClose}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">{t('settings.title', 'Paramètres')}</span>
          </Link>
        </div>

        {/* Premium Status */}
        {user.isPremium && (
          <div className="premium-status">
            <div className="premium-badge">
              <span className="premium-icon">👑</span>
              <span className="premium-text">Premium</span>
            </div>
            <div className="premium-expiry">
              Expire le {new Date(user.premiumExpires).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="dropdown-actions">
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">{t('auth.logout', 'Déconnexion')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
