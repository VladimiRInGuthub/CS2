import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './Premium.css';

const Premium = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      yearlyPrice: 0,
      icon: '🆓',
      features: [
        'Send up to 2 transfers per month',
        'Basic transaction history',
        'Email support',
        'Limited currency support (USD, EUR, GBP)',
        'Basic security features'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 9.99,
      yearlyPrice: 99.99,
      icon: '⭐',
      features: [
        'Unlimited transfers',
        'Transaction history with export options',
        'Priority email support',
        'Expanded currency support',
        'Advanced security features'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 19.99,
      yearlyPrice: 199.99,
      icon: '💎',
      features: [
        'Unlimited transfers with priority processing',
        'Comprehensive transaction analytics',
        '24/7 priority support',
        'Full currency support',
        'Enhanced security features'
      ],
      popular: false
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        setUser(userRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    loadData();
  }, [navigate]);

  const handlePurchase = (plan) => {
    const price = isYearly ? plan.yearlyPrice : plan.price;
    const billing = isYearly ? 'yearly' : 'monthly';
    
    alert(`Achat de ${plan.name} pour ${price}€ (${billing})\n\nFonctionnalité de paiement à implémenter avec Stripe/PayPal`);
  };

  if (loading) {
    return (
      <div className="premium-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des offres premium...</p>
      </div>
    );
  }

  return (
    <div className="premium-page">
      {/* Header */}
      <div className="premium-header">
        <h1 className="premium-title">Pricing</h1>
        <p className="premium-description">
          Choose the perfect plan for your needs
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="billing-toggle">
        <ToggleSwitch
          leftLabel="Monthly"
          rightLabel="Billed Yearly"
          isYearly={isYearly}
          onChange={setIsYearly}
        />
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            variant="pricing"
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            <div className="pricing-card-content">
              {/* Plan Header */}
              <div className="plan-header">
                <div className="plan-icon">{plan.icon}</div>
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">
                    {isYearly ? plan.yearlyPrice : plan.price}€
                  </span>
                  <span className="price-period">
                    {plan.price === 0 ? '' : isYearly ? '/year' : '/m'}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="plan-cta">
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="large"
                  onClick={() => handlePurchase(plan)}
                  className="get-started-btn"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <Card variant="glass" className="faq-card">
          <h3 className="faq-title">Frequently Asked Questions</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4 className="faq-question">
                Can I cancel my subscription at any time?
              </h4>
              <p className="faq-answer">
                Yes, you can cancel your subscription at any time from your profile. 
                You will keep your benefits until the end of the billing period.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                Are premium skins visible on all servers?
              </h4>
              <p className="faq-answer">
                Premium skins are only visible on our dedicated servers. 
                They are not visible in official CS2 matchmaking to ensure your safety.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                Is there a free trial?
              </h4>
              <p className="faq-answer">
                We offer a 7-day free trial for all new users. 
                No credit card required to start the trial.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Back Button */}
      <div className="back-navigation">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="back-btn"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Premium;