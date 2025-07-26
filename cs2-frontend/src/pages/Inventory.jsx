import { useState } from 'react';
import BackgroundWrapper from '../components/BackgroundWrapper';

const Inventory = () => {
  const [items] = useState([
    { id: 1, name: 'AK-47 | Redline', rarity: 'Classified', image: '🔫' },
    { id: 2, name: 'AWP | Dragon Lore', rarity: 'Covert', image: '🎯' },
    { id: 3, name: 'Knife | Karambit', rarity: 'Exceedingly Rare', image: '🗡️' },
    { id: 4, name: 'Glock-18 | Fade', rarity: 'Restricted', image: '🔫' },
  ]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Covert': return '#eb4b4b';
      case 'Classified': return '#d32ce6';
      case 'Restricted': return '#8847ff';
      case 'Exceedingly Rare': return '#ffd700';
      default: return '#4b69ff';
    }
  };

  return (
    <BackgroundWrapper 
      hueShift={120}
      noiseIntensity={0.08}
      scanlineIntensity={0.04}
      speed={0.25}
      scanlineFrequency={0.008}
      warpAmount={0.15}
    >
      <div style={{
        minHeight: '100vh',
        padding: '40px 20px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'rgba(15, 15, 15, 0.8)',
            borderRadius: '12px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '30px'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '10px',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #00ff88, #00aaff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎒 Mon Inventaire
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '0' }}>
              Gérez vos objets CS2 et vos gains
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {items.map(item => (
              <div key={item.id} style={{
                backgroundColor: 'rgba(28, 28, 42, 0.9)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                border: `2px solid ${getRarityColor(item.rarity)}`,
                backdropFilter: 'blur(15px)',
                boxShadow: `0 0 20px ${getRarityColor(item.rarity)}33`
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                  {item.image}
                </div>
                <h3 style={{ 
                  marginBottom: '10px',
                  color: getRarityColor(item.rarity)
                }}>
                  {item.name}
                </h3>
                <p style={{ 
                  marginBottom: '15px',
                  color: '#aaa',
                  fontSize: '0.9rem'
                }}>
                  {item.rarity}
                </p>
                <button style={{
                  backgroundColor: getRarityColor(item.rarity),
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Vendre
                </button>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <button style={{
              backgroundColor: 'rgba(15, 15, 15, 0.8)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '15px 30px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              ← Retour au Dashboard
            </button>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default Inventory;