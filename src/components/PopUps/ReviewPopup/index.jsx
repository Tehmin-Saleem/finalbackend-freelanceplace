import React, { useState } from 'react';
import './styles.scss';

const ReviewPopup = ({ onClose }) => {
  const [rating, setRating] = useState(0); // State for star rating
  const [hoverRating, setHoverRating] = useState(0); // State for hover effect on stars

  // Function to handle star click
  const handleRating = (index) => {
    setRating(index);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Close Icon */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Review Title */}
        <h2 className="popup-title">Give your review</h2>

        {/* Review Input Section */}
        <div className="review-section">
          <h4 className='titleBox'>Enter your review:</h4>
          <textarea
            className="review-textarea"
            placeholder="Write your review here..."
            rows="4"
          />
        </div>

        {/* Rating Section */}
        <div className="rating-section">
          <h4 className='rating'>Give rating:</h4>
          <div className="stars">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <span
                  key={index}
                  className={index <= (hoverRating || rating) ? 'star filled' : 'star'}
                  onClick={() => handleRating(index)}
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(rating)}
                >
                  &#9733;
                </span>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button className="submit-button">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;
