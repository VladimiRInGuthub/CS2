import { useEffect, useState } from 'react';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import '../style.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);

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
          onClick={() => alert("(🔜 bientôt) Interface d'ouverture de caisse")}
          style={buttonStyle}
        >
          🎁 Ouvrir une caisse
        </button>

        <button
          onClick={() => alert("(🔜 bientôt) Interface d'inventaire")}
          style={{ ...buttonStyle, backgroundColor: '#555', marginTop: '12px' }}
        >
          🎒 Voir mon inventaire
        </button>
      </div>
    </div>
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

export default Dashboard;
