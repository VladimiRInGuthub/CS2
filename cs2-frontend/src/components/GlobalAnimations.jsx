import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    setTransitionStage('fadeOut');
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage('fadeIn');
    }, 150);
    return () => clearTimeout(timeout);
  }, [location, children]);

  return (
    <div className={`route-transition ${transitionStage}`}>
      {displayChildren}
    </div>
  );
};

export const BackgroundParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count });
  return (
    <div className="bg-particles" aria-hidden="true">
      {particles.map((_, i) => (
        <span key={i} className="bg-particle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${6 + Math.random() * 6}s`
        }} />
      ))}
    </div>
  );
};

export const ScrollIndicator = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-indicator" style={{ width: `${progress}%` }} />
  );
};

export const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>{t.message}</div>
      ))}
    </div>
  );
};

export default {
  RouteTransitionWrapper,
  BackgroundParticles,
  ScrollIndicator,
  ToastContainer,
};