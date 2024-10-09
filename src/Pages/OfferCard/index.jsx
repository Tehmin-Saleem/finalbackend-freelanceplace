// OfferDetails.js
import React from "react";
import "./styles.scss"; // Import SCSS for styling
import { Header } from "../../components";

const OfferDetails = () => {
  // Static data for the freelancer (to be fetched from the offer form in a real application)
  const freelancer = {
    profilePic: "https://picsum.photos/200/300", // Replace with actual image path
    name: "John Doe",
    location: "Lahore, Pakistan",
    roles: ["Web Developer", "React Specialist"],
    rate: "$50/hr",
    successRate: "95%",
    totalProjects: "30",
    earnings: "$5000",
    skills: [
      "JavaScript",
      "React",
      "CSS",
      "HTML5",
      "Node.js",
      "Express",
      "MongoDB",
      "Redux",
      "SASS",
      "REST API",
      "GraphQL",
    ],
    description: [
      "An experienced web developer with over 5 years of experience specializing in React and JavaScript Proficient in building dynamic web applications using modern frameworks and libraries. Strong background in full-stack development, with hands-on expertise in Node.js and MongoDB for building scalable backend solutions",
    ],
    attachments: ["Attachment1.pdf", "Attachment2.docx"], // Sample attachments
    ratings: "4.8/5",
  };

  const handleAcceptOffer = () => {
    // Logic to handle the offer acceptance
    console.log("Offer accepted!");
  };

  return (
    <>
      <Header />
      <div className="offer-details-card">
        <div className="freelancer-header">
          <div className="freelancer-profile">
            <img
              src={freelancer.profilePic}
              alt="Profile"
              className="profile-pic"
            />
          </div>
          <div className="freelancer-info">
            <h2 className="freelancer-name">{freelancer.name}</h2>
            <span className="freelancer-location">{freelancer.location}</span>
            <div className="freelancer-role">{freelancer.roles.join(", ")}</div>
            <div className="freelancer-meta">
              <span className="freelancer-rate">Rate: {freelancer.rate}</span>
              <span className="freelancer-success">
                Success Rate: {freelancer.successRate}
              </span>
              <span className="freelancer-earnings">
                Earnings: {freelancer.earnings}
              </span>
              <span className="freelancer-ratings">
                Ratings: {freelancer.ratings}
              </span>
              <span className="freelancer-projects">
                Total Projects: {freelancer.totalProjects}
              </span>
            </div>
          </div>
        </div>
        <div className="freelancer-skills">
          <h3>Skills</h3>
          <div className="skill-badges">
            {freelancer.skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="freelancer-description">
          <h3>Description</h3>
          <p>{freelancer.description}</p>
        </div>
        <div className="freelancer-attachments">
          <h3>Attachments</h3>
          <ul>
            {freelancer.attachments.map((attachment, index) => (
              <li key={index} className="attachment-item">
                {attachment}
              </li>
            ))}
          </ul>
        </div>
        <div className="button-container">
        <button className="accept-btn" onClick={handleAcceptOffer}>
          Accept Offer
        </button>
        </div>
      </div>
    </>
  );
};

export default OfferDetails;
