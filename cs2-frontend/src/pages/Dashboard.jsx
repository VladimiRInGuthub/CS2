import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';
import GlassSurface from '../components/GlassSurface';
// Styles intégrés dans le composant

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = '/auth/logout';
  };

  useEffect(() => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) {
    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Fond animé DarkVeil */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: -1 
        }}>
          <DarkVeil 
            hueShift={180}
            noiseIntensity={0.05}
            scanlineIntensity={0.03}
            speed={0.2}
            scanlineFrequency={0.005}
            warpAmount={0.1}
          />
        </div>
        <p style={{ 
          color: '#fff', 
          textAlign: 'center', 
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          padding: '20px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px'
    }}>
      {/* Fond animé DarkVeil */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }}>
        <DarkVeil 
          hueShift={180}
          noiseIntensity={0.05}
          scanlineIntensity={0.03}
          speed={0.2}
          scanlineFrequency={0.005}
          warpAmount={0.1}
        />
      </div>

      <GlassSurface 
        variant="card"
        className="dashboard-card"
        brightness="60%"
        saturation="1.1"
        redOffset="10px"
        greenOffset="20px"
        blueOffset="30px"
        style={{
          color: 'white',
          borderRadius: '16px',
          padding: '24px 32px',
          width: '100%',
          maxWidth: '1280px',
          textAlign: 'left',
          boxShadow: '0 0 28px rgba(255,255,255,0.06)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
            <img
              src={user.avatar}
              alt="Avatar"
              style={{ borderRadius: '50%', width: '84px', height: '84px', objectFit: 'cover' }}
            />
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</h2>
              <p style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                <CoinIcon size={18} />
                Coins : {user.coins}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate('/cases')}
              style={buttonStyle}
            >
              🎁 Ouvrir des cases
            </button>
            <button
              onClick={() => navigate('/inventory')}
              style={{ ...buttonStyle, backgroundColor: '#555' }}
            >
              🎒 Voir mon inventaire
            </button>
            <button
              onClick={handleLogout}
              style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
            >
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      </GlassSurface>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#FF6A00',
  color: '#fff',
  border: 'none',
  padding: '14px 20px',
  borderRadius: '10px',
  fontSize: '1rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

export default Dashboard;
