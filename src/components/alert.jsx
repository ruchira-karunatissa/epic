// src/components/ui/alert.jsx
import React from 'react';

export const Alert = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={`relative w-full rounded-lg border p-4 ${className}`}
    {...props}
  />
));

export const AlertDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm ${className}`}
    {...props}
  />
));

Alert.displayName = "Alert";
AlertDescription.displayName = "AlertDescription";