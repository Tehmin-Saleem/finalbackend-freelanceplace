import React from "react";
import PropTypes from "prop-types";
import "./style.scss";
import { SuccessSvg } from "../../svg/index";

const Card = ({ freelancer }) => {
  console.log('Freelancer Data:', freelancer); // Add this line to debug

  if (!freelancer) {
    return <div>Error: Freelancer data is missing.</div>;
  }

  const { picture, name, location, field, rate, successRate, amountEarned, skills, description } = freelancer;

  return (
    <div className="card">
      <div className="cardContent">
        <div className="imageWrapper">
          {/* <img src={picture} alt="Freelancer" className="image" /> */}
        </div>
        <div className="details">
          <div className="header">
            <div className="profile">
              <img
                src={picture}
                alt="Freelancer"
                className="profileImage"
              />
              <div>
                <div className="flex">
                  <h4 className="name">{name}</h4>
                  <p className="locationField">
                    {location}
                    {/* | {field} */}
                  </p>
                </div>
                <p className="FreelancerField">{field.join(", ")}</p>
                <p className="skills"></p>
              </div>
            </div>
            <button className="inviteButton">Invite a Job</button>
          </div>
          <div className="rateSuccessEarned">
            <span className="rate">${rate}/hr</span>
            <SuccessSvg className="svg" />
            <span className="success">{successRate}% Success</span>
            <span className="earned">${amountEarned} earned</span>
          </div>
          <div className="skillTags">
            {skills.map((skill) => (
              <span key={skill} className="skillTag">
                {skill}
              </span>
            ))}
          </div>
          <p className="description">{description}</p>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  freelancer: PropTypes.shape({
    picture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    field: PropTypes.arrayOf(PropTypes.string).isRequired,
    rate: PropTypes.number.isRequired,
    successRate: PropTypes.number.isRequired,
    amountEarned: PropTypes.number.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
  }),
};

export default Card;
