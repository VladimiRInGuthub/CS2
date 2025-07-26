import { useState } from 'react';
import BackgroundWrapper from '../components/BackgroundWrapper';

const CaseOpening = () => {
  const [isOpening, setIsOpening] = useState(false);
  const [openedItem, setOpenedItem] = useState(null);

  const cases = [
    { id: 1, name: 'Prisma Case', price: 100, image: '📦' },
    { id: 2, name: 'Operation Hydra Case', price: 250, image: '🎁' },
    { id: 3, name: 'Glove Case', price: 500, image: '📦' },
  ];

  const handleOpenCase = (caseItem) => {
    setIsOpening(true);
    setOpenedItem(null);
    
    setTimeout(() => {
      const items = [
        { name: 'AK-47 | Redline', rarity: 'Classified', image: '🔫' },
        { name: 'AWP | Asiimov', rarity: 'Covert', image: '🎯' },
        { name: 'Knife | Karambit', rarity: 'Exceedingly Rare', image: '🗡️' },
      ];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setOpenedItem(randomItem);
      setIsOpening(false);
    }, 3000);
  };

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
      hueShift={300}
      noiseIntensity={0.12}
      scanlineIntensity={0.08}
      speed={0.4}
      scanlineFrequency={0.015}
      warpAmount={0.25}
    >
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        color: 'white'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          borderRadius: '12px',
          padding: '40px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #ff00ff, #ff6600)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎁 Ouverture de Caisses
          </h1>

          {isOpening && (
            <div style={{
              fontSize: '4rem',
              marginBottom: '30px',
              animation: 'pulse 1s infinite'
            }}>
              ✨🎲✨
            </div>
          )}

          {openedItem && (
            <div style={{
              backgroundColor: 'rgba(28, 28, 42, 0.9)',
              borderRadius: '12px',
              padding: '30px',
              marginBottom: '30px',
              border: `3px solid ${getRarityColor(openedItem.rarity)}`,
              boxShadow: `0 0 30px ${getRarityColor(openedItem.rarity)}66`
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                {openedItem.image}
              </div>
              <h2 style={{ 
                color: getRarityColor(openedItem.rarity),
                marginBottom: '10px'
              }}>
                {openedItem.name}
              </h2>
              <p style={{ color: '#aaa' }}>{openedItem.rarity}</p>
            </div>
          )}

          {!isOpening && !openedItem && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {cases.map(caseItem => (
                <div key={caseItem.id} style={{
                  backgroundColor: 'rgba(28, 28, 42, 0.9)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                    {caseItem.image}
                  </div>
                  <h3 style={{ marginBottom: '10px' }}>{caseItem.name}</h3>
                  <p style={{ color: '#FFD700', marginBottom: '15px' }}>
                    💰 {caseItem.price} coins
                  </p>
                  <button 
                    onClick={() => handleOpenCase(caseItem)}
                    style={{
                      backgroundColor: '#FF6A00',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      width: '100%'
                    }}
                  >
                    Ouvrir
                  </button>
                </div>
              ))}
            </div>
          )}

          {(openedItem || isOpening) && (
            <button 
              onClick={() => {
                setOpenedItem(null);
                setIsOpening(false);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '15px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Nouvelle Ouverture
            </button>
          )}
        </div>
      </div>
    </BackgroundWrapper>
  );
};

export default CaseOpening;