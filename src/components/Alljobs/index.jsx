// import React from "react";
// import "./styles.scss";

// const Alljobs = ({
//   jobId,
//   title,
//   rate,
//   postedBy,
//   proposals,
//   messages,
//   onViewClick,
//   job,
//   status, // Add status prop
// }) => {


//   // Function to check if button should be disabled
//   const isButtonDisabled = () => {
//     return status === "completed";
//   };

//   // Function to get button text based on status
//   const getButtonText = () => {
//     return status === "completed" ? "Job Completed" : "View Proposals";
//   };

//   const getStatusBadge = () => {
//     if (job.isHired) {
//       return <span className="badge ongoing">Ongoing</span>;
//     } else if (job.isPastDue) {
//       return <span className="badge pending">Pending</span>;
//     } else {
//       return <span className="badge active">Active</span>;
//     }
//   };

//   return (
//     <div className="job-card">
//       <div className="job-card__content">
//         <div className="job-card__header">
//           <span className="job-card__title">{title}</span>



//          {proposals > 0 && (
//             <button 
//               className={`job-card__view-button ${status === "completed" ? "disabled" : ""}`}
//               onClick={() => !isButtonDisabled() && onViewClick(jobId)}
//               disabled={isButtonDisabled()}
//             >
//               {getButtonText()}
//             </button>
//           )}
//         </div>
//         <div className="job-card__info">
//         <span className="job-card__posted-by-head">Budget </span>
//         <span className="job-card__rate">{rate}</span>
//           <div className="job-card__details">
//             <span className="job-card__posted-by-head">Posted by: </span>
//             <span className="job-card__posted-by">{postedBy}</span>
//             <span className="job-card__proposals-head">Proposals: </span>
//             <span className="job-card__proposals">{proposals}</span>
//             <span className="job-card__messages-head">Message: </span>
//             <span className="job-card__messages">{messages}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Alljobs;




import React from "react";
import "./styles.scss";
import { format,isValid } from 'date-fns'; // Import for date formatting

const Alljobs = ({
  jobId,
  title,
  rate,
  postedBy,
  proposals,
  messages,
  onViewClick,
  status,
  // Add new props
  budgetType,
  createdAt,
  description,
  dueDate,
  attachment,
  preferredSkills,
  projectDuration,
  proposalCount
}) => {
 const isButtonDisabled = () => {
  return status === "completed" || status === "ongoing";
};

const getButtonText = () => {
  return status === "completed" 
    ? "Job Completed" 
    : status === "ongoing" 
      ? "Ongoing Job" 
      : "View Proposals";
};

 const formatDate = (date) => {
    if (!date || !isValid(new Date(date))) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Invalid date encountered:", date); // Log only in development mode
      }
      return "N/A"; // Fallback for invalid or missing dates
    }
    return format(new Date(date), "yyyy-MM-dd"); // Format the valid date
  };

const getStatusClass = () => {
  switch (status) {
    case 'ongoing': return 'status-ongoing';
    case 'completed': return 'status-completed';
    case 'pending': return 'status-pending';
    default: return 'status-active';
  }
};


  return (
    <div className="job-card">
      <div className="job-card__content">
        <div className="job-card__header">
          <div className="job-card__title-section">
            <h2 className="job-card__title">{title}</h2>
            <span className={`job-card__status ${getStatusClass()}`}>
              {status}
            </span>
          </div>
          
          {proposalCount > 0 && (
            <button 
              className={`job-card__view-button ${status === "completed" ? "disabled" : ""}`}
              onClick={() => !isButtonDisabled() && onViewClick(jobId)}
              disabled={isButtonDisabled()}
            >
              {getButtonText()}
            </button>
          )}
        </div>

        <div className="job-card__description">
          <p>{description}</p>
        </div>

        <div className="job-card__details-grid">
          <div className="details-item">
            <span className="label">Budget Type:</span>
            <span className="value">{budgetType}</span>
          </div>
          
          <div className="details-item">
            <span className="label">Rate:</span>
            <span className="value">{rate}</span>
          </div>

          <div className="details-item">
            <span className="label">Posted:</span>
            <span className="value">{formatDate(createdAt)}</span>
          </div>

          <div className="details-item">
            <span className="label">Due Date:</span>
            <span className="value">{formatDate(dueDate)}</span>
          </div>
        </div>

        <div className="job-card__skills">
          <span className="label">Required Skills:</span>
          <div className="skills-container">
            {preferredSkills?.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="job-card__project-info">
          <div className="project-detail">
            <span className="label">Project Size:</span>
            <span className="value">{projectDuration?.project_size}</span>
          </div>
          <div className="project-detail">
            <span className="label">Duration:</span>
            <span className="value">{projectDuration?.duration_of_work}</span>
          </div>
          <div className="project-detail">
            <span className="label">Experience:</span>
            <span className="value">{projectDuration?.experience_level}</span>
          </div>
        </div>

        <div className="job-card__footer">
          <div className="stats">
            <span className="stat-item">
              <i className="icon-proposal"></i>
              {proposalCount} Proposals
            </span>
            <span className="stat-item">
              <i className="icon-message"></i>
              {messages} Messages
            </span>
          </div>
          
          {attachment?.path && (
            <div className="attachment">
              <a href={attachment.path} target="_blank" rel="noopener noreferrer">
                View Attachment
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alljobs;