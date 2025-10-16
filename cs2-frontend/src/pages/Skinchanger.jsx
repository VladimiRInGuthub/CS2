import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';

const Skinchanger = () => {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedWeapon, setSelectedWeapon] = useState('ak47');
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const weapons = [
    { id: 'ak47', name: 'AK-47', category: 'Rifle' },
    { id: 'm4a4', name: 'M4A4', category: 'Rifle' },
    { id: 'awp', name: 'AWP', category: 'Sniper' },
    { id: 'glock', name: 'Glock-18', category: 'Pistol' },
    { id: 'usp', name: 'USP-S', category: 'Pistol' },
    { id: 'knife', name: 'Couteau', category: 'Knife' },
    { id: 'gloves', name: 'Gants', category: 'Gloves' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, inventoryRes] = await Promise.all([
          axios.get('/api/users/me', { withCredentials: true }),
          axios.get('/api/inventory', { withCredentials: true })
        ]);

        setUser(userRes.data);
        const inventoryData = inventoryRes.data.inventory || inventoryRes.data || [];
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      } catch (error) {
        console.error('Erreur chargement:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const getWeaponSkins = (weaponId) => {
    if (!Array.isArray(inventory)) {
      return [];
    }
    
    return inventory.filter(item => {
      const skin = item.skin;
      if (!skin) return false;
      
      return skin.weaponType === weaponId || 
             (weaponId === 'knife' && skin.category === 'Knife') ||
             (weaponId === 'gloves' && skin.category === 'Gloves');
    });
  };

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

  const applySkin = async (skin) => {
    try {
      await axios.post('/api/skinchanger/apply', 
        { weaponType: selectedWeapon, skinId: skin._id },
        { withCredentials: true }
      );
      
      setSelectedSkin(skin);
      // Notification de succès
      alert(`Skin ${skin.name} appliqué avec succès !`);
    } catch (error) {
      console.error('Erreur application skin:', error);
      alert('Erreur lors de l\'application du skin');
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement du Skinchanger...
        </div>
      </div>
    );
  }

  const weaponSkins = getWeaponSkins(selectedWeapon);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      {/* Fond animé */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '10px', textShadow: '0 0 20px #a259ff' }}>
          🎨 Skinchanger
        </h1>
        <p style={{ color: '#cfcfff', fontSize: '1.2rem', marginBottom: '20px' }}>
          Personnalisez vos armes avec vos skins obtenus
        </p>
        {user && (
          <p style={{ color: '#cfcfff', fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <CoinIcon size={18} /> {user.coins} coins disponibles
          </p>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr', 
        gap: '30px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Sélection d'arme */}
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '25px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
            🎯 Sélection d'arme
          </h3>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            {weapons.map((weapon) => (
              <button
                key={weapon.id}
                onClick={() => setSelectedWeapon(weapon.id)}
                style={{
                  background: selectedWeapon === weapon.id 
                    ? 'linear-gradient(90deg, #a259ff, #3f2b96)' 
                    : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{weapon.name}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{weapon.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sélection de skin */}
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '25px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center' }}>
            🎨 Skins disponibles ({weaponSkins.length})
          </h3>
          
          {weaponSkins.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#cfcfff', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>😔</p>
              <p>Aucun skin disponible pour cette arme</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>
                Ouvrez des cases pour obtenir des skins !
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '15px',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {weaponSkins.map((item) => {
                const skin = item.skin;
                if (!skin) return null;
                
                return (
                  <div
                    key={skin._id}
                    onClick={() => applySkin(skin)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      padding: '15px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `2px solid ${getRarityColor(skin.rarity)}`,
                      opacity: selectedSkin?._id === skin._id ? 1 : 0.8
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.opacity = selectedSkin?._id === skin._id ? 1 : 0.8;
                    }}
                  >
                    <img 
                      src={skin.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ta2luPC90ZXh0Pgo8L3N2Zz4='}
                      alt={skin.name}
                      style={{ 
                        width: '100%', 
                        height: '80px', 
                        objectFit: 'cover', 
                        borderRadius: '5px',
                        marginBottom: '10px'
                      }}
                    />
                    
                    <h4 style={{ 
                      color: '#fff', 
                      fontSize: '0.9rem', 
                      marginBottom: '5px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {skin.name}
                    </h4>
                    
                    <span style={{ 
                      color: getRarityColor(skin.rarity), 
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {skin.rarity}
                    </span>
                    
                    {selectedSkin?._id === skin._id && (
                      <div style={{ 
                        marginTop: '5px', 
                        color: '#4CAF50', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        ✓ Appliqué
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Information de sécurité */}
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(76, 175, 80, 0.3)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#4CAF50', fontSize: '1.2rem', marginBottom: '10px' }}>
            🔒 Sécurité garantie
          </h3>
          <p style={{ color: '#cfcfff', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Les skins appliqués via le Skinchanger sont <strong>uniquement visibles sur nos serveurs dédiés</strong>. 
            Aucun risque de bannissement VAC - vos skins ne sont pas visibles dans le matchmaking officiel de CS2.
          </p>
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

export default Skinchanger;
