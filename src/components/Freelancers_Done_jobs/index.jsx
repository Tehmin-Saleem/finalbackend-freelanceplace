// import React from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./styles.scss";
// import StarRating from "../ProfileView/starrating";
// import { JobSucces } from "../../svg";

// const JobsCard = ({
//   id,
//   type,
//   title,
//   rate,
//   timeline,
//   level,
//   description,
//   freelancer_id,
//   client_id,
//   tags,
//   verified,
//   rating,
//   location,
//   postedTime,
//   proposalId // Add this prop if you have a specific proposal ID to view
// }) => {
//   const navigate = useNavigate();

//   const handleViewClick = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       };

//       // Fetch specific proposal data
//       const response = await axios.get(
//         `http://localhost:5000/api/freelancer/getproposals?jobId=${id}`,
//         { headers }
//       );

//       // Find the specific proposal for this job
//       const specificProposal = response.data.proposals.find(
//         proposal => proposal._id === proposalId
//       );
      
// console.log('proposals',response.data )
//       if (!specificProposal) {
//         throw new Error('No proposal found for this job');
//       }

//       // Navigate to ManageProj page with job and specific proposal data
//       navigate("/manageproj", {
//         state: {
//           jobData: {
//             id,
//             type,
//             title,
//             rate,
//             timeline,
//             level,
//             description,
//             tags,
//             verified,
//             rating,
//             location,
          
//             postedTime
//           },
//           proposalData: specificProposal ,
//           freelancer_id: freelancer_id,
//           client_id: client_id
//         }
//       });
//     } catch (error) {
//       console.error('Error fetching proposal data:', error);
      
//     }
//   };

  
//   return (
//     <div className="job-card">
//       <div className="job-card__content">
//         <div className="job-card__header">
//           <span className="job-card__title">{title}</span>
//           <span className="job-card__posted-time">Posted {postedTime}</span>
//           <button className="job-card__view-button" onClick={handleViewClick}>View</button>
//         </div>
//         <div className="job-card__information">
//           <span className="job-card__rate-head">{type}:</span>
//           <span className="job-card__rated">{rate}</span>
//           <span className="job-card__timeline-head">Estimated time:</span>
//           <span className="job-card__timeline"> {timeline}</span>
//           <span className="job-card__level-head">Level:</span>
//           <span className="job-card__level"> {level}</span>
//         </div>
//         <p className="job-card__description">{description}</p>
//         <div className="job-card__tags">
//           {tags.map((tag, index) => (
//             <span key={index} className="job-card__tag">{tag}</span>
//           ))}
//         </div>
//         <div className="job-card__extra">
//         <JobSucces className="h-3 w-3" />
//           {verified && <span className="job-card__verified">Verified account</span>}
//           <StarRating /> {/* Insert the StarRating component here */}
//           <span className="job-card__rating">{rating}</span>
//           <span className="job-card__location">{location}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobsCard;




import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.scss";
import StarRating from "../ProfileView/starrating";
import { JobSucces } from "../../svg";

const JobsCard = ({
  job_id,
  type,
  title,
  rate,
  timeline,
  level,
  description,
  freelancer_id,
  client_id,
  tags,
  verified,
  rating,
  location,
  postedTime,
  proposalId
}) => {
  const navigate = useNavigate();

  const handleViewClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        'Authorization': `Bearer ${token}`, // Fixed template literal
        'Content-Type': 'application/json'
      };

      // Fetch specific proposal data
      const response = await axios.get(
        `http://localhost:5000/api/freelancer/getproposals?jobId=${job_id}`, // Fixed template literal
        { headers }
      );
      console.log('Fetched job_id:', job_id); // Debug log
      // Find the specific proposal for this job
      const specificProposal = response.data.proposals.find(
        proposal => proposal._id === proposalId
      );
      
      console.log('proposals', response.data);
      
      if (!specificProposal) {
        throw new Error('No proposal found for this job');
      }

      // Navigate to ManageProj page with job and specific proposal data
      navigate("/manageproj", {
        state: {
          jobData: {
            job_id,
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
            postedTime // Removed trailing comma
          },
          proposalData: specificProposal,
          freelancer_id: freelancer_id,
          client_id: client_id,
          job_id:job_id
        }
      });
    } catch (error) {
      console.error('Error fetching proposal data:', error);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card__content">
        <div className="job-card__header">
          <span className="job-card__title">{title}</span>
          <span className="job-card__posted-time">Posted {postedTime}</span>
          <button className="job-card__view-button" onClick={handleViewClick}>View</button>
        </div>
        <div className="job-card__information">
          <span className="job-card__rate-head">{type}:</span>
          <span className="job-card__rated">{rate}</span>
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