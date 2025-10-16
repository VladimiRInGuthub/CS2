import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'ui-button';
  const variantClasses = `ui-button--${variant}`;
  const sizeClasses = `ui-button--${size}`;
  const loadingClasses = loading ? 'ui-button--loading' : '';
  const disabledClasses = disabled ? 'ui-button--disabled' : '';
  
  const allClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    loadingClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={allClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="ui-button__spinner">
          <div className="spinner"></div>
        </span>
      )}
      <span className="ui-button__content">
        {children}
      </span>
    </button>
  );
};

export default Button;