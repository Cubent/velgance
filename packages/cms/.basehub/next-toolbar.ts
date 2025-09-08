// Stub file for BaseHub Toolbar component
import React from 'react';

export interface ToolbarProps {
  [key: string]: any;
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  // Return null in production, toolbar only for development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '8px',
      background: '#000',
      color: '#fff',
      fontSize: '12px',
      zIndex: 9999,
    },
    ...props
  }, 'BaseHub Toolbar (Dev)');
};
