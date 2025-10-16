import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

const Toast = ({ 
  id,
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'top-right',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, id]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`toast toast-${type} toast-${position}`}
          initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          {...props}
        >
          <div className="toast-content">
            <span className="toast-icon">{getIcon()}</span>
            <span className="toast-message">{message}</span>
            <button 
              className="toast-close"
              onClick={handleClose}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
          
          <motion.div
            className="toast-progress"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Container pour gérer plusieurs toasts
const ToastContainer = ({ toasts, onClose, position = 'top-right' }) => {
  return (
    <div className={`toast-container toast-container-${position}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            position={position}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;
