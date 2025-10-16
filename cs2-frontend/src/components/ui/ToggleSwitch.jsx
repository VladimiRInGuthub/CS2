import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ 
  leftLabel = 'Monthly', 
  rightLabel = 'Yearly', 
  isYearly = false, 
  onChange,
  className = '',
  ...props 
}) => {
  const handleToggle = () => {
    onChange && onChange(!isYearly);
  };

  return (
    <div className={`toggle-switch ${className}`} {...props}>
      <span className={`toggle-label ${!isYearly ? 'active' : ''}`}>
        {leftLabel}
      </span>
      
      <button 
        className={`toggle-button ${isYearly ? 'yearly' : 'monthly'}`}
        onClick={handleToggle}
        aria-label={`Switch to ${isYearly ? 'monthly' : 'yearly'} billing`}
      >
        <div className="toggle-slider" />
      </button>
      
      <span className={`toggle-label ${isYearly ? 'active' : ''}`}>
        {rightLabel}
      </span>
    </div>
  );
};

export default ToggleSwitch;
