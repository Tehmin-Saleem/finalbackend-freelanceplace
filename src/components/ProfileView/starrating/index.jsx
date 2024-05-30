import React, { useState } from "react";
import "./styles.scss";

const StarRating = () => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={`star ${value <= rating ? "checked" : ""}`}
            onClick={() => handleStarClick(value)}
          >
            &#9733;
          </span>
        ))}
      </div>
    </>
  );
};

export default StarRating;
