import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import GlassSurface from './GlassSurface';
import UserAvatar from './UserAvatar';
import VariableProximity from './VariableProximity';
import './Navigation.css';

const Navigation = ({ isAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('none');
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef(null);
  const animationFrameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me');
          setUser(response.data);
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error);
        }
      };
      fetchUser();
    }
  }, [isAuthenticated]);

  // Détection du scroll avec throttling et direction
  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const currentDirection = scrollTop > lastScrollY ? 'down' : 'up';
        
        // Détection de la direction du scroll
        if (Math.abs(scrollTop - lastScrollY) > 5) {
          setScrollDirection(currentDirection);
        }

        // Réaction immédiate au moindre scroll
        const shouldBeScrolled = scrollTop > 0;
        
        if (shouldBeScrolled !== isScrolled) {
          setIsScrolled(shouldBeScrolled);
        }

        setLastScrollY(scrollTop);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScrolled, lastScrollY]);

  // Gestion des micro-interactions au hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isScrolled) {
      setIsExpanding(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isScrolled) {
      // Délai pour permettre l'expansion complète avant la rétraction
      setTimeout(() => {
        if (!isHovered) {
          setIsExpanding(false);
        }
      }, 100);
    }
  };

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', requiresAuth: true },
    { path: '/cases', label: 'Cases', icon: '📦', requiresAuth: true },
    { path: '/inventory', label: 'Inventory', icon: '🎒', requiresAuth: true },
  ];

  const filteredItems = navItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  // Calcul des classes dynamiques pour les animations
  const getNavClasses = () => {
    const classes = ['navigation'];
    
    if (isScrolled) classes.push('scrolled');
    if (isHovered) classes.push('hovered');
    if (isExpanding) classes.push('expanding');
    if (scrollDirection === 'down') classes.push('scroll-down');
    if (scrollDirection === 'up') classes.push('scroll-up');
    
    return classes.join(' ');
  };

  return (
    <nav 
      ref={navRef}
      className={getNavClasses()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <GlassSurface 
        className="nav-container"
        width="100%"
        height={isScrolled && !isHovered ? 24 : 60}
        borderRadius={isScrolled && !isHovered ? 20 : 50}
        borderWidth={0.5}
        brightness={60}
        opacity={0.85}
        blur={25}
        displace={15}
        backgroundOpacity={0.1}
        saturation={1.1}
        distortionScale={-150}
        redOffset={0}
        greenOffset={15}
        blueOffset={30}
        xChannel="R"
        yChannel="G"
        mixBlendMode="screen"
        style={{
          padding: isScrolled && !isHovered ? "8px 16px" : "16px 32px",
          minHeight: isScrolled && !isHovered ? "24px" : "60px"
        }}
      >
        {!isScrolled || isHovered ? (
          <>
            <div className="nav-brand" ref={containerRef}>
              <div className="brand-icon">🎯</div>
              <VariableProximity
                label="AimCase"
                className="brand-text"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
              />
            </div>
            
            <div className="nav-links">
              {filteredItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    transitionDelay: `${index * 0.02}s`
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="nav-actions">
              {isAuthenticated && user && (
                <div className="coins-display">
                  <span className="coins-icon">💰</span>
                  <span className="coins-amount">{user.coins || 0}</span>
                </div>
              )}
              
              {isAuthenticated ? (
                <UserAvatar user={user} onLogout={handleLogout} />
              ) : (
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="mini-nav">
            <div className="mini-indicator">
              <div className="indicator-dot"></div>
              <div className="indicator-dot"></div>
              <div className="indicator-dot"></div>
            </div>
          </div>
        )}
      </GlassSurface>
    </nav>
  );
};

export default Navigation; 