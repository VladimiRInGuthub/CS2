import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
// Styles intégrés dans le composant

const Inventory = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('obtainedAt');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur chargement:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': '#666666',
      'Uncommon': '#4CAF50',
      'Rare': '#2196F3',
      'Epic': '#9C27B0',
      'Legendary': '#FF9800'
    };
    return colors[rarity] || '#666666';
  };

  const getFilteredAndSortedInventory = () => {
    if (!user?.inventory) return [];

    let filtered = user.inventory;

    // Filtrage par rareté
    if (filter !== 'all') {
      filtered = filtered.filter(skin => skin.rarity === filter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Epic': 4, 'Legendary': 5 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'weapon':
          return a.weapon.localeCompare(b.weapon);
        case 'obtainedAt':
          return new Date(b.obtainedAt) - new Date(a.obtainedAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStats = () => {
    if (!user?.inventory) return {};

    const stats = {
      total: user.inventory.length,
      byRarity: {
        Common: 0,
        Uncommon: 0,
        Rare: 0,
        Epic: 0,
        Legendary: 0
      },
      byWeapon: {}
    };

    user.inventory.forEach(skin => {
      stats.byRarity[skin.rarity] = (stats.byRarity[skin.rarity] || 0) + 1;
      stats.byWeapon[skin.weapon] = (stats.byWeapon[skin.weapon] || 0) + 1;
    });

    return stats;
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement de l'inventaire...
        </div>
      </div>
    );
  }

  const inventory = getFilteredAndSortedInventory();
  const stats = getStats();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      {/* Fond animé */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '10px', textShadow: '0 0 20px #a259ff' }}>
          🎒 Inventaire
        </h1>
        {user && (
          <p style={{ color: '#cfcfff', fontSize: '1.2rem' }}>
            💰 {user.coins} coins • 🎁 {stats.total} skins
          </p>
        )}
      </div>

      {/* Statistiques */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto 30px auto',
        position: 'relative',
        zIndex: 1
      }}>
        {Object.entries(stats.byRarity).map(([rarity, count]) => (
          <div key={rarity} style={{
            backgroundColor: 'rgba(28, 28, 42, 0.8)',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center',
            border: `2px solid ${getRarityColor(rarity)}`
          }}>
            <div style={{ color: getRarityColor(rarity), fontSize: '1.5rem', fontWeight: 'bold' }}>
              {count}
            </div>
            <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              {rarity}
            </div>
          </div>
        ))}
      </div>

      {/* Filtres et tri */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 30px auto',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: 'rgba(28, 28, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Toutes les raretés</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Epic</option>
          <option value="Legendary">Legendary</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: 'rgba(28, 28, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <option value="obtainedAt">Date d'obtention</option>
          <option value="rarity">Rareté</option>
          <option value="weapon">Arme</option>
        </select>
      </div>

      {/* Grille d'inventaire */}
      {inventory.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#cfcfff', 
          fontSize: '1.2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <p>🎁 Votre inventaire est vide</p>
          <p>Allez ouvrir des cases pour obtenir des skins !</p>
          <button
            onClick={() => navigate('/cases')}
            style={{
              background: 'linear-gradient(90deg, #a259ff, #3f2b96)',
              color: '#fff',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            🎁 Ouvrir des cases
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px', 
          maxWidth: '1200px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {inventory.map((skin, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(28, 28, 42, 0.9)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: `2px solid ${getRarityColor(skin.rarity)}`,
              backdropFilter: 'blur(15px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <img 
                src={skin.image || 'https://via.placeholder.com/300x200/666666/FFFFFF?text=No+Image'} 
                alt={skin.name}
                style={{ 
                  width: '100%', 
                  height: '180px', 
                  objectFit: 'cover', 
                  borderRadius: '10px',
                  marginBottom: '15px',
                  border: `2px solid ${getRarityColor(skin.rarity)}`
                }}
              />
              
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>
                {skin.name}
              </h3>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <span style={{ 
                  color: getRarityColor(skin.rarity), 
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {skin.rarity}
                </span>
                <span style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                  {skin.weapon}
                </span>
              </div>

              {skin.wear && (
                <p style={{ color: '#b6aaff', fontSize: '0.8rem', marginBottom: '10px' }}>
                  {skin.wear}
                </p>
              )}

              {skin.obtainedAt && (
                <p style={{ color: '#888', fontSize: '0.8rem' }}>
                  Obtenu le {new Date(skin.obtainedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

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

export default Inventory; 