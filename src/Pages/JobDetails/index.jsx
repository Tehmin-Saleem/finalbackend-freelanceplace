import React from "react";
import "./styles.scss";
import Header from "../../components/Common/Header";

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="edit-icon"
    width="20"
    height="20"
  >
    <path
      fill="#4BCBEB"
      d="M2 17.25V21h3.75L17.81 8.94l-3.75-3.75L2 17.25zm16.71-9.04a1.001 1.001 0 000-1.41l-2.34-2.34a1.001 1.001 0 00-1.41 0L13 4.94l3.75 3.75 1.96-1.96z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="eye-icon"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c7 0 10-9 10-9s-3-9-10-9-10 9-10 9 3 9 10 9z"
    />
  </svg>
);

const JobDetails = () => {
  return (
    <div>
      <Header />
      <div className="job-details">
        <div className="top-bar">
          <h1 className="title">Job Details</h1>
          <button className="btn post-job-btn">Post a Job</button>
        </div>
        <div className="content">
          <div className="details-container">
            <div className="detail-row">
              <h2 className="detail-title">UI/UX Designer</h2>
              <EditIcon />
            </div>
            <div className="detail-row">
              <p className="detail-description">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                 <br/> 
                Quisquam, expedita doloribus quae quaerat mollitia eos labore at
                <br/>
                facere quam aliquam cum voluptatum, magni nam amet deserunt
                earum
                <br/> 
                
                facilis suscipit voluptate!
              </p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Skills</h3>
              <p className="detail-text">Adobe XD, Figma, Prototyping</p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Budget</h3>
              <p className="detail-text">$150.00</p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Project Duration</h3>
              <p className="detail-text">Large, 3 to 6 months, Expert</p>
              <EditIcon />
            </div>
            <div className="detail-row">
              <h3 className="detail-heading">Attachment</h3>
              <div className="attachment">
                <div className="file-details">
                  <span className="file-icon">&#128206;</span>
                  <span className="file-name">
                    Design requirements.doc (1.4 MB)
                  </span>
                </div>
                <button className="btn view-btn">
                  <EyeIcon />
                  View
                </button>
              </div>
              <EditIcon />
            </div>
          </div>
          <div className="actions">
            <button className="btn back-btn">Back</button>
            <button className="btn post-job-btn">Post a Job</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
