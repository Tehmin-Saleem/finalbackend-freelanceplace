import React from "react";
import "./styles.scss";
import { CommonButton } from "../../components/index";
import { Chat } from "../../svg/index";
import { useNavigate } from "react-router-dom";
const ProposalCard = ({
  id,
  name,
  title,
  location,
  rate,
  earned,
  timeline,
  coverLetter,
  image,
  jobTitle,
  status
}) => {
  const navigate = useNavigate();

  const handleHireClick = (e) => {
    e.stopPropagation(); // Prevent any other click events
    navigate("/offerform"); // Navigate to the offer form page
  };

  const handleChatClick = () => {
    const freelancerData = {
      id,
      name,
      jobTitle,
      image,
    };
    localStorage.setItem("freelancerData", JSON.stringify(freelancerData));
    navigate("/chat");  // Navigate to chat page
  };

  return (
    <div className="proposal-card">
      <img src={image} alt={`${name}'s profile`} className="proposal-card__image" />
      <div className="proposal-card__content">
        <div className="proposal-card__header">
          <span className="proposal-card__name">{name}</span>
          <span className="proposal-card__status">{status}</span>
        </div>
        <p className="proposal-card__title">{title}</p>
        <p className="proposal-card__location">{location}</p>
        <div className="proposal-card__details">
          <span className="proposal-card__rate">{rate}</span>
          <span className="proposal-card__earned">{earned}</span>
        </div>
        <div className="proposal-card__extra">
          {/* <span className="proposal-card__qualification-head">Qualification: </span> */}
          {/* <span className="proposal-card__qualification">{qualification}</span> */}
          <span className="proposal-card__timeline-head">Estimated timeline:</span>
          <span className="proposal-card__timeline">{timeline}</span>
        </div>
        <div>
          <span className="proposal-card__job-title-head">Job Title: </span>
          <span className="proposal-card__job-title">{jobTitle}</span>
        </div>
        <div>
          <span className="proposal-card__cover-letter-head">Cover Letter</span>
          <p className="proposal-card__cover-letter">{coverLetter}</p>
        </div>
        <div className="proposal-card__actions">
          <CommonButton
            text={<Chat />}
            className="bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
            onClick={handleChatClick}  // Add click handler
         />
        <CommonButton
            text="Hire"
            className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
            onClick={handleHireClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;