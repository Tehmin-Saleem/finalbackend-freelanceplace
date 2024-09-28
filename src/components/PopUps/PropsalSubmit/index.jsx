import React from 'react';
import './styles.scss';

const Popup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p className="message">Proposal has been submitted</p>
        <p className="sub-message">
          Hope for the best
          <span className="emoji"> 😊</span>
        </p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
