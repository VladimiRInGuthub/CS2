import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './OrganicAnimations.css';

// Composant pour les transitions de route avec animations organiques
export const RouteTransitionWrapper = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.6
        }}
        className="route-transition"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Composant pour les effets de particules en arrière-plan
export const BackgroundParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="background-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="background-particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Composant pour les effets de scroll organiques
export const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="scroll-indicator"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'linear-gradient(90deg, #a259ff, #3f2b96)',
        zIndex: 9999,
        transformOrigin: 'left'
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    />
  );
};

// Composant pour les notifications organiques
export const OrganicNotification = ({ message, type = 'info', onClose, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`organic-notification ${type}`}
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '12px',
            background: 'rgba(28, 28, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: 10000,
            maxWidth: '300px',
            color: '#fff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>
              {type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span style={{ flex: 1 }}>{message}</span>
            {onClose && (
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant pour les effets de chargement organiques
export const OrganicLoader = ({ size = 'medium' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <motion.div
      className="organic-loader"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        border: `3px solid rgba(162, 89, 255, 0.2)`,
        borderTop: `3px solid #a259ff`,
        display: 'inline-block'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Composant pour les effets de focus organiques
export const FocusRing = ({ children, isFocused }) => {
  return (
    <motion.div
      className="focus-ring"
      animate={{
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused 
          ? '0 0 0 3px rgba(162, 89, 255, 0.3)' 
          : '0 0 0 0px rgba(162, 89, 255, 0)'
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de hover organiques
export const HoverEffect = ({ children, intensity = 1 }) => {
  return (
    <motion.div
      className="hover-effect"
      whileHover={{
        scale: 1 + (intensity * 0.05),
        y: -intensity * 2,
        boxShadow: `0 ${intensity * 8}px ${intensity * 25}px rgba(0, 0, 0, 0.15)`
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de morphing organiques
export const MorphingElement = ({ children, isActive, className = "" }) => {
  return (
    <motion.div
      className={`morphing-element ${className}`}
      animate={{
        borderRadius: isActive ? "50%" : "8px",
        scale: isActive ? 1.1 : 1,
        rotate: isActive ? 180 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }}
    >
      {children}
    </motion.div>
  );
};

// Hook pour les animations organiques
export const useOrganicAnimation = (trigger = true) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return isAnimating;
};

// Composant pour les effets de parallaxe organiques
export const ParallaxContainer = ({ children, speed = 0.5 }) => {
  return (
    <motion.div
      className="parallax-container"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      whileHover={{
        rotateX: speed * 5,
        rotateY: speed * 5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  RouteTransitionWrapper,
  BackgroundParticles,
  ScrollIndicator,
  OrganicNotification,
  OrganicLoader,
  FocusRing,
  HoverEffect,
  MorphingElement,
  useOrganicAnimation,
  ParallaxContainer
}; 