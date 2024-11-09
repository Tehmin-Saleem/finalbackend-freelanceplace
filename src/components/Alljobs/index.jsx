import React from "react";
import "./styles.scss";

const Alljobs = ({
  jobId,
  title,
  rate,
  postedBy,
  proposals,
  messages,
  onViewClick,
}) => {
  // console.log("jobId in Alljobs:", jobId);
  return (
    <div className="job-card">
      <div className="job-card__content">
        <div className="job-card__header">
          <span className="job-card__title">{title}</span>
          {proposals > 0 && (
            <button className="job-card__view-button" onClick={() => onViewClick(jobId)}>
              View Proposals
            </button>
          )}
        </div>
        <div className="job-card__info">
          <span className="job-card__rate">{rate}</span>
          <div className="job-card__details">
            <span className="job-card__posted-by-head">Posted by: </span>
            <span className="job-card__posted-by">{postedBy}</span>
            <span className="job-card__proposals-head">Proposals: </span>
            <span className="job-card__proposals">{proposals}</span>
            <span className="job-card__messages-head">Message: </span>
            <span className="job-card__messages">{messages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alljobs;