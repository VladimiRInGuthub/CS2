import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  OrganicHover, 
  OrganicFocus, 
  CascadeAnimation, 
  OrganicGlitch, 
  OrganicParticles, 
  OrganicMorph, 
  LiquidEffect, 
  NeonEffect,
  OrganicNotification,
  OrganicLoader,
  FocusRing,
  HoverEffect,
  MorphingElement,
  ParallaxContainer
} from './OrganicAnimations';
import './OrganicAnimations.css';

const AnimationShowcase = () => {
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');

  const handleNotification = (type) => {
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div style={{
      padding: '40px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          textAlign: 'center',
          fontSize: '3rem',
          marginBottom: '40px',
          background: 'linear-gradient(45deg, #a259ff, #3f2b96)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        🎨 Animations Organiques
      </motion.h1>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Hover Effects */}
        <CascadeAnimation delay={0.1}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#a259ff' }}>
              ✨ Effets de Hover
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <OrganicHover scale={1.05}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(162, 89, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(162, 89, 255, 0.3)',
                  textAlign: 'center'
                }}>
                  <h3>Hover Organique</h3>
                  <p>Survolez pour voir l'effet</p>
                </div>
              </OrganicHover>

              <HoverEffect intensity={2}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 107, 107, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  textAlign: 'center'
                }}>
                  <h3>Hover Intensif</h3>
                  <p>Effet plus prononcé</p>
                </div>
              </HoverEffect>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Focus Effects */}
        <CascadeAnimation delay={0.2}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#4CAF50' }}>
              🎯 Effets de Focus
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <FocusRing isFocused={isFocused}>
                <button
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={{
                    padding: '15px 30px',
                    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Focus Organique
                </button>
              </FocusRing>

              <OrganicFocus>
                <div style={{
                  padding: '20px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center'
                }}>
                  <h3>Focus Automatique</h3>
                  <p>Focus sur interaction</p>
                </div>
              </OrganicFocus>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Morphing */}
        <CascadeAnimation delay={0.3}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#FF9800' }}>
              🔄 Effets de Morphing
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <MorphingElement isActive={isActive}>
                <div 
                  onClick={() => setIsActive(!isActive)}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 152, 0, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <h3>Morphing Interactif</h3>
                  <p>Cliquez pour activer</p>
                </div>
              </MorphingElement>

              <OrganicMorph isActive={isActive}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(156, 39, 176, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  textAlign: 'center'
                }}>
                  <h3>Morphing Organique</h3>
                  <p>Animation fluide</p>
                </div>
              </OrganicMorph>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Parallax */}
        <CascadeAnimation delay={0.4}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#2196F3' }}>
              🌊 Effets de Parallaxe
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <ParallaxContainer speed={0.5}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(33, 150, 243, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  textAlign: 'center'
                }}>
                  <h3>Parallaxe 3D</h3>
                  <p>Survolez pour l'effet</p>
                </div>
              </ParallaxContainer>

              <ParallaxContainer speed={1}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 193, 7, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  textAlign: 'center'
                }}>
                  <h3>Parallaxe Intensif</h3>
                  <p>Effet plus prononcé</p>
                </div>
              </ParallaxContainer>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Notifications */}
        <CascadeAnimation delay={0.5}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E91E63' }}>
              🔔 Notifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <button
                onClick={() => handleNotification('success')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                ✅ Succès
              </button>
              <button
                onClick={() => handleNotification('error')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                ❌ Erreur
              </button>
              <button
                onClick={() => handleNotification('warning')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                ⚠️ Avertissement
              </button>
              <button
                onClick={() => handleNotification('info')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                ℹ️ Information
              </button>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Loaders */}
        <CascadeAnimation delay={0.6}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#9C27B0' }}>
              ⏳ Loaders Organiques
            </h2>
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <OrganicLoader size="small" />
                <p>Petit</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <OrganicLoader size="medium" />
                <p>Moyen</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <OrganicLoader size="large" />
                <p>Grand</p>
              </div>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Glitch */}
        <CascadeAnimation delay={0.7}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#FF5722' }}>
              🎭 Effets de Glitch
            </h2>
            <div style={{ textAlign: 'center' }}>
              <OrganicGlitch>
                <h3 style={{ fontSize: '2.5rem', color: '#FF5722' }}>
                  GLITCH ORGANIQUE
                </h3>
              </OrganicGlitch>
            </div>
          </section>
        </CascadeAnimation>

        {/* Section Neon */}
        <CascadeAnimation delay={0.8}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#00BCD4' }}>
              💫 Effets Néon
            </h2>
            <div style={{ textAlign: 'center' }}>
              <NeonEffect color="#00BCD4">
                <div style={{
                  padding: '20px',
                  background: 'rgba(0, 188, 212, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 188, 212, 0.3)',
                  display: 'inline-block'
                }}>
                  <h3>Effet Néon Cyan</h3>
                </div>
              </NeonEffect>
            </div>
          </section>
        </CascadeAnimation>
      </div>

      {/* Notifications */}
      <OrganicNotification
        message="Ceci est une notification de démonstration !"
        type={notificationType}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default AnimationShowcase; 