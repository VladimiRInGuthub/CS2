import React, { useState } from 'react';
import BackgroundWrapper from '../components/BackgroundWrapper';
import '../style.css'; // Assure-toi que ce fichier existe dans src/

const Login = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const canConnect = termsAccepted && ageConfirmed;

  return (
    <BackgroundWrapper 
      hueShift={30}
      noiseIntensity={0.1}
      scanlineIntensity={0.05}
      speed={0.3}
      scanlineFrequency={0.01}
      warpAmount={0.2}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px',
        color: 'white'
      }}>
        {/* Contenu de la page */}
        <div style={{
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          borderRadius: '12px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>CS2 DROP</h1>
          <p style={{ fontSize: '1rem', marginBottom: '30px', textAlign: 'center' }}>
            Rejoignez-nous pour débloquer des fonctionnalités exclusives et commencez votre aventure avec nous !
          </p>

          <button
            disabled={!canConnect}
            onClick={() => window.location.href = 'http://localhost:5000/auth/steam'}
            style={{
              backgroundColor: canConnect ? '#FF6A00' : '#555',
              color: '#fff',
              padding: '14px 28px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: canConnect ? 'pointer' : 'not-allowed',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            🔗 Connectez-vous avec Steam
          </button>

          <p style={{ marginBottom: '10px' }}>Ou connectez-vous avec un compte social</p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center' }}>
            <button onClick={() => window.location.href = 'http://localhost:5000/auth/google'} style={socialBtnStyle}>G</button>
            <button disabled style={socialBtnStyle}>✈️</button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'left',
            maxWidth: '400px',
            width: '100%'
          }}>
            <label style={checkboxStyle}>
              <input type="checkbox" onChange={(e) => setTermsAccepted(e.target.checked)} />
              J'accepte les <a href="#" style={{ color: '#FF6A00' }}>Conditions de service</a> et <a href="#" style={{ color: '#FF6A00' }}>la politique de confidentialité</a>
            </label>
            <label style={checkboxStyle}>
              <input type="checkbox" onChange={(e) => setAgeConfirmed(e.target.checked)} />
              J'ai 18 ans ou plus
            </label>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

const socialBtnStyle = {
  backgroundColor: '#222',
  color: '#fff',
  fontSize: '1.2rem',
  padding: '10px 18px',
  border: '1px solid #555',
  borderRadius: '4px',
  cursor: 'pointer'
};

const checkboxStyle = {
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

export default Login;
