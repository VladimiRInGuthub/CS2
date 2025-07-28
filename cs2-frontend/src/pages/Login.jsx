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
          <div className="login-header">
            <h1 className="login-title">CS2 DROP</h1>
            <p className="login-subtitle">
              Rejoignez-nous pour débloquer des fonctionnalités exclusives et commencez votre aventure avec nous !
            </p>
          </div>

          <div className="login-actions">
            <GlassSurface 
              variant="button" 
              className={`steam-btn ${canConnect ? 'enabled' : 'disabled'}`}
              brightness={canConnect ? "70%" : "40%"}
              saturation={canConnect ? "1.2" : "0.8"}
              scale={canConnect ? "1.05" : "1"}
              redOffset="15px"
              greenOffset="25px"
              blueOffset="35px"
              onClick={() => {
                if (canConnect) {
                  window.location.href = 'http://localhost:5000/auth/steam';
                }
              }}
            >
              🔗 Connectez-vous avec Steam
            </GlassSurface>

            <p className="social-label">Ou connectez-vous avec un compte social</p>
            
            <div className="social-buttons">
              <GlassSurface 
                variant="button" 
                className="social-btn"
                brightness="60%"
                saturation="1.1"
                redOffset="10px"
                greenOffset="20px"
                blueOffset="30px"
                onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
              >
                G
              </GlassSurface>
              <GlassSurface 
                variant="button" 
                className="social-btn disabled"
                brightness="30%"
                saturation="0.7"
                disabled
              >
                ✈️
              </GlassSurface>
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
        </GlassSurface>
      </div>
    </div>
  );
};

export default Login;
