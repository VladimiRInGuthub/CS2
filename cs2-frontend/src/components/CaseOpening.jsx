import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { useTranslation } from 'react-i18next';
// import { API_CONFIG } from '../config/apiConfig';
import './CaseOpening.css';

const CaseOpening = ({ caseData, onOpen, onClose, userBalance }) => {
  const { t } = useTranslation();
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [wonSkin, setWonSkin] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [particles, setParticles] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const soundRef = useRef({});

  // Initialiser les sons
  useEffect(() => {
    if (soundEnabled) {
      soundRef.current = {
        caseOpen: new Howl({
          src: ['/sounds/case-open.mp3'],
          volume: 0.3,
          preload: true
        }),
        caseSpin: new Howl({
          src: ['/sounds/case-spin.mp3'],
          volume: 0.2,
          loop: true,
          preload: true
        }),
        rareDrop: new Howl({
          src: ['/sounds/rare-drop.mp3'],
          volume: 0.5,
          preload: true
        }),
        legendaryDrop: new Howl({
          src: ['/sounds/legendary-drop.mp3'],
          volume: 0.7,
          preload: true
        }),
        commonDrop: new Howl({
          src: ['/sounds/common-drop.mp3'],
          volume: 0.3,
          preload: true
        })
      };
    }

    return () => {
      // Nettoyer les sons
      Object.values(soundRef.current).forEach(sound => {
        if (sound && sound.unload) {
          sound.unload();
        }
      });
    };
  }, [soundEnabled]);

  // Générer des particules
  const generateParticles = (count = 20) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: getRarityColor(wonSkin?.rarity),
        delay: Math.random() * 0.5
      });
    }
    setParticles(newParticles);
  };

  // Obtenir la couleur selon la rareté
  const getRarityColor = (rarity) => {
    const colors = {
      'Consumer Grade': '#b0b3b8',
      'Industrial Grade': '#5e98d9',
      'Mil-Spec Grade': '#4b69ff',
      'Restricted': '#8847ff',
      'Classified': '#d32ce6',
      'Covert': '#eb4b4b',
      'Contraband': '#e4ae39'
    };
    return colors[rarity] || colors['Consumer Grade'];
  };

  // Obtenir l'effet sonore selon la rareté
  const getRaritySound = (rarity) => {
    if (rarity === 'Covert' || rarity === 'Contraband') {
      return 'legendaryDrop';
    } else if (rarity === 'Classified' || rarity === 'Restricted') {
      return 'rareDrop';
    } else {
      return 'commonDrop';
    }
  };

  // Démarrer l'ouverture de case
  const startOpening = async () => {
    if (isOpening) return;
    
    setIsOpening(true);
    setAnimationStep(0);
    
    // Jouer le son d'ouverture
    if (soundRef.current.caseOpen) {
      soundRef.current.caseOpen.play();
    }

    // Animation d'ouverture
    const steps = [
      { step: 1, delay: 500 },   // Case qui s'ouvre
      { step: 2, delay: 1000 },  // Rotation des skins
      { step: 3, delay: 2000 },  // Ralentissement
      { step: 4, delay: 3000 },  // Révélation
    ];

    for (const { step, delay } of steps) {
      await new Promise(resolve => {
        setTimeout(() => {
          setAnimationStep(step);
          resolve();
        }, delay);
      });
    }

    // Jouer le son de rotation
    if (soundRef.current.caseSpin) {
      soundRef.current.caseSpin.play();
    }

    // Simuler l'ouverture de la case (appel API)
    try {
      const response = await fetch(`/api/cases/${caseData._id}/open`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ouverture');
      }

      const result = await response.json();
      setWonSkin(result.skin);
      
      // Arrêter le son de rotation
      if (soundRef.current.caseSpin) {
        soundRef.current.caseSpin.stop();
      }

      // Jouer le son selon la rareté
      const raritySound = getRaritySound(result.skin.rarity);
      if (soundRef.current[raritySound]) {
        soundRef.current[raritySound].play();
      }

      // Générer des particules
      generateParticles(30);

      // Révélation finale
      setIsRevealing(true);
      setAnimationStep(5);

      // Appeler le callback
      if (onOpen) {
        onOpen(result);
      }

    } catch (error) {
      console.error('Erreur ouverture case:', error);
      setIsOpening(false);
      setAnimationStep(0);
    }
  };

  // Fermer l'animation
  const closeAnimation = () => {
    setIsOpening(false);
    setIsRevealing(false);
    setWonSkin(null);
    setAnimationStep(0);
    setParticles([]);
    
    // Arrêter tous les sons
    Object.values(soundRef.current).forEach(sound => {
      if (sound && sound.stop) {
        sound.stop();
      }
    });

    if (onClose) {
      onClose();
    }
  };

  // Vérifier si l'utilisateur peut ouvrir la case
  const canOpen = userBalance >= caseData.price && !isOpening;

  return (
    <div className="case-opening-overlay">
      <motion.div
        className="case-opening-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="case-opening-header">
          <h2>{caseData.name}</h2>
          <button 
            className="close-btn"
            onClick={closeAnimation}
            disabled={isOpening}
          >
            ✕
          </button>
        </div>

        {/* Case Display */}
        <div className="case-display">
          <motion.div
            className="case-image"
            animate={{
              rotateY: animationStep >= 2 ? 360 : 0,
              scale: animationStep >= 1 ? 1.1 : 1
            }}
            transition={{
              rotateY: { duration: 2, ease: "easeInOut" },
              scale: { duration: 0.5 }
            }}
          >
            <img src={caseData.image} alt={caseData.name} />
            
            {/* Effet de brillance */}
            <AnimatePresence>
              {animationStep >= 2 && (
                <motion.div
                  className="shine-effect"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Particules */}
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  y: -100
                }}
                transition={{ 
                  duration: 2,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Skin Reveal */}
        <AnimatePresence>
          {isRevealing && wonSkin && (
            <motion.div
              className="skin-reveal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="skin-reveal-header">
                <h3>{t('cases.congratulations')}</h3>
                <p>{t('cases.youWon')}</p>
              </div>
              
              <motion.div
                className="won-skin"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className="skin-image">
                  <img src={wonSkin.image} alt={wonSkin.name} />
                  <div 
                    className="rarity-glow"
                    style={{ 
                      boxShadow: `0 0 30px ${getRarityColor(wonSkin.rarity)}40` 
                    }}
                  />
                </div>
                
                <div className="skin-info">
                  <h4>{wonSkin.name}</h4>
                  <p className="skin-weapon">{wonSkin.weapon}</p>
                  <p className="skin-rarity" style={{ color: getRarityColor(wonSkin.rarity) }}>
                    {wonSkin.rarity}
                  </p>
                  <p className="skin-wear">{wonSkin.wear}</p>
                  {wonSkin.float && (
                    <p className="skin-float">Float: {wonSkin.float.toFixed(4)}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="case-opening-controls">
          <div className="case-info">
            <p className="case-price">
              {caseData.price} Xcoins
            </p>
            <p className="case-description">
              {caseData.description}
            </p>
          </div>

          <div className="controls-buttons">
            <button
              className={`open-case-btn ${canOpen ? 'enabled' : 'disabled'}`}
              onClick={startOpening}
              disabled={!canOpen}
            >
              {isOpening ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  {t('cases.openingCase')}
                </motion.span>
              ) : (
                t('cases.openCase')
              )}
            </button>

            <button
              className="sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          {!canOpen && userBalance < caseData.price && (
            <p className="insufficient-funds">
              {t('cases.insufficientFunds')}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {isOpening && (
            <motion.div
              className="opening-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(animationStep / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CaseOpening;