import React from "react";
import "./styles.scss"; // Import the SCSS file

const JobsCard = ({
  type,
  title,
  rate,
  timeline,
  level,
  description,
  tags,
  verified,
  rating,
  location,
}) => {
  return (
    <div className="job-card">
      <div className="job-card__content">
        <div className="job-card__header">
          <span className="job-card__title">{title}</span>
          <button className="job-card__view-button">View</button>
        </div>
        <div className="job-card__info">
          <span className="job-card__rate">{type}: {rate}</span>
          <span className="job-card__timeline">Estimated time: {timeline}</span>
          <span className="job-card__level">Level: {level}</span>
        </div>
        <p className="job-card__description">{description}</p>
        <div className="job-card__tags">
          {tags.map((tag, index) => (
            <span key={index} className="job-card__tag">{tag}</span>
          ))}
        </div>
        <div className="job-card__extra">
          {verified && <span className="job-card__verified">Verified account</span>}
          <span className="job-card__rating">Rating: {rating}</span>
          <span className="job-card__location">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
