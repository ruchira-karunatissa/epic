// src/components/ui/card.jsx
import React from 'react';

export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-white shadow-sm ${className}`}
    {...props}
  />
));

export const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props} />
));

Card.displayName = "Card";
CardContent.displayName = "CardContent";