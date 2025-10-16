import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';

const Battlepass = () => {
  const [user, setUser] = useState(null);
  const [battlepass, setBattlepass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(1);
  const navigate = useNavigate();

  // Mock data pour le battlepass
  const mockBattlepass = {
    id: 1,
    name: 'Season 1: Rising Stars',
    currentLevel: 15,
    totalLevels: 100,
    currentXP: 1250,
    xpToNext: 250,
    isPremium: false,
    tiers: [
      { level: 1, reward: { type: 'coins', amount: 100 }, isFree: true, isClaimed: true },
      { level: 2, reward: { type: 'skin', name: 'AK-47 | Redline', rarity: 'Rare' }, isFree: false, isClaimed: false },
      { level: 3, reward: { type: 'coins', amount: 150 }, isFree: true, isClaimed: true },
      { level: 4, reward: { type: 'case', name: 'Premium Case' }, isFree: false, isClaimed: false },
      { level: 5, reward: { type: 'coins', amount: 200 }, isFree: true, isClaimed: true },
      { level: 6, reward: { type: 'skin', name: 'AWP | Dragon Lore', rarity: 'Legendary' }, isFree: false, isClaimed: false },
      { level: 7, reward: { type: 'coins', amount: 250 }, isFree: true, isClaimed: true },
      { level: 8, reward: { type: 'skin', name: 'Knife | Karambit', rarity: 'Legendary' }, isFree: false, isClaimed: false },
      { level: 9, reward: { type: 'coins', amount: 300 }, isFree: true, isClaimed: true },
      { level: 10, reward: { type: 'case', name: 'Legendary Case' }, isFree: false, isClaimed: false },
      { level: 15, reward: { type: 'skin', name: 'M4A4 | Howl', rarity: 'Epic' }, isFree: false, isClaimed: false },
      { level: 20, reward: { type: 'coins', amount: 500 }, isFree: true, isClaimed: false },
      { level: 25, reward: { type: 'skin', name: 'Gloves | Specialist', rarity: 'Epic' }, isFree: false, isClaimed: false },
      { level: 30, reward: { type: 'case', name: 'Elite Case' }, isFree: false, isClaimed: false },
      { level: 50, reward: { type: 'skin', name: 'Knife | Butterfly', rarity: 'Legendary' }, isFree: false, isClaimed: false },
      { level: 75, reward: { type: 'coins', amount: 1000 }, isFree: true, isClaimed: false },
      { level: 100, reward: { type: 'skin', name: 'AWP | Medusa', rarity: 'Legendary' }, isFree: false, isClaimed: false }
    ]
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        setUser(userRes.data);
        
        // Simuler le chargement du battlepass
        setTimeout(() => {
          setBattlepass(mockBattlepass);
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

  const getRewardIcon = (reward) => {
    switch (reward.type) {
      case 'coins': return '💰';
      case 'skin': return '🎨';
      case 'case': return '📦';
      default: return '🎁';
    }
  };

  const claimReward = async (tier) => {
    if (tier.isClaimed) return;
    
    try {
      // Simulation de la réclamation
      alert(`Récompense réclamée : ${tier.reward.type === 'coins' ? tier.reward.amount + ' coins' : tier.reward.name}`);
      
      // Mettre à jour l'état local
      setBattlepass(prev => ({
        ...prev,
        tiers: prev.tiers.map(t => 
          t.level === tier.level ? { ...t, isClaimed: true } : t
        )
      }));
    } catch (error) {
      console.error('Erreur réclamation:', error);
    }
  };

  const upgradeToPremium = () => {
    alert('Fonctionnalité premium à venir !\n\nAvantages :\n- Double XP\n- Récompenses exclusives\n- Cases premium');
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement du Battlepass...
        </div>
      </div>
    );
  }

  const currentTier = battlepass.tiers.find(t => t.level === battlepass.currentLevel);
  const progressPercentage = (battlepass.currentXP / (battlepass.currentXP + battlepass.xpToNext)) * 100;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      {/* Fond animé */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '10px', textShadow: '0 0 20px #a259ff' }}>
          🏆 Battlepass
        </h1>
        <h2 style={{ color: '#a259ff', fontSize: '1.5rem', marginBottom: '20px' }}>
          {battlepass.name}
        </h2>
        
        {/* Progression */}
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)',
          maxWidth: '600px',
          margin: '0 auto',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Niveau {battlepass.currentLevel}
            </span>
            <span style={{ color: '#cfcfff', fontSize: '1rem' }}>
              {battlepass.currentXP} / {battlepass.currentXP + battlepass.xpToNext} XP
            </span>
          </div>
          
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #a259ff, #3f2b96)',
              borderRadius: '10px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '15px' 
          }}>
            <span style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              {battlepass.xpToNext} XP jusqu'au niveau suivant
            </span>
            <span style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              {battlepass.totalLevels - battlepass.currentLevel} niveaux restants
            </span>
          </div>
        </div>

        {/* Bouton Premium */}
        {!battlepass.isPremium && (
          <button
            onClick={upgradeToPremium}
            style={{
              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              color: '#000',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
          >
            ⭐ Passer au Battlepass Premium
          </button>
        )}
      </div>

      {/* Grille des récompenses */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {battlepass.tiers.map((tier) => {
          const isUnlocked = tier.level <= battlepass.currentLevel;
          const isCurrentTier = tier.level === battlepass.currentLevel;
          
          return (
            <div
              key={tier.level}
              style={{
                backgroundColor: isUnlocked ? 'rgba(28, 28, 42, 0.9)' : 'rgba(15, 15, 15, 0.7)',
                borderRadius: '15px',
                padding: '20px',
                backdropFilter: 'blur(15px)',
                border: `2px solid ${
                  isCurrentTier ? '#a259ff' : 
                  tier.isClaimed ? '#4CAF50' : 
                  isUnlocked ? 'rgba(255,255,255,0.2)' : 
                  'rgba(255,255,255,0.1)'
                }`,
                opacity: isUnlocked ? 1 : 0.6,
                transition: 'all 0.3s ease',
                cursor: isUnlocked && !tier.isClaimed ? 'pointer' : 'default'
              }}
              onClick={() => isUnlocked && !tier.isClaimed && claimReward(tier)}
            >
              {/* Header du niveau */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ 
                  color: isUnlocked ? '#fff' : '#666', 
                  fontSize: '1.2rem',
                  margin: 0
                }}>
                  Niveau {tier.level}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {tier.isFree && (
                    <span style={{ 
                      color: '#4CAF50', 
                      fontSize: '0.8rem',
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}>
                      GRATUIT
                    </span>
                  )}
                  {tier.isClaimed && (
                    <span style={{ color: '#4CAF50', fontSize: '1.2rem' }}>✓</span>
                  )}
                </div>
              </div>

              {/* Récompense */}
              <div style={{ 
                textAlign: 'center',
                padding: '15px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                  {getRewardIcon(tier.reward)}
                </div>
                <h4 style={{ 
                  color: isUnlocked ? '#fff' : '#666', 
                  fontSize: '1rem',
                  margin: '0 0 5px 0'
                }}>
                  {tier.reward.name || `${tier.reward.amount} coins`}
                </h4>
                {tier.reward.rarity && (
                  <span style={{ 
                    color: getRarityColor(tier.reward.rarity), 
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {tier.reward.rarity}
                  </span>
                )}
              </div>

              {/* Bouton d'action */}
              {isUnlocked && !tier.isClaimed ? (
                <button
                  style={{
                    background: 'linear-gradient(90deg, #a259ff, #3f2b96)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(162, 89, 255, 0.4)'
                  }}
                >
                  Réclamer
                </button>
              ) : tier.isClaimed ? (
                <div style={{
                  background: 'rgba(76, 175, 80, 0.2)',
                  color: '#4CAF50',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  Réclamé ✓
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#666',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  Verrouillé
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Information sur les missions */}
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
          border: '2px solid rgba(255, 215, 0, 0.3)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#FFD700', fontSize: '1.4rem', marginBottom: '15px' }}>
            🎯 Comment gagner de l'XP ?
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            textAlign: 'left'
          }}>
            <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              <strong>🎮 Jouer sur nos serveurs</strong><br/>
              +10 XP par minute de jeu
            </div>
            <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              <strong>📦 Ouvrir des cases</strong><br/>
              +50 XP par case ouverte
            </div>
            <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              <strong>🏆 Missions quotidiennes</strong><br/>
              +100 XP par mission
            </div>
            <div style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
              <strong>👥 Inviter des amis</strong><br/>
              +200 XP par ami invité
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

export default Battlepass;
