import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  className = '',
  onClick,
  hoverable = false,
  ...props 
}) => {
  const baseClasses = 'ui-card';
  const variantClasses = `ui-card--${variant}`;
  const sizeClasses = `ui-card--${size}`;
  const hoverableClasses = hoverable ? 'ui-card--hoverable' : '';
  const clickableClasses = onClick ? 'ui-card--clickable' : '';
  
  const allClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    hoverableClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={allClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`ui-card__header ${className}`} {...props}>
    {children}
  </div>
);

// Card Body Component
const CardBody = ({ children, className = '', ...props }) => (
  <div className={`ui-card__body ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`ui-card__footer ${className}`} {...props}>
    {children}
  </div>
);

// Card Title Component
const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`ui-card__title ${className}`} {...props}>
    {children}
  </h3>
);

// Card Description Component
const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`ui-card__description ${className}`} {...props}>
    {children}
  </p>
);

// Card Image Component
const CardImage = ({ src, alt, className = '', ...props }) => (
  <div className={`ui-card__image ${className}`} {...props}>
    <img src={src} alt={alt} />
  </div>
);

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Image = CardImage;

export default Card;