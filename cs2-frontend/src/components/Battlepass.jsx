import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Battlepass.css';

const Battlepass = () => {
  const { t } = useTranslation();
  const [battlepass, setBattlepass] = useState(null);
  const [progress, setProgress] = useState(null);
  const [unclaimedRewards, setUnclaimedRewards] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchBattlepassData();
  }, []);

  const fetchBattlepassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/battlepass/progress');
      setBattlepass(response.data.battlepass);
      setProgress(response.data.progress);
      setUnclaimedRewards(response.data.unclaimedRewards);
      setMissions(response.data.missions);
    } catch (error) {
      console.error('Erreur récupération battlepass:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      const response = await axios.post('/api/battlepass/purchase');
      
      // Mettre à jour les données
      await fetchBattlepassData();
      
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur achat battlepass:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'achat');
    } finally {
      setPurchasing(false);
    }
  };

  const handleClaimReward = async (tier, isPremium) => {
    try {
      setClaiming(true);
      const response = await axios.post('/api/battlepass/claim-reward', {
        tier,
        isPremium
      });
      
      // Mettre à jour les données
      await fetchBattlepassData();
      
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur réclamation récompense:', error);
      alert(error.response?.data?.message || 'Erreur lors de la réclamation');
    } finally {
      setClaiming(false);
    }
  };

  const formatTimeRemaining = (timeRemaining) => {
    if (!timeRemaining) return '';
    
    const { days, hours, minutes } = timeRemaining;
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  const getProgressPercentage = (currentXp, nextTierXp) => {
    if (!nextTierXp) return 100;
    return Math.min(100, (currentXp / nextTierXp) * 100);
  };

  const getRewardIcon = (type) => {
    const icons = {
      xcoins: '💰',
      case: '📦',
      skin: '✨',
      title: '🏷️',
      badge: '🏆',
      premium_days: '👑'
    };
    return icons[type] || '🎁';
  };

  if (loading) {
    return (
      <div className="battlepass-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  if (!battlepass) {
    return (
      <div className="battlepass-container">
        <div className="no-battlepass">
          <div className="no-battlepass-icon">🎯</div>
          <h2>{t('battlepass.noActive', 'Aucun battlepass actif')}</h2>
          <p>{t('battlepass.noActiveDescription', 'Il n\'y a actuellement aucun battlepass actif. Revenez plus tard !')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="battlepass-container">
      <div className="battlepass-header">
        <div className="battlepass-info">
          <h1>{battlepass.name}</h1>
          <p className="battlepass-description">{battlepass.description}</p>
          <div className="battlepass-meta">
            <span className="season">Saison {battlepass.season}</span>
            <span className="time-remaining">
              {t('battlepass.timeRemaining', 'Temps restant')}: {formatTimeRemaining(battlepass.timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="battlepass-progress">
          <div className="progress-info">
            <span className="current-level">{t('battlepass.level', 'Niveau')} {progress.currentLevel}</span>
            <span className="current-xp">{progress.currentXp.toLocaleString()} XP</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage(
                  progress.currentXp, 
                  battlepass.tiers.find(t => t.level === progress.currentLevel + 1)?.xpRequired
                )}%` 
              }}
            ></div>
          </div>
          <div className="progress-next">
            {battlepass.tiers.find(t => t.level === progress.currentLevel + 1) && (
              <span>
                {t('battlepass.nextLevel', 'Niveau suivant')}: {battlepass.tiers.find(t => t.level === progress.currentLevel + 1).xpRequired.toLocaleString()} XP
              </span>
            )}
          </div>
        </div>
      </div>

      {!progress.isPremium && (
        <div className="battlepass-purchase">
          <div className="purchase-card">
            <div className="purchase-header">
              <h3>{t('battlepass.premiumTitle', 'Débloquez le Battlepass Premium')}</h3>
              <div className="premium-price">
                <span className="price">{battlepass.price}</span>
                <span className="currency">Xcoins</span>
              </div>
            </div>
            <div className="purchase-benefits">
              <h4>{t('battlepass.premiumBenefits', 'Avantages Premium')}:</h4>
              <ul>
                <li>🎁 {t('battlepass.premiumRewards', 'Récompenses premium exclusives')}</li>
                <li>⚡ {t('battlepass.xpBoost', 'Boost XP x2')}</li>
                <li>🏆 {t('battlepass.exclusiveBadges', 'Badges exclusifs')}</li>
                <li>👑 {t('battlepass.premiumTitle', 'Titre premium')}</li>
              </ul>
            </div>
            <button 
              className="purchase-btn"
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? t('common.loading', 'Chargement...') : t('battlepass.purchase', 'Acheter Premium')}
            </button>
          </div>
        </div>
      )}

      {unclaimedRewards.length > 0 && (
        <div className="unclaimed-rewards">
          <h3>{t('battlepass.unclaimedRewards', 'Récompenses non réclamées')}</h3>
          <div className="rewards-grid">
            {unclaimedRewards.map((reward, index) => (
              <div key={index} className="reward-card unclaimed">
                <div className="reward-tier">Tier {reward.tier}</div>
                <div className="reward-items">
                  {reward.rewards.map((item, itemIndex) => (
                    <div key={itemIndex} className="reward-item">
                      <span className="reward-icon">{getRewardIcon(item.type)}</span>
                      <span className="reward-name">{item.name || `${item.amount} ${item.type}`}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="claim-btn"
                  onClick={() => handleClaimReward(reward.tier, reward.isPremium)}
                  disabled={claiming}
                >
                  {t('battlepass.claim', 'Réclamer')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="battlepass-tiers">
        <h3>{t('battlepass.tiers', 'Tiers du Battlepass')}</h3>
        <div className="tiers-container">
          {battlepass.tiers.map((tier, index) => {
            const isUnlocked = progress.currentLevel >= tier.level;
            const isCurrentTier = progress.currentLevel === tier.level;
            const hasFreeRewards = tier.freeRewards && tier.freeRewards.length > 0;
            const hasPremiumRewards = tier.premiumRewards && tier.premiumRewards.length > 0;
            
            return (
              <div 
                key={tier.level}
                className={`tier-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrentTier ? 'current' : ''}`}
              >
                <div className="tier-header">
                  <div className="tier-level">Niveau {tier.level}</div>
                  <div className="tier-xp">{tier.xpRequired.toLocaleString()} XP</div>
                </div>
                
                <div className="tier-rewards">
                  {hasFreeRewards && (
                    <div className="reward-section free">
                      <div className="reward-section-title">Gratuit</div>
                      <div className="reward-items">
                        {tier.freeRewards.map((reward, rewardIndex) => (
                          <div key={rewardIndex} className="reward-item">
                            <span className="reward-icon">{getRewardIcon(reward.type)}</span>
                            <span className="reward-name">{reward.name || `${reward.amount} ${reward.type}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {hasPremiumRewards && (
                    <div className="reward-section premium">
                      <div className="reward-section-title">Premium</div>
                      <div className="reward-items">
                        {tier.premiumRewards.map((reward, rewardIndex) => (
                          <div key={rewardIndex} className="reward-item">
                            <span className="reward-icon">{getRewardIcon(reward.type)}</span>
                            <span className="reward-name">{reward.name || `${reward.amount} ${reward.type}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {isUnlocked && (
                  <div className="tier-actions">
                    {hasFreeRewards && (
                      <button 
                        className="claim-btn free"
                        onClick={() => handleClaimReward(tier.level, false)}
                        disabled={claiming}
                      >
                        {t('battlepass.claimFree', 'Réclamer Gratuit')}
                      </button>
                    )}
                    {hasPremiumRewards && progress.isPremium && (
                      <button 
                        className="claim-btn premium"
                        onClick={() => handleClaimReward(tier.level, true)}
                        disabled={claiming}
                      >
                        {t('battlepass.claimPremium', 'Réclamer Premium')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {missions.length > 0 && (
        <div className="battlepass-missions">
          <h3>{t('battlepass.missions', 'Missions')}</h3>
          <div className="missions-grid">
            {missions.map((mission, index) => (
              <div key={mission.id} className="mission-card">
                <div className="mission-header">
                  <div className="mission-type">{t(`battlepass.missionTypes.${mission.type}`, mission.type)}</div>
                  <div className="mission-xp">+{mission.xpReward} XP</div>
                </div>
                <div className="mission-content">
                  <h4>{mission.name}</h4>
                  <p>{mission.description}</p>
                </div>
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                  <span className="progress-text">0%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Battlepass;
