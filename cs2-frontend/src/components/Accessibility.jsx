import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Accessibility.css';

// Hook pour la gestion du focus
export const useFocusManagement = () => {
  const [focusableElements, setFocusableElements] = useState([]);

  useEffect(() => {
    const updateFocusableElements = () => {
      const elements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      setFocusableElements(Array.from(elements));
    };

    updateFocusableElements();
    window.addEventListener('resize', updateFocusableElements);
    
    return () => {
      window.removeEventListener('resize', updateFocusableElements);
    };
  }, []);

  const focusFirst = () => {
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };

  const focusLast = () => {
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  };

  const trapFocus = (container) => {
    const focusableInContainer = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableInContainer.length === 0) return;

    const firstElement = focusableInContainer[0];
    const lastElement = focusableInContainer[focusableInContainer.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return {
    focusFirst,
    focusLast,
    trapFocus,
    focusableElements
  };
};

// Composant pour les annonces d'accessibilité
export const AccessibilityAnnouncer = () => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="accessibility-announcer"
    >
      {announcement}
    </div>
  );
};

// Hook pour les annonces
export const useAnnouncer = () => {
  const [announcer, setAnnouncer] = useState(null);

  useEffect(() => {
    setAnnouncer(document.querySelector('.accessibility-announcer'));
  }, []);

  const announce = (message) => {
    if (announcer) {
      announcer.textContent = message;
    }
  };

  return { announce };
};

// Composant pour les raccourcis clavier
export const KeyboardShortcuts = () => {
  const { t } = useTranslation();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + ? pour afficher les raccourcis
      if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      
      // Escape pour fermer les raccourcis
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const shortcuts = [
    {
      key: 'Ctrl/Cmd + ?',
      description: t('accessibility.showShortcuts', 'Afficher les raccourcis clavier')
    },
    {
      key: 'Escape',
      description: t('accessibility.closeModal', 'Fermer les modales')
    },
    {
      key: 'Tab',
      description: t('accessibility.navigate', 'Navigation au clavier')
    },
    {
      key: 'Enter/Space',
      description: t('accessibility.activate', 'Activer les éléments')
    },
    {
      key: 'Ctrl/Cmd + K',
      description: t('accessibility.search', 'Recherche rapide')
    }
  ];

  if (!showShortcuts) return null;

  return (
    <div className="keyboard-shortcuts-overlay" onClick={() => setShowShortcuts(false)}>
      <div className="keyboard-shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>{t('accessibility.keyboardShortcuts', 'Raccourcis clavier')}</h2>
          <button 
            className="close-btn"
            onClick={() => setShowShortcuts(false)}
            aria-label={t('accessibility.close', 'Fermer')}
          >
            ×
          </button>
        </div>
        
        <div className="shortcuts-list">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item">
              <kbd className="shortcut-key">{shortcut.key}</kbd>
              <span className="shortcut-description">{shortcut.description}</span>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          <p>{t('accessibility.shortcutsNote', 'Appuyez sur Escape pour fermer')}</p>
        </div>
      </div>
    </div>
  );
};

// Composant pour les indicateurs de focus
export const FocusIndicator = ({ children, className = '' }) => {
  return (
    <div className={`focus-indicator ${className}`}>
      {children}
    </div>
  );
};

// Composant pour les boutons accessibles
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  ariaLabel,
  ...props 
}) => {
  const { t } = useTranslation();
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      className={`accessible-button ${variant} ${size} ${className} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {loading && (
        <span className="loading-spinner" aria-hidden="true">
          <div className="spinner"></div>
        </span>
      )}
      <span className="button-content">
        {children}
      </span>
    </button>
  );
};

// Composant pour les modales accessibles
export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  size = 'medium'
}) => {
  const { t } = useTranslation();
  const { trapFocus } = useFocusManagement();
  const modalRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      return cleanup;
    }
  }, [isOpen, trapFocus]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="accessible-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`accessible-modal ${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t('accessibility.closeModal', 'Fermer la modale')}
          >
            ×
          </button>
        </div>
        
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Composant pour les notifications accessibles
export const AccessibleToast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  const getTypeLabel = (type) => {
    const labels = {
      success: t('accessibility.success', 'Succès'),
      error: t('accessibility.error', 'Erreur'),
      warning: t('accessibility.warning', 'Attention'),
      info: t('accessibility.info', 'Information')
    };
    return labels[type] || labels.info;
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`accessible-toast ${type} ${isVisible ? 'visible' : 'hidden'}`}
      role="alert"
      aria-live="polite"
      aria-label={getTypeLabel(type)}
    >
      <div className="toast-icon" aria-hidden="true">
        {getTypeIcon(type)}
      </div>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
      <button 
        className="toast-close"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        aria-label={t('accessibility.close', 'Fermer')}
      >
        ×
      </button>
    </div>
  );
};

export default {
  useFocusManagement,
  AccessibilityAnnouncer,
  useAnnouncer,
  KeyboardShortcuts,
  FocusIndicator,
  AccessibleButton,
  AccessibleModal,
  AccessibleToast
};
