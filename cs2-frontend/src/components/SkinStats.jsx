import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkinStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/skins/stats', { withCredentials: true });
        setStats(response.data.data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'rgba(28, 28, 42, 0.9)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ color: '#cfcfff' }}>Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'rgba(28, 28, 42, 0.9)',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(244, 67, 54, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ color: '#f44336' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'rgba(28, 28, 42, 0.9)',
      borderRadius: '15px',
      padding: '25px',
      backdropFilter: 'blur(15px)',
      border: '2px solid rgba(255,255,255,0.1)'
    }}>
      <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '20px', textAlign: 'center' }}>
        📊 Statistiques des Skins
      </h3>
      
      {/* Statistiques générales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <div style={{ color: '#a259ff', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats.totalSkins}
          </div>
          <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
            Total Skins
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <div style={{ color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {stats.totalValue.toLocaleString()}
          </div>
          <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
            Valeur Totale
          </div>
        </div>
      </div>

      {/* Répartition par rareté */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '15px' }}>
          🎨 Répartition par Rareté
        </h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {stats.rarityBreakdown.map((rarity) => (
            <div key={rarity._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 15px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              border: `2px solid ${getRarityColor(rarity._id)}40`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getRarityColor(rarity._id)
                }}></div>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  {rarity._id}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                  {rarity.count} skins
                </div>
                <div style={{ color: '#FFD700', fontSize: '0.8rem' }}>
                  Moy: {Math.round(rarity.avgPrice)} coins
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique de répartition */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '15px' }}>
          📈 Répartition Visuelle
        </h4>
        <div style={{ 
          display: 'flex', 
          height: '20px', 
          borderRadius: '10px', 
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.1)'
        }}>
          {stats.rarityBreakdown.map((rarity, index) => {
            const percentage = (rarity.count / stats.totalSkins) * 100;
            return (
              <div
                key={rarity._id}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: getRarityColor(rarity._id),
                  transition: 'width 0.3s ease'
                }}
                title={`${rarity._id}: ${rarity.count} skins (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '10px',
          fontSize: '0.8rem',
          color: '#cfcfff'
        }}>
          {stats.rarityBreakdown.map((rarity) => (
            <span key={rarity._id} style={{ color: getRarityColor(rarity._id) }}>
              {rarity._id}: {rarity.count}
            </span>
          ))}
        </div>
      </div>

      {/* Prix moyens */}
      <div>
        <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '15px' }}>
          💰 Prix Moyens par Rareté
        </h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          {stats.rarityBreakdown.map((rarity) => (
            <div key={rarity._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '6px'
            }}>
              <span style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                {rarity._id}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {Math.round(rarity.avgPrice).toLocaleString()} coins
                </span>
                <div style={{
                  width: '60px',
                  height: '6px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(rarity.avgPrice / Math.max(...stats.rarityBreakdown.map(r => r.avgPrice))) * 100}%`,
                    height: '100%',
                    backgroundColor: getRarityColor(rarity._id),
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkinStats;
