import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DarkVeil from '../components/DarkVeil';
import CoinIcon from '../components/CoinIcon';

const Premium = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const navigate = useNavigate();

  const premiumPlans = [
    {
      id: 'monthly',
      name: 'XPlay+ Mensuel',
      price: 9.99,
      duration: '1 mois',
      icon: '⭐',
      features: [
        'Double gains en coins',
        'Cases premium exclusives',
        'Skins rares garanties',
        'Accès prioritaire aux serveurs',
        'Support prioritaire',
        'Badge premium dans le chat'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'XPlay+ Annuel',
      price: 99.99,
      duration: '12 mois',
      icon: '👑',
      features: [
        'Double gains en coins',
        'Cases premium exclusives',
        'Skins rares garanties',
        'Accès prioritaire aux serveurs',
        'Support prioritaire',
        'Badge premium dans le chat',
        'Battlepass premium inclus',
        'Cases légendaires mensuelles',
        'Réduction 50% sur tous les achats'
      ],
      popular: true,
      savings: 'Économisez 20€'
    },
    {
      id: 'lifetime',
      name: 'XPlay+ Lifetime',
      price: 199.99,
      duration: 'À vie',
      icon: '💎',
      features: [
        'Double gains en coins',
        'Cases premium exclusives',
        'Skins rares garanties',
        'Accès prioritaire aux serveurs',
        'Support prioritaire',
        'Badge premium dans le chat',
        'Tous les battlepass futurs inclus',
        'Cases légendaires mensuelles',
        'Réduction 75% sur tous les achats',
        'Accès aux serveurs VIP',
        'Skins exclusifs lifetime'
      ],
      popular: false,
      savings: 'Meilleure valeur'
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
    // Simulation d'achat
    alert(`Achat de ${plan.name} pour ${plan.price}€\n\nFonctionnalité de paiement à implémenter avec Stripe/PayPal`);
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <DarkVeil hueShift={180} noiseIntensity={0.05} scanlineIntensity={0.03} speed={0.2} />
        </div>
        <div style={{ color: '#fff', textAlign: 'center', backgroundColor: 'rgba(15, 15, 15, 0.8)', padding: '20px', borderRadius: '8px' }}>
          Chargement des offres premium...
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
        <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '10px', textShadow: '0 0 20px #FFD700' }}>
          ⭐ XPlay+ Premium
        </h1>
        <p style={{ color: '#cfcfff', fontSize: '1.2rem', marginBottom: '20px' }}>
          Débloquez tout le potentiel de votre expérience de jeu
        </p>
        {user && (
          <p style={{ color: '#cfcfff', fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <CoinIcon size={18} /> {user.coins} coins disponibles
          </p>
        )}
      </div>

      {/* Avantages Premium */}
      <div style={{ 
        marginBottom: '40px', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '25px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#FFD700', fontSize: '1.4rem', marginBottom: '20px', textAlign: 'center' }}>
            🚀 Pourquoi passer à XPlay+ ?
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💰</div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>Double Gains</h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Gagnez 2x plus de coins sur tous nos serveurs
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>Cases Exclusives</h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Accès à des cases premium avec skins rares
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>Priorité Serveurs</h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Connexion prioritaire sur tous les serveurs
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏆</div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>Battlepass Premium</h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem' }}>
                Accès complet au battlepass premium
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Premium */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '30px', 
        maxWidth: '1400px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {premiumPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: 'rgba(28, 28, 42, 0.9)',
              borderRadius: '20px',
              padding: '30px',
              backdropFilter: 'blur(15px)',
              border: `3px solid ${plan.popular ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
              position: 'relative',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!plan.popular) {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.borderColor = '#a259ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!plan.popular) {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {/* Badge populaire */}
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                color: '#000',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
              }}>
                ⭐ POPULAIRE
              </div>
            )}

            {/* Header du plan */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                {plan.icon}
              </div>
              <h3 style={{ 
                color: '#fff', 
                fontSize: '1.5rem', 
                marginBottom: '5px',
                fontWeight: 'bold'
              }}>
                {plan.name}
              </h3>
              <div style={{ 
                color: '#FFD700', 
                fontSize: '2.5rem', 
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {plan.price}€
              </div>
              <div style={{ 
                color: '#cfcfff', 
                fontSize: '1rem',
                marginBottom: '10px'
              }}>
                {plan.duration}
              </div>
              {plan.savings && (
                <div style={{
                  color: '#4CAF50',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  display: 'inline-block'
                }}>
                  {plan.savings}
                </div>
              )}
            </div>

            {/* Liste des fonctionnalités */}
            <div style={{ marginBottom: '25px' }}>
              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    color: '#cfcfff',
                    fontSize: '0.9rem'
                  }}
                >
                  <span style={{ 
                    color: '#4CAF50', 
                    marginRight: '10px',
                    fontSize: '1rem'
                  }}>
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>

            {/* Bouton d'achat */}
            <button
              onClick={() => handlePurchase(plan)}
              style={{
                background: plan.popular 
                  ? 'linear-gradient(90deg, #FFD700, #FFA500)' 
                  : 'linear-gradient(90deg, #a259ff, #3f2b96)',
                color: plan.popular ? '#000' : '#fff',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease',
                boxShadow: plan.popular 
                  ? '0 4px 15px rgba(255, 215, 0, 0.4)' 
                  : '0 4px 15px rgba(162, 89, 255, 0.4)'
              }}
            >
              {plan.id === 'lifetime' ? '💎 Acheter Lifetime' : '⭐ Passer à Premium'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ 
        marginTop: '50px', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{
          backgroundColor: 'rgba(28, 28, 42, 0.9)',
          borderRadius: '15px',
          padding: '30px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.1)',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '25px', textAlign: 'center' }}>
            ❓ Questions Fréquentes
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: '20px' 
          }}>
            <div>
              <h4 style={{ color: '#a259ff', fontSize: '1.1rem', marginBottom: '8px' }}>
                Puis-je annuler mon abonnement à tout moment ?
              </h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Oui, vous pouvez annuler votre abonnement XPlay+ à tout moment depuis votre profil. 
                Vous conserverez vos avantages jusqu'à la fin de la période de facturation.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#a259ff', fontSize: '1.1rem', marginBottom: '8px' }}>
                Les skins premium sont-ils visibles sur tous les serveurs ?
              </h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Les skins premium sont visibles uniquement sur nos serveurs dédiés. 
                Ils ne sont pas visibles dans le matchmaking officiel de CS2 pour garantir votre sécurité.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#a259ff', fontSize: '1.1rem', marginBottom: '8px' }}>
                Y a-t-il un essai gratuit ?
              </h4>
              <p style={{ color: '#cfcfff', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Nous offrons un essai gratuit de 7 jours pour tous les nouveaux utilisateurs. 
                Aucune carte de crédit requise pour commencer l'essai.
              </p>
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

export default Premium;
