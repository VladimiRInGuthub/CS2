import React, { useState } from 'react';
import GlassSurface from '../components/GlassSurface';
import './Login.css';

const Login = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const canConnect = termsAccepted && ageConfirmed;

  return (
    <div className="login-page">
      <div className="login-container">
        <GlassSurface 
          variant="card" 
          className="login-card"
          brightness="55%"
          saturation="1.05"
          redOffset="0px"
          greenOffset="10px"
          blueOffset="20px"
          rotateX="1deg"
          rotateY="0.5deg"
          translateZ="3px"
        >
          <div className="login-content">
            {/* Section gauche - Texte et formulaire */}
            <div className="login-left">
              <div className="login-header">
                <h1 className="login-title">CS2 DROP</h1>
                <p className="login-subtitle">
                  Rejoignez-nous pour débloquer des fonctionnalités exclusives et commencez votre aventure avec nous !
                </p>
              </div>

              <div className="login-actions">
                <a 
                  href="http://localhost:5000/auth/steam"
                  className={`steam-btn ${canConnect ? 'enabled' : 'disabled'}`}
                  onClick={(e) => {
                    if (!canConnect) {
                      e.preventDefault();
                    }
                    console.log('Steam button clicked, canConnect:', canConnect);
                  }}
                >
                  <GlassSurface 
                    variant="button" 
                    brightness={canConnect ? "70%" : "40%"}
                    saturation={canConnect ? "1.2" : "0.8"}
                    scale={canConnect ? "1.05" : "1"}
                    redOffset="15px"
                    greenOffset="25px"
                    blueOffset="35px"
                  >
                    <span className="btn-icon">🔗</span>
                    <span className="btn-text">CONNECTEZ-VOUS AVEC STEAM</span>
                  </GlassSurface>
                </a>

                <p className="social-label">Ou connectez-vous avec votre compte social</p>
                
                <div className="social-buttons">
                  <a 
                    href="http://localhost:5000/auth/google"
                    className="social-btn google-btn"
                    onClick={(e) => {
                      console.log('Google button clicked');
                    }}
                  >
                    <GlassSurface 
                      variant="button" 
                      brightness="60%"
                      saturation="1.1"
                      redOffset="10px"
                      greenOffset="20px"
                      blueOffset="30px"
                    >
                      <span className="social-icon">G</span>
                    </GlassSurface>
                  </a>
                  
                  <GlassSurface 
                    variant="button" 
                    className="social-btn twitter-btn"
                    brightness="30%"
                    saturation="0.7"
                    disabled
                  >
                    <span className="social-icon">✈️</span>
                  </GlassSurface>
                  
                  {/* Bouton de test pour le développement */}
                  <a 
                    href="http://localhost:5000/auth/test-login"
                    className="social-btn test-btn"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span className="social-icon">🧪</span>
                    <span>Test Login</span>
                  </a>
                </div>
              </div>

              <div className="login-terms">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    J'accepte les{' '}
                    <button type="button" className="link-btn">
                      Conditions de service
                    </button>{' '}
                    et{' '}
                    <button type="button" className="link-btn">
                      la politique de confidentialité
                    </button>
                  </span>
                </label>
                
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    J'ai 18 ans ou plus
                  </span>
                </label>
              </div>
            </div>

            {/* Section droite - Visuel */}
            <div className="login-right">
              <div className="visual-content">
                <div className="character-container">
                  <div className="character">🎯</div>
                  <div className="floating-items">
                    <div className="item item-1">🔫</div>
                    <div className="item item-2">🗡️</div>
                    <div className="item item-3">⚔️</div>
                    <div className="item item-4">🔪</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};

export default Login;
