import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import CoinIcon from './CoinIcon';
import LanguageSelector from './LanguageSelector';
import Notifications from './Notifications';
import UserProfileDropdown from './UserProfileDropdown';
import './Navigation.css';

const Navigation = ({ isAuthenticated }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/auth/logout';
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('/api/users/me', { withCredentials: true });
          setUser(response.data);
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error);
        }
      };
      fetchUser();
    }
  }, [isAuthenticated]);

  // Récupérer les notifications non lues
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadNotifications = async () => {
        try {
          const response = await axios.get('/api/notifications/unread-count', { withCredentials: true });
          setUnreadNotifications(response.data.count);
        } catch (error) {
          console.error('Erreur récupération notifications:', error);
        }
      };
      
      fetchUnreadNotifications();
      
      // Polling toutes les 30 secondes pour les nouvelles notifications
      const interval = setInterval(fetchUnreadNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation principale - style maquette
  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/cases', label: 'Pricing', icon: '📦', requiresAuth: true },
    { path: '/servers', label: 'Download', icon: '🖥️', requiresAuth: true },
    { path: '/inventory', label: 'FAQ', icon: '❓', requiresAuth: true },
    { path: '/settings', label: 'Contact', icon: '📞', requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-brand">
          <Link to="/home" className="brand-link">
            <span className="brand-icon">🎯</span>
            <span className="brand-text">AimCase</span>
          </Link>
        </div>

        {/* Menu principal */}
        <div className="nav-menu">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Actions utilisateur */}
        <div className="nav-actions">
          {isAuthenticated && user && (
            <div className="coins-display">
              <CoinIcon size={16} />
              <span className="coins-amount">{user.xcoins || 0}</span>
            </div>
          )}
          
          <LanguageSelector />
          
          {isAuthenticated ? (
            <>
              <button 
                className="notifications-btn"
                onClick={() => setNotificationsOpen(true)}
                title={t('notifications.title', 'Notifications')}
              >
                <span className="notification-icon">🔔</span>
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </button>
              
              <div className="user-profile-container">
                <button 
                  className="user-profile-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=random&color=fff`}
                    alt={user?.username}
                    className="user-profile-avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=random&color=fff`;
                    }}
                  />
                </button>
                
                <UserProfileDropdown 
                  user={user}
                  onLogout={handleLogout}
                  isOpen={profileDropdownOpen}
                  onClose={() => setProfileDropdownOpen(false)}
                />
              </div>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              {t('navigation.login')}
            </Link>
          )}

          {/* Menu mobile */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Menu"
          >
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button 
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mobile-menu-items">
              {filteredNavItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-menu-icon">{item.icon}</span>
                  <span className="mobile-menu-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Composants modaux */}
      <Notifications 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </nav>
  );
};

export default Navigation;