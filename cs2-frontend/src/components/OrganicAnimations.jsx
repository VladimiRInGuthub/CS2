import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// Composant pour les effets de parallaxe organiques
export const ParallaxElement = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les transitions de page fluides
export const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de hover organiques
export const OrganicHover = ({ children, scale = 1.05, className = "" }) => {
  return (
    <motion.div
      whileHover={{ 
        scale,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
      whileTap={{ 
        scale: scale * 0.95,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de focus organiques
export const OrganicFocus = ({ children, className = "" }) => {
  return (
    <motion.div
      whileFocus={{ 
        scale: 1.02,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations d'apparition en cascade
export const CascadeAnimation = ({ children, delay = 0.1, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de glitch organiques
export const OrganicGlitch = ({ children, className = "" }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% de chance de glitch
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{
        x: isGlitching ? [0, -2, 2, 0] : 0,
        filter: isGlitching ? "hue-rotate(90deg)" : "hue-rotate(0deg)"
      }}
      transition={{
        duration: 0.1,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de particules organiques
export const OrganicParticles = ({ count = 20, className = "" }) => {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`organic-particles ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Hook personnalisé pour les animations organiques
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

// Composant pour les effets de morphing organiques
export const OrganicMorph = ({ children, isActive = false, className = "" }) => {
  return (
    <motion.div
      animate={{
        borderRadius: isActive ? "50%" : "8px",
        scale: isActive ? 1.1 : 1,
        rotate: isActive ? 360 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de liquide organiques
export const LiquidEffect = ({ children, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(162, 89, 255, 0.1) 0%, transparent 50%)`
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les transitions de route organiques
export const RouteTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les effets de néon organiques
export const NeonEffect = ({ children, color = "#a259ff", className = "" }) => {
  return (
    <motion.div
      className={`neon-effect ${className}`}
      style={{
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`
      }}
      animate={{
        boxShadow: [
          `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`,
          `0 0 30px ${color}, 0 0 60px ${color}, 0 0 90px ${color}`,
          `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default {
  ParallaxElement,
  PageTransition,
  OrganicHover,
  OrganicFocus,
  CascadeAnimation,
  OrganicGlitch,
  OrganicParticles,
  useOrganicAnimation,
  OrganicMorph,
  LiquidEffect,
  RouteTransition,
  NeonEffect
}; 