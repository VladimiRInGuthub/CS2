import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';
import SkinStats from '../components/SkinStats';

const DashboardNew = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        setUser(userRes.data);
        
        // Mock stats pour la démonstration
        setStats({
          totalCasesOpened: 25,
          totalSkinsObtained: 18,
          favoriteWeapon: 'AK-47',
          currentLevel: 15,
          xpToNext: 250,
          isPremium: false,
          recentActivity: [
            { type: 'case_opened', item: 'AK-47 | Redline', time: '2 min' },
            { type: 'skin_applied', item: 'AWP | Dragon Lore', time: '5 min' },
            { type: 'server_joined', item: 'Deathmatch Pro #1', time: '10 min' }
          ]
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    loadData();
  }, [navigate]);

  const quickActions = [
    { 
      title: 'Ouvrir des Cases', 
      icon: '📦', 
      path: '/cases', 
      color: '#a259ff',
      description: 'Découvrez de nouveaux skins'
    },
    { 
      title: 'Skinchanger', 
      icon: '🎨', 
      path: '/skinchanger', 
      color: '#4CAF50',
      description: 'Personnalisez vos armes'
    },
    { 
      title: 'Serveurs', 
      icon: '🖥️', 
      path: '/servers', 
      color: '#2196F3',
      description: 'Rejoignez nos serveurs'
    },
    { 
      title: 'Battlepass', 
      icon: '🏆', 
      path: '/battlepass', 
      color: '#FF9800',
      description: 'Progression et récompenses'
    },
    { 
      title: 'Inventaire', 
      icon: '🎒', 
      path: '/inventory', 
      color: '#9C27B0',
      description: 'Gérez votre collection'
    },
    { 
      title: 'Premium', 
      icon: '⭐', 
      path: '/premium', 
      color: '#FFD700',
      description: 'Débloquez tout le potentiel'
    }
  ];

  const handleLogout = () => {
    window.location.href = '/auth/logout';
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement du Dashboard...
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
          🎯 Dashboard
        </h1>
        <p style={{ color: '#cfcfff', fontSize: '1.2rem', marginBottom: '20px' }}>
          Bienvenue dans votre espace de jeu personnel
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '30px', 
        maxWidth: '1600px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Profil utilisateur */}
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '25px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
            👤 Profil
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <img
              src={user.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VPC90ZXh0Pgo8L3N2Zz4='}
              alt="Avatar"
              style={{ borderRadius: '50%', width: '60px', height: '60px', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>
                {user.username}
              </h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                Joueur depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '10px'
          }}>
            <CoinIcon size={20} />
            <span style={{ color: '#FFD700', fontSize: '1.3rem', fontWeight: 'bold' }}>
              {user.coins} coins
            </span>
          </div>

          {stats && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '10px' }}>
                📊 Statistiques
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ color: '#a259ff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {stats.totalCasesOpened}
                  </div>
                  <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                    Cases ouvertes
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <div style={{ color: '#4CAF50', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {stats.totalSkinsObtained}
                  </div>
                  <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                    Skins obtenus
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(90deg, #dc3545, #c82333)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            🚪 Se déconnecter
          </button>
        </div>

        {/* Activité récente */}
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '25px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
            📈 Activité Récente
          </h3>
          
          {stats && stats.recentActivity.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>
                {activity.type === 'case_opened' ? '📦' : 
                 activity.type === 'skin_applied' ? '🎨' : '🖥️'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                  {activity.item}
                </div>
                <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                  Il y a {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div style={{ 
        marginTop: '30px', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
          ⚡ Actions Rapides
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          maxWidth: '1400px', 
          margin: '0 auto'
        }}>
          {quickActions.map((action, index) => (
            <div
              key={action.path}
              onClick={() => navigate(action.path)}
              style={{
                backgroundColor: 'rgba(28, 28, 42, 0.9)',
                borderRadius: '15px',
                padding: '20px',
                backdropFilter: 'blur(15px)',
                border: `2px solid ${action.color}40`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = `${action.color}40`;
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                {action.icon}
              </div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>
                {action.title}
              </h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem', margin: 0 }}>
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progression Battlepass */}
      {stats && (
        <div style={{ 
          marginTop: '40px', 
          position: 'relative', 
          zIndex: 1 
        }}>
          <div style={{
            backgroundColor: 'rgba(28, 28, 42, 0.9)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FFD700', fontSize: '1.4rem', marginBottom: '15px' }}>
              🏆 Progression Battlepass
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                Niveau {stats.currentLevel}
              </span>
              <span style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                {stats.xpToNext} XP jusqu'au suivant
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '15px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '75%',
                height: '100%',
                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <button
              onClick={() => navigate('/battlepass')}
              style={{
                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                color: '#000',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Voir le Battlepass complet
            </button>
          </div>
        </div>
      )}

      {/* Statistiques des skins */}
      <div style={{ 
        marginTop: '40px', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <SkinStats />
      </div>
    </div>
  );
};

export default DashboardNew;
