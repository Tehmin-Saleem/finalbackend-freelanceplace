import React from "react";
import PropTypes from "prop-types";
import "./style.scss"; // Import the Sass file

const Textfield = ({
  label,
  icon,
  value,
  placeholder,
  onChange,
  onBlur,
  errorMessage,
  className,
  textColor,
}) => {
  return (
    <div className="textfield-container">
      {label && <label>{label}</label>}
      <div style={{ display: "flex", flexDirection: "row" }}>
        {icon && (
          <div className="icon" style={{ fill: "red" }}>
            {icon}
          </div>
        )}{" "}
        {/* Render the icon */}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          style={{ color: textColor }}
          className={` ${className}`}
        />
      </div>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

// Textfield.propTypes = {
//   textColor: PropTypes.string,
//   label: PropTypes.string,
//   icon: PropTypes.elementType, // Accepts any component as an icon
//   value: PropTypes.string.isRequired,
//   placeholder: PropTypes.string,
//   onChange: PropTypes.func.isRequired,
//   onBlur: PropTypes.func,
//   errorMessage: PropTypes.string,
//   className: PropTypes.string,
// };

export default Textfield;
