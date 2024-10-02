import React from 'react';
import './styles.scss';
import { CrossIcon } from '../../../svg';

const JobPostedPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p className="message">Your Job has been posted!</p>
        <p className="sub-message">
          Thank you for submitting. Good luck with finding the right talent
          <span className="emoji"> 🎉</span>
        </p>
        <button className="close-button" onClick={onClose}><CrossIcon/></button>
      </div>
    </div>
  );
};

export default JobPostedPopup;
