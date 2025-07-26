import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackgroundWrapper from '../components/BackgroundWrapper';
import '../style.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) {
    return (
      <BackgroundWrapper 
        hueShift={180}
        noiseIntensity={0.05}
        scanlineIntensity={0.03}
        speed={0.2}
        scanlineFrequency={0.005}
        warpAmount={0.1}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <div style={{ 
            color: '#fff', 
            textAlign: 'center', 
            backgroundColor: 'rgba(15, 15, 15, 0.8)',
            padding: '40px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              marginBottom: '20px',
              fontSize: '2rem'
            }}>
              ⏳
            </div>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>
              Chargement...
            </p>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper 
      hueShift={180}
      noiseIntensity={0.05}
      scanlineIntensity={0.03}
      speed={0.2}
      scanlineFrequency={0.005}
      warpAmount={0.1}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '30px'
      }}>
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          color: 'white',
          borderRadius: '12px',
          padding: '30px',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(255,255,255,0.05)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <img
            src={user.avatar}
            alt="Avatar"
            style={{ borderRadius: '50%', width: '100px', marginBottom: '20px' }}
          />
          <h2 style={{ marginBottom: '10px' }}>{user.username}</h2>
          <p style={{ marginBottom: '20px' }}>💰 Coins : {user.coins}</p>

          <button
            onClick={() => navigate('/case-opening')}
            style={buttonStyle}
          >
            🎁 Ouvrir une caisse
          </button>

          <button
            onClick={() => navigate('/inventory')}
            style={{ ...buttonStyle, backgroundColor: '#555', marginTop: '12px' }}
          >
            🎒 Voir mon inventaire
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginTop: '20px'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                ...smallButtonStyle,
                backgroundColor: '#333'
              }}
            >
              🔧 Login
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                ...smallButtonStyle,
                backgroundColor: '#333'
              }}
            >
              🏠 Callback
            </button>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

const buttonStyle = {
  backgroundColor: '#FF6A00',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
  width: '100%',
  maxWidth: '300px'
};

const smallButtonStyle = {
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  width: '100%'
};

export default Dashboard;
