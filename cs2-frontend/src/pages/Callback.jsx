import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundWrapper from '../components/BackgroundWrapper';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login'); // si pas de token
    }
  }, [navigate]);

  return (
    <BackgroundWrapper 
      hueShift={270}
      noiseIntensity={0.03}
      scanlineIntensity={0.02}
      speed={0.15}
      warpAmount={0.05}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: '#fff'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            marginBottom: '20px',
            fontSize: '2rem'
          }}>
            ⚡
          </div>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>
            Connexion en cours...
          </p>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Callback;
