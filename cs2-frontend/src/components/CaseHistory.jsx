import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Styles intégrés dans le composant

const CaseHistory = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/cases/history', { withCredentials: true }),
          axios.get('http://localhost:5000/api/cases/user-stats', { withCredentials: true })
        ]);

        setHistory(historyRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ color: '#fff', textAlign: 'center' }}>
          Chargement de l'historique...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        backgroundColor: 'rgba(28, 28, 42, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '2px solid rgba(162, 89, 255, 0.5)',
        boxShadow: '0 0 50px rgba(162, 89, 255, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px' }}>
            📊 Historique des ouvertures
          </h2>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 15px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Statistiques */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#a259ff', fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.totalCasesOpened}
              </div>
              <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Cases ouvertes
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFD700', fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.totalSpent}
              </div>
              <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Coins dépensés
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4CAF50', fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.totalSkinsObtained}
              </div>
              <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Skins obtenus
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FF9800', fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.averageValue}
              </div>
              <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Coût moyen/case
              </div>
            </div>
          </div>
        )}

        {/* Répartition par rareté */}
        {stats && stats.rarityPercentages && (
          <div style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '15px'
          }}>
            <h3 style={{ color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
              Répartition par rareté
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {Object.entries(stats.rarityPercentages).map(([rarity, percentage]) => (
                <div key={rarity} style={{
                  textAlign: 'center',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: `2px solid ${getRarityColor(rarity)}`
                }}>
                  <div style={{ color: getRarityColor(rarity), fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {percentage}%
                  </div>
                  <div style={{ color: '#cfcfff', fontSize: '0.8rem' }}>
                    {rarity}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.7rem' }}>
                    {stats.rarityBreakdown[rarity]} skins
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique des ouvertures */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
            Dernières ouvertures
          </h3>
          
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#cfcfff', padding: '40px' }}>
              Aucune case ouverte pour le moment
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: `2px solid ${getRarityColor(item.skinRarity)}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: getRarityColor(item.skinRarity),
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontSize: '1.5rem',
                    overflow: 'hidden'
                  }}>
                    {item.skinImage ? (
                      <img src={item.skinImage} alt={item.skinName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    ) : (
                      '🎁'
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}>
                      {item.skinName}
                    </div>
                    <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                      {item.skinWeapon} • {item.caseName}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.8rem' }}>
                      {formatDate(item.openedAt)}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: getRarityColor(item.skinRarity), 
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {item.skinRarity}
                    </div>
                    <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
                      -{item.cost} coins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseHistory; 