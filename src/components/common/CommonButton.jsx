// Button.jsx
import React from "react";

const CommonButton = ({ text, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default CommonButton;
