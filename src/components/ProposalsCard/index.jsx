// import React from "react";
// import "./styles.scss";
// import { JobSucces } from "../../svg";
// import Profile from "/images/Profile.png";

// const Card = ({ freelancer }) => {
//   return (
//     <div className="card">
//       <div className="cardContent">
//         {/* <div className="imageWrapper">
//           <img src={Profile} alt="Freelancer" className="image" />
//         </div> */}
//         <div className="details">
//           <div className="header">
//             <div className="profile">
//               <img src={Profile} alt="Freelancer" className="profileImage" />
//               <div>
//                 <div className="flex">
//                   <h4 className="name">{freelancer.name}</h4>
//                   <p className="locationField">
//                     {freelancer.location}
//                     {/* | {freelancer.field} */}
//                   </p>
//                 </div>
//                 <p className="FreelancerField">{freelancer.field} </p>
//                 <p className="skills"></p>
//               </div>
//             </div>
//             <button className="inviteButton">Invite a Job</button>
//           </div>
//           <div className="rateSuccessEarned">
//             <span className="rate">${freelancer.rate}/hr</span>
//             <JobSucces className="svg" />
//             <span className="success">{freelancer.successRate}% Success</span>
//             <span className="earned">${freelancer.amountEarned} earned</span>
//           </div>
//           <div className="skillTags">
//             {freelancer.skills.map((skill) => (
//               <span key={skill} className="skillTag">
//                 {skill}
//               </span>
//             ))}
//           </div>
//           <p className="description">{freelancer.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Card;


// import React from "react";
// import "./styles.scss"; // Import the SCSS file

// const ProposalCard = ({
//   name,
//   title,
//   location,
//   rate,
//   earned,
//   qualification,
//   timeline,
//   coverLetter,
//   image,
// }) => {
//   return (
//     <div className="proposal-card">
//       <img src={image} alt={name} className="proposal-card__image" />
//       <div className="proposal-card__content">
//         <h3 className="proposal-card__name">{name}</h3>
//         <p className="proposal-card__title">{title}</p>
//         <p className="proposal-card__location">{location}</p>
//         <div className="proposal-card__details">
//           <span>{rate}</span>
//           <span>{earned}</span>
//         </div>
//         <div className="proposal-card__extra">
//           <span>{qualification}</span>
//           <span>{timeline}</span>
//         </div>
//         <p className="proposal-card__cover-letter">{coverLetter}</p>
//         <div className="proposal-card__actions">
//           <button className="proposal-card__message-btn">Message</button>
//           <button className="proposal-card__hire-btn">Hire</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalCard;





import React from "react";
import "./styles.scss"; // Import the SCSS file

import {
  CommonButton
} from "../../components/index";


import {
  Chat
} from "../../svg/index";

const ProposalCard = ({
  name,
  title,
  location,
  rate,
  earned,
  qualification,
  timeline,
  coverLetter,
  image,
}) => {
  return (
    <div className="proposal-card">
      <img src={image} alt={name} className="proposal-card__image" />
      <div className="proposal-card__content">
        <div className="proposal-card__header">
          <span className="proposal-card__name">{name}</span>
          <span className="proposal-card__status">Highly interested</span>
        </div>
        <p className="proposal-card__title">{title}</p>
        <p className="proposal-card__location">{location}</p>
        <div className="proposal-card__details">
          <span className="proposal-card__rate">{rate}</span>
          <span className="proposal-card__earned">{earned}</span>
        </div>
        <div className="proposal-card__extra">
          <span className="proposal-card__qualification-head">Qualification: </span>
          <span className="proposal-card__qualification"> {qualification}</span>
          <span className="proposal-card__timeline-head">Estimated timeline:</span>
          <span className="proposal-card__timeline"> {timeline}</span>
        </div>
        <div>
        <span className="proposal-card__cover-letter-head">Cover Letter</span>
        <p className="proposal-card__cover-letter">{coverLetter}</p>
        </div>
        <div className="proposal-card__actions">
          <CommonButton
            text={<Chat />}
            className="bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
          />
          <CommonButton
            text="Hire"
            className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
