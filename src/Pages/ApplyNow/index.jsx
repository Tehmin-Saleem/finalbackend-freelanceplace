import React from "react";
import Header from "../../components/Common/Header";
import "./styles.scss";

const ApplyJob = () => {
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

  return (
    <>
      <Header />
      <div className="job-details-container">
        <h2 className="job-details-heading">Job details</h2>

        <div className="job-card">
          <div className="job-header">
            <div>
              <h3 className="job-title">Graphic Designer for Cricket Tech Brand</h3>
              <p className="job-location">Lahore, Punjab Pakistan.</p>
              <p className="job-posted-time">
  <span className="posted-text">Posted:</span> 
  <span className="time-text"> 55 minutes ago</span>
</p>

            </div>
            <button className="apply-now-btn">Apply now</button>
          </div>

          <hr className="divider" />

          <div className="job-info">
  <span className="job-info-item">
    <span className="label">Hourly:</span> 
    <span className="value">$12/hr</span>
  </span>
  <span className="job-info-item">
    <span className="label">Estimated Time:</span> 
    <span className="value">1 to 3 months</span>
  </span>
  <span className="job-info-item">
    <span className="label">Level:</span> 
    <span className="value">Expert</span>
  </span>
</div>

          <h4 className="section-title">Project Overview:</h4>
          <p className="job-description">
            {" "}
            I'm looking to create memorable and user-centric digital experiences? Your search ends <br />
            here! I am a highly skilled and innovative UX/UI designer, Graphic designer, and <br /> WordPress designer from Bangladesh, ready to
            revolutionize your projects.With a deep <br /> for creating outstanding experience and effective visuals I guarentte top- <br />{" "}
            notch results that will leave a lasting impression
          </p>

          <h4 className="section-title">Attachment(4):</h4>
          <div className="attachments">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="attachment-item">
                <div className="attachment-file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">Design requirements.doc (1.4 MB)</span>
                </div>
                <button className="view-btn">
                  <EyeIcon />
                  View
                </button>
              </div>
            ))}
          </div>

          <h4 className="section-title">Skills and Expertise:</h4>
          <div className="skills">
            {[
              "Mobile app design",
              "Wireframe",
              "Mockup",
              "Prototyping",
              "Figma",
              "User flow",
              "+10",
            ].map((skill) => (
              <span key={skill} className="skill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyJob;
