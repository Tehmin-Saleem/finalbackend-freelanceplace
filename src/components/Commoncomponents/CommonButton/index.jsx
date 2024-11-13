// Button.jsx
import React from "react";

const CommonButton = ({ text, className, onClick, disabled }) => {
  // Combine the provided className with disabled styles
  const buttonClassName = `${className} ${
    disabled 
      ? 'opacity-50 cursor-not-allowed pointer-events-none bg-gray-400' 
      : ''
  }`;

  return (
    <button 
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled}
      style={disabled ? { pointerEvents: 'none' } : {}}
    >
      {text}
    </button>
  );
};

export default CommonButton;