import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Premium.css';

const Premium = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPremiumData();
  }, []);

  const fetchPremiumData = async () => {
    try {
      setLoading(true);
      const [plansResponse, statusResponse] = await Promise.all([
        axios.get('/api/premium/plans'),
        axios.get('/api/premium/status')
      ]);
      
      setPlans(plansResponse.data.plans);
      setPremiumStatus(statusResponse.data);
    } catch (error) {
      console.error('Erreur récupération données premium:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId) => {
    try {
      setPurchasing(true);
      setSelectedPlan(planId);
      
      const response = await axios.post('/api/premium/purchase', {
        plan: planId,
        paymentMethod: 'manual'
      });
      
      // Mettre à jour les données
      await fetchPremiumData();
      
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur achat premium:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'achat');
    } finally {
      setPurchasing(false);
      setSelectedPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm(t('premium.confirmCancel', 'Êtes-vous sûr de vouloir annuler votre abonnement ?'))) {
      return;
    }
    
    try {
      const response = await axios.post('/api/premium/cancel');
      await fetchPremiumData();
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur annulation premium:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const formatTimeRemaining = (timeRemaining) => {
    if (!timeRemaining) return '';
    
    const { days, hours, minutes } = timeRemaining;
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  const getPlanIcon = (planId) => {
    const icons = {
      monthly: '📅',
      yearly: '📆',
      lifetime: '👑'
    };
    return icons[planId] || '⭐';
  };

  const getPlanColor = (planId) => {
    const colors = {
      monthly: '#4caf50',
      yearly: '#ffc107',
      lifetime: '#e91e63'
    };
    return colors[planId] || '#a259ff';
  };

  if (loading) {
    return (
      <div className="premium-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h1>{t('premium.title', 'Premium SkinCase')}</h1>
        <p className="premium-subtitle">
          {t('premium.subtitle', 'Débloquez tous les avantages premium et profitez d\'une expérience de jeu exceptionnelle')}
        </p>
      </div>

      {premiumStatus?.isActive && (
        <div className="premium-status">
          <div className="status-card active">
            <div className="status-header">
              <div className="status-icon">👑</div>
              <div className="status-info">
                <h3>{t('premium.active', 'Premium Actif')}</h3>
                <p>{t('premium.plan', 'Plan')}: {t(`premium.plans.${premiumStatus.plan}`, premiumStatus.plan)}</p>
              </div>
            </div>
            
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">{t('premium.timeRemaining', 'Temps restant')}:</span>
                <span className="status-value">{formatTimeRemaining(premiumStatus.timeRemaining)}</span>
              </div>
              <div className="status-item">
                <span className="status-label">{t('premium.autoRenew', 'Renouvellement automatique')}:</span>
                <span className="status-value">{premiumStatus.autoRenew ? t('common.yes', 'Oui') : t('common.no', 'Non')}</span>
              </div>
            </div>
            
            <div className="status-actions">
              {premiumStatus.autoRenew && (
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  {t('premium.cancel', 'Annuler l\'abonnement')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="premium-benefits">
        <h2>{t('premium.benefits', 'Avantages Premium')}</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>{t('premium.benefits.xcoins', 'Bonus Xcoins')}</h3>
            <p>{t('premium.benefits.xcoinsDesc', 'Gagnez plus de Xcoins chaque jour avec des bonus exclusifs')}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">📦</div>
            <h3>{t('premium.benefits.cases', 'Cases Exclusives')}</h3>
            <p>{t('premium.benefits.casesDesc', 'Accédez à des cases premium avec des skins rares')}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>{t('premium.benefits.battlepass', 'Battlepass Premium')}</h3>
            <p>{t('premium.benefits.battlepassDesc', 'Débloquez tous les tiers du battlepass premium')}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🚫</div>
            <h3>{t('premium.benefits.adFree', 'Sans Publicité')}</h3>
            <p>{t('premium.benefits.adFreeDesc', 'Profitez d\'une expérience sans publicité')}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">🎨</div>
            <h3>{t('premium.benefits.avatar', 'Avatar Personnalisé')}</h3>
            <p>{t('premium.benefits.avatarDesc', 'Personnalisez votre avatar avec des options exclusives')}</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>{t('premium.benefits.priority', 'Support Prioritaire')}</h3>
            <p>{t('premium.benefits.priorityDesc', 'Bénéficiez d\'un support client prioritaire')}</p>
          </div>
        </div>
      </div>

      <div className="premium-plans">
        <h2>{t('premium.choosePlan', 'Choisissez votre plan')}</h2>
        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
              style={{ '--plan-color': getPlanColor(plan.id) }}
            >
              {plan.popular && (
                <div className="popular-badge">
                  {t('premium.mostPopular', 'Le plus populaire')}
                </div>
              )}
              
              <div className="plan-header">
                <div className="plan-icon">{getPlanIcon(plan.id)}</div>
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>
              
              <div className="plan-pricing">
                <div className="price-container">
                  {plan.originalPrice && (
                    <div className="original-price">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: plan.currency 
                      }).format(plan.originalPrice)}
                    </div>
                  )}
                  <div className="current-price">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: plan.currency 
                    }).format(plan.price)}
                  </div>
                  {plan.discount && (
                    <div className="discount">-{plan.discount}%</div>
                  )}
                </div>
                <div className="plan-duration">{plan.duration}</div>
              </div>
              
              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="purchase-btn"
                onClick={() => handlePurchase(plan.id)}
                disabled={purchasing && selectedPlan === plan.id}
                style={{ 
                  backgroundColor: getPlanColor(plan.id),
                  color: plan.id === 'yearly' ? '#000' : '#fff'
                }}
              >
                {purchasing && selectedPlan === plan.id ? 
                  t('common.loading', 'Chargement...') : 
                  t('premium.purchase', 'Acheter')
                }
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-faq">
        <h2>{t('premium.faq', 'Questions fréquentes')}</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>{t('premium.faq.cancel.title', 'Puis-je annuler mon abonnement ?')}</h3>
            <p>{t('premium.faq.cancel.answer', 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous garderez vos avantages jusqu\'à la fin de la période payée.')}</p>
          </div>
          
          <div className="faq-item">
            <h3>{t('premium.faq.refund.title', 'Y a-t-il une garantie de remboursement ?')}</h3>
            <p>{t('premium.faq.refund.answer', 'Nous offrons une garantie de remboursement de 30 jours pour tous nos plans premium.')}</p>
          </div>
          
          <div className="faq-item">
            <h3>{t('premium.faq.payment.title', 'Quels sont les modes de paiement ?')}</h3>
            <p>{t('premium.faq.payment.answer', 'Nous acceptons les cartes de crédit, PayPal et les Xcoins pour l\'achat d\'abonnements premium.')}</p>
          </div>
          
          <div className="faq-item">
            <h3>{t('premium.faq.features.title', 'Les fonctionnalités changent-elles ?')}</h3>
            <p>{t('premium.faq.features.answer', 'Nous ajoutons régulièrement de nouvelles fonctionnalités premium. Vous bénéficiez automatiquement de toutes les nouveautés.')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
