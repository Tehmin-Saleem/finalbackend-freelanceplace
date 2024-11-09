// Spinner.jsx
import React from "react";
import "./styles.scss"; // Make sure to import the CSS file

// const Spinner = () => {
//   return <div className="spinner"></div>;
// };

// export default Spinner;





const Spinner = ({ size = 80, alignCenter = false }) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  return (
    <div className={`spinner-container ${alignCenter ? "center" : ""}`}>
      <div className="spinner" style={spinnerStyle}></div>
    </div>
  );
};

export default Spinner;


