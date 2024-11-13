// src/components/ui/Toast.jsx
import React from 'react';

export const toast = ({ message, type = 'success', onClose }) => {
  return (
    <div 
      className={`fixed bottom-4 left-4 p-4 rounded-md shadow-lg transition-opacity duration-500 z-50
        ${type === 'success' ? 'bg-green-500' : 
          type === 'error' ? 'bg-red-500' : 
          type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'} 
        text-white`}
    >
      {message}
    </div>
  );
};