import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';

const Servers = () => {
  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('all');
  const navigate = useNavigate();

  const gameModes = [
    { id: 'all', name: 'Tous les modes', icon: '🎮' },
    { id: 'deathmatch', name: 'Deathmatch', icon: '⚔️' },
    { id: 'retake', name: 'Retake', icon: '🔄' },
    { id: 'surf', name: 'Surf', icon: '🏄' },
    { id: 'bhop', name: 'BHop', icon: '🦘' },
    { id: 'duel', name: 'Duel', icon: '⚡' },
    { id: 'aim', name: 'Aim Training', icon: '🎯' },
    { id: 'kz', name: 'KZ', icon: '🧗' }
  ];

  const mockServers = [
    {
      id: 1,
      name: 'Deathmatch Pro #1',
      mode: 'deathmatch',
      map: 'de_dust2',
      players: 12,
      maxPlayers: 16,
      ping: 15,
      region: 'Europe',
      status: 'online',
      description: 'Serveur Deathmatch professionnel avec skins personnalisés'
    },
    {
      id: 2,
      name: 'Retake Training #2',
      mode: 'retake',
      map: 'de_mirage',
      players: 8,
      maxPlayers: 10,
      ping: 22,
      region: 'Europe',
      status: 'online',
      description: 'Entraînement Retake avec équipes équilibrées'
    },
    {
      id: 3,
      name: 'Surf Paradise',
      mode: 'surf',
      map: 'surf_beginner',
      players: 6,
      maxPlayers: 20,
      ping: 18,
      region: 'Europe',
      status: 'online',
      description: 'Serveur Surf pour débutants et experts'
    },
    {
      id: 4,
      name: 'BHop Masters',
      mode: 'bhop',
      map: 'bhop_easy',
      players: 4,
      maxPlayers: 12,
      ping: 25,
      region: 'Europe',
      status: 'online',
      description: 'Défis BHop avec classements'
    },
    {
      id: 5,
      name: 'Aim Training Elite',
      mode: 'aim',
      map: 'aim_map',
      players: 10,
      maxPlayers: 16,
      ping: 12,
      region: 'Europe',
      status: 'online',
      description: 'Perfectionnement de la précision'
    },
    {
      id: 6,
      name: 'Duel Arena',
      mode: 'duel',
      map: 'de_cache',
      players: 2,
      maxPlayers: 2,
      ping: 20,
      region: 'Europe',
      status: 'online',
      description: 'Duels 1v1 avec skins exclusifs'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        setUser(userRes.data);
        
        // Simuler le chargement des serveurs
        setTimeout(() => {
          setServers(mockServers);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erreur chargement:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    loadData();
  }, [navigate]);

  const getModeIcon = (mode) => {
    const modeData = gameModes.find(m => m.id === mode);
    return modeData ? modeData.icon : '🎮';
  };

  const getModeName = (mode) => {
    const modeData = gameModes.find(m => m.id === mode);
    return modeData ? modeData.name : mode;
  };

  const getStatusColor = (status) => {
    return status === 'online' ? '#4CAF50' : '#f44336';
  };

  const getPingColor = (ping) => {
    if (ping < 50) return '#4CAF50';
    if (ping < 100) return '#FF9800';
    return '#f44336';
  };

  const filteredServers = selectedMode === 'all' 
    ? servers 
    : servers.filter(server => server.mode === selectedMode);

  const connectToServer = (server) => {
    // Simulation de connexion
    alert(`Connexion au serveur "${server.name}"...\n\nSteam://connect/${server.id}.aimcase.gg`);
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement des serveurs...
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      {/* Fond animé */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '10px', textShadow: '0 0 20px #a259ff' }}>
          🖥️ Serveurs d'Entraînement
        </h1>
        <p style={{ color: '#cfcfff', fontSize: '1.2rem', marginBottom: '20px' }}>
          Rejoignez nos serveurs dédiés avec Skinchanger intégré
        </p>
        {user && (
          <p style={{ color: '#cfcfff', fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <CoinIcon size={18} /> {user.coins} coins disponibles
          </p>
        )}
      </div>

      {/* Filtres par mode */}
      <div style={{ 
        marginBottom: '30px', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '15px', textAlign: 'center' }}>
            🎯 Filtres par mode de jeu
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '10px' 
          }}>
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                style={{
                  background: selectedMode === mode.id 
                    ? 'linear-gradient(90deg, #a259ff, #3f2b96)' 
                    : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <span>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des serveurs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '20px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {filteredServers.map((server) => (
          <div key={server.id} style={{
            backgroundColor: 'rgba(28, 28, 42, 0.9)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          onClick={() => connectToServer(server)}
          >
            {/* Header du serveur */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '5px' }}>
                  {getModeIcon(server.mode)} {server.name}
                </h3>
                <p style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                  {getModeName(server.mode)} • {server.map}
                </p>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px' 
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(server.status)
                }}></div>
                <span style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                  {server.status}
                </span>
              </div>
            </div>

            {/* Statistiques du serveur */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#a259ff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {server.players}/{server.maxPlayers}
                </div>
                <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                  Joueurs
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  color: getPingColor(server.ping), 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold' 
                }}>
                  {server.ping}ms
                </div>
                <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                  Ping
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#4CAF50', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {server.region}
                </div>
                <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                  Région
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ 
              color: '#cfcfff', 
              fontSize: '0.9rem', 
              marginBottom: '15px',
              lineHeight: '1.4'
            }}>
              {server.description}
            </p>

            {/* Bouton de connexion */}
            <button
              style={{
                background: 'linear-gradient(90deg, #a259ff, #3f2b96)',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(162, 89, 255, 0.4)'
              }}
            >
              🎮 Rejoindre le serveur
            </button>
          </div>
        ))}
      </div>

      {/* Information sur le Skinchanger */}
      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '25px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(162, 89, 255, 0.3)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#a259ff', fontSize: '1.4rem', marginBottom: '15px' }}>
            🎨 Skinchanger Intégré
          </h3>
          <p style={{ color: '#cfcfff', fontSize: '1rem', lineHeight: '1.6', marginBottom: '15px' }}>
            Tous nos serveurs supportent le <strong>Skinchanger</strong> ! Vos skins obtenus via les cases 
            sont automatiquement appliqués et visibles uniquement sur nos serveurs.
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ color: '#4CAF50', fontSize: '0.9rem' }}>
              ✅ Sécurisé (aucun risque VAC)
            </div>
            <div style={{ color: '#4CAF50', fontSize: '0.9rem' }}>
              ✅ Skins de vos cases
            </div>
            <div style={{ color: '#4CAF50', fontSize: '0.9rem' }}>
              ✅ Changement en temps réel
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '20px', 
        zIndex: 10 
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(28, 28, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          ← Retour au Dashboard
        </button>
      </div>
    </div>
  );
};

export default Servers;
