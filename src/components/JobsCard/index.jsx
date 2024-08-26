import React from "react";
import "./styles.scss";
import StarRating from "../ProfileView/starrating";
import { JobSucces } from "../../svg";
import { useNavigate } from "react-router-dom";

const JobsCard = ({
  jobPostId, 
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
  const navigate = useNavigate();

  const handleViewClick = () => {
    console.log("Navigating to ApplyJob with ID:", jobPostId); // Debugging line
    if (jobPostId) {
      navigate(`/ApplyJob/${jobPostId}`);
    } else {
      console.error("jobPostId is undefined");
    }
  };

  return (
    <div className="job-card">
      <div className="job-card__content">
        <div className="job-card__header">
          <span className="job-card__title">{title}</span>
          <button className="job-card__view-button" onClick={handleViewClick}>
            View
          </button>
        </div>
        <div className="job-card__info">
          <span className="job-card__rate-head">{type}:</span>
          <span className="job-card__rate">{rate}</span>
          <span className="job-card__timeline-head">Estimated time:</span>
          <span className="job-card__timeline"> {timeline}</span>
          <span className="job-card__level-head">Level:</span>
          <span className="job-card__level"> {level}</span>
        </div>
        <p className="job-card__description">{description}</p>
        <div className="job-card__tags">
          {tags.map((tag, index) => (
            <span key={index} className="job-card__tag">{tag}</span>
          ))}
        </div>
        <div className="job-card__extra">
          <JobSucces className="h-3 w-3" />
          {verified && <span className="job-card__verified">Verified account</span>}
          <StarRating /> 
          <span className="job-card__rating">{rating}</span>
          <span className="job-card__location">{location}</span>
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
