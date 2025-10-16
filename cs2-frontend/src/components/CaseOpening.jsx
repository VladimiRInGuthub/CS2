import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OrganicAnimations.css';
import CoinIcon from './CoinIcon';
import { getSkinImageUrl } from '../utils/skinImages';

const CaseOpening = ({ caseItem, onOpen, onClose, user }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningItems, setSpinningItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  const [spinDuration, setSpinDuration] = useState(0);

  // Générer des items aléatoires pour l'animation
  const generateSpinningItems = (caseItems, targetItem) => {
    const items = [];
    const totalItems = 50; // Nombre total d'items dans la roulette
    
    // Ajouter l'item gagnant à une position aléatoire dans les derniers tiers
    const winningPosition = Math.floor(Math.random() * (totalItems / 3)) + Math.floor(totalItems * 2 / 3);
    
    for (let i = 0; i < totalItems; i++) {
      if (i === winningPosition) {
        items.push(targetItem);
      } else {
        // Sélectionner un item aléatoire de la case
        const randomItem = caseItems[Math.floor(Math.random() * caseItems.length)];
        items.push(randomItem);
      }
    }
    
    return { items, winningPosition };
  };

  const startSpin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    setSelectedItem(null);
    
    try {
      // Appeler l'API pour ouvrir la case
      const response = await onOpen(caseItem);
      setResult(response);
      
      // Générer les items pour l'animation
      const { items, winningPosition } = generateSpinningItems(caseItem.items, response.skin);
      setSpinningItems(items);
      
      // Calculer la durée de l'animation
      const duration = 4000 + Math.random() * 2000; // 4-6 secondes
      setSpinDuration(duration);
      
      // Démarrer l'animation
      setTimeout(() => {
        setIsSpinning(false);
        setSelectedItem(response.skin);
        setShowResult(true);
      }, duration);
      
    } catch (error) {
      console.error('Erreur lors de l\'ouverture:', error);
      setIsSpinning(false);
    }
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

  const getRarityGlow = (rarity) => {
    const colors = {
      'Common': 'rgba(102, 102, 102, 0.3)',
      'Uncommon': 'rgba(76, 175, 80, 0.3)',
      'Rare': 'rgba(33, 150, 243, 0.3)',
      'Epic': 'rgba(156, 39, 176, 0.3)',
      'Legendary': 'rgba(255, 152, 0, 0.3)'
    };
    return colors[rarity] || 'rgba(102, 102, 102, 0.3)';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
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
        }}
      >
      <div style={{
        backgroundColor: 'rgba(28, 28, 42, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '2px solid rgba(162, 89, 255, 0.5)',
        boxShadow: '0 0 50px rgba(162, 89, 255, 0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px' }}>
            🎲 Ouverture de {caseItem.name}
          </h2>
          <p style={{ color: '#cfcfff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CoinIcon size={16} /> Coût: {caseItem.price}</span> |
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CoinIcon size={16} /> Solde: {user?.coins || 0}</span>
          </p>
        </div>

        {/* Roulette d'ouverture */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          marginBottom: '30px',
          overflow: 'hidden',
          borderRadius: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(162, 89, 255, 0.3)'
        }}>
          {/* Indicateur central */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4px',
            height: '100%',
            backgroundColor: '#a259ff',
            zIndex: 10,
            boxShadow: '0 0 10px #a259ff'
          }} />
          
          {/* Items de la roulette */}
          <motion.div 
            ref={wheelRef}
            animate={{
              x: isSpinning ? -(spinningItems.length - 1) * 120 : 0
            }}
            transition={{
              duration: isSpinning ? spinDuration / 1000 : 0,
              ease: isSpinning ? [0.25, 0.46, 0.45, 0.94] : "ease"
            }}
            style={{
              display: 'flex',
              height: '100%'
            }}
          >
            {spinningItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                style={{
                  minWidth: '120px',
                  height: '100%',
                  margin: '0 5px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(40, 40, 60, 0.8)',
                  borderRadius: '10px',
                  border: `2px solid ${getRarityColor(item.rarity)}`,
                  boxShadow: `0 0 15px ${getRarityGlow(item.rarity)}`,
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <img
                  src={getSkinImageUrl(item)}
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    marginBottom: '5px'
                  }}
                />
                <div style={{
                  fontSize: '0.7rem',
                  color: '#fff',
                  textAlign: 'center',
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: getRarityColor(item.rarity),
                  fontWeight: 'bold'
                }}>
                  {item.rarity}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {!isSpinning && !showResult && (
            <motion.button
              onClick={startSpin}
              disabled={user && user.coins < caseItem.price}
              whileHover={{ 
                scale: (user && user.coins >= caseItem.price) ? 1.05 : 1,
                boxShadow: (user && user.coins >= caseItem.price) 
                  ? '0 8px 25px rgba(162, 89, 255, 0.6)' 
                  : 'none'
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: (user && user.coins >= caseItem.price) 
                  ? 'linear-gradient(90deg, #a259ff, #3f2b96)' 
                  : '#333',
                color: '#fff',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: (user && user.coins >= caseItem.price) ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: (user && user.coins >= caseItem.price) 
                  ? '0 4px 15px rgba(162, 89, 255, 0.4)' 
                  : 'none'
              }}
            >
              {user && user.coins < caseItem.price ? '❌ Coins insuffisants' : '🎲 Ouvrir la case'}
            </motion.button>
          )}
          
          {isSpinning && (
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                color: '#a259ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '15px 40px'
              }}
            >
              🎲 Ouverture en cours...
            </motion.div>
          )}
          
          <motion.button
            onClick={onClose}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {showResult ? 'Fermer' : 'Annuler'}
          </motion.button>
        </div>

        {/* Résultat de l'ouverture */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: `3px solid ${getRarityColor(result.skin.rarity)}`,
                boxShadow: `0 0 50px ${getRarityGlow(result.skin.rarity)}`,
                animation: 'pulse 2s infinite'
              }}
            >
              <h2 style={{ color: '#fff', marginBottom: '20px', fontSize: '2rem' }}>
                🎉 Félicitations !
              </h2>
              <img
                src={getSkinImageUrl(result.skin)}
                alt={result.skin.name}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: `3px solid ${getRarityColor(result.skin.rarity)}`,
                  boxShadow: `0 0 20px ${getRarityGlow(result.skin.rarity)}`
                }}
              />
              <h3 style={{ 
                color: getRarityColor(result.skin.rarity), 
                marginBottom: '10px',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {result.skin.name}
              </h3>
              <p style={{ color: '#cfcfff', marginBottom: '15px', fontSize: '1.1rem' }}>
                {result.skin.weapon} • {result.skin.rarity}
              </p>
              <p style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Nouveau solde: {result.newBalance} coins
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </AnimatePresence>
  );
};

export default CaseOpening; 