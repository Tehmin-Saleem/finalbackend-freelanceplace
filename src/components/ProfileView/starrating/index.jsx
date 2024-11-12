import React from "react";
import "./styles.scss";

const StarRating = ({ rating, showRatingValue = false }) => {
  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={`star ${value <= rating ? "filled" : "empty"}`}
          >
            &#9733;
          </span>
        ))}
      </div>
      {showRatingValue && <span className="rating-value">({rating}/5)</span>}
    </div>
  );
};

export default StarRating;