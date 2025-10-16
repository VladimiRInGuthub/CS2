import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';
import CaseOpening from '../components/CaseOpening';
import CaseHistory from '../components/CaseHistory';
import { useInventory } from '../hooks/useInventory';
// Styles intégrés dans le composant

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCaseOpening, setShowCaseOpening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();
  const { refreshInventory } = useInventory();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [casesRes, userRes] = await Promise.all([
          axios.get('/api/cases', { withCredentials: true }),
          axios.get('/api/users/me', { withCredentials: true })
        ]);

        setCases(casesRes.data);
        setUser(userRes.data);
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

  const openCase = async (caseItem) => {
    try {
      const response = await axios.post('/api/cases/open', 
        { caseId: caseItem._id },
        { withCredentials: true }
      );

      setUser(prev => ({ ...prev, coins: response.data.newBalance }));
      
      // Rafraîchir l'inventaire après ouverture réussie
      if (refreshInventory) {
        refreshInventory();
      }
      
      return response.data;

    } catch (error) {
      console.error('Erreur ouverture case:', error);
      throw error;
    }
  };

  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem);
    setShowCaseOpening(true);
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

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement des cases...
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
          🎁 Cases
        </h1>
        {user && (
          <p style={{ color: '#cfcfff', fontSize: '1.2rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <CoinIcon size={18} /> {user.coins} coins disponibles
          </p>
        )}
        
        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowHistory(true)}
            style={{
              background: 'linear-gradient(90deg, #3f2b96, #a259ff)',
              color: '#fff',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(162, 89, 255, 0.4)'
            }}
          >
            📊 Voir l'historique
          </button>
          
          <button
            onClick={() => navigate('/skins')}
            style={{
              background: 'linear-gradient(90deg, #00ff88, #00d4aa)',
              color: '#fff',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)'
            }}
          >
            🎨 Galerie de Skins
          </button>
        </div>
      </div>

      {/* Cases Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {cases.map((caseItem) => (
          <div key={caseItem._id} style={{
            backgroundColor: 'rgba(28, 28, 42, 0.9)',
            borderRadius: '15px',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(15px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            opacity: 1,
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            <img 
              src={caseItem.image} 
              alt={caseItem.name}
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '10px',
                marginBottom: '20px',
                border: `3px solid ${getRarityColor(caseItem.rarity)}`
              }}
            />
            
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px' }}>
              {caseItem.name}
            </h3>
            
            <p style={{ color: '#cfcfff', marginBottom: '15px', fontSize: '0.9rem' }}>
              {caseItem.description}
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ 
                color: getRarityColor(caseItem.rarity), 
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {caseItem.rarity}
              </span>
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CoinIcon size={16} /> {caseItem.price}
              </span>
            </div>

            <button
              onClick={() => handleCaseClick(caseItem)}
              disabled={user && user.coins < caseItem.price}
              style={{
                background: (user && user.coins >= caseItem.price)
                  ? 'linear-gradient(90deg, #a259ff, #3f2b96)' 
                  : '#333',
                color: '#fff',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: (user && user.coins >= caseItem.price) ? 'pointer' : 'not-allowed',
                width: '100%',
                transition: 'all 0.3s ease',
                boxShadow: (user && user.coins >= caseItem.price)
                  ? '0 4px 15px rgba(162, 89, 255, 0.4)' 
                  : 'none'
              }}
            >
              {(user && user.coins < caseItem.price) ? '❌ Coins insuffisants' : 
               '🎁 Ouvrir la case'}
            </button>
          </div>
        ))}
      </div>

      {/* Composant d'ouverture de case */}
      {showCaseOpening && selectedCase && (
        <CaseOpening
          caseItem={selectedCase}
          onOpen={openCase}
          onClose={() => setShowCaseOpening(false)}
          user={user}
        />
      )}

      {/* Composant historique */}
      {showHistory && (
        <CaseHistory onClose={() => setShowHistory(false)} />
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

export default Cases; 