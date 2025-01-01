import React from "react";
import "./styles.scss";
import StarRating from "../ProfileView/starrating";
import { JobSucces } from "../../svg";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
const JobsCard = ({
  jobPostId, 
  type,
  title,
  rate,
  timeline,
  level,
  description,
  tags,
  proposalCount,
  paymentMethodStatus,
  verified,
  rating,
  location ,// Receive location prop here
  clientName,     // Add these new props
  clientLocation,
  createdAt,
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
        <div className="job-card__title-container">
        <p>
        <span className="job-card__createdAt">Posted: {createdAt}</span>
</p>

            <h2 className="job-card__title">{title}</h2>
            <div className="job-card__client-info">
              <span>Posted by: {clientName}</span>
              <span>From: {clientLocation}</span>
            </div>
          </div>
          
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
          {/* <div className="payment-status">
            {paymentMethodStatus === "Payment Verified" // Updated this condition
              ? <span className="verified">✓ Verified Payment</span>
              : <span className="unverified">⚠ Unverified Payment</span>
            }
          </div> */}
          <span className="job-card__location">{location}</span>
          <span className="job-card__proposals-head">Proposals:</span>
          <span className="job-card__proposals">{proposalCount}</span>
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
