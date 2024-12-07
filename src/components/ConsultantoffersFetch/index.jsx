import React from "react";
import "./styles.scss";
import Header from "../Commoncomponents/Header";

const ConsultantOffers = () => {
  // Static offers data
  const offers = [
    {
      id: 1,
      clientName: "Tech Solutions",
      projectName: "Website Redesign",
      clientRating: "4.8",
      deadline: "Dec 15, 2024",
      budget: "$5,000",
      status: "Pending",
    },
    {
      id: 2,
      clientName: "Healthify",
      projectName: "Mobile App Development",
      clientRating: "4.5",
      deadline: "Jan 10, 2025",
      budget: "$10,000",
      status: "Pending",
    },
    {
      id: 3,
      clientName: "EduPro",
      projectName: "E-learning Platform",
      clientRating: "4.9",
      deadline: "Feb 5, 2025",
      budget: "$8,000",
      status: "Pending",
    },
  ];

  return (
    <>
    <Header/>
    <div className="consultant-offers-page">
      <h1>Offers</h1>
      <div className="offers-container">
        {offers.map((offer) => (
          <div className="offer-card" key={offer.id}>
            <div className="card-header">
              <h3>{offer.projectName}</h3>
              <span className="status pending">{offer.status}</span>
            </div>
            <p>
              <strong>Client:</strong> {offer.clientName}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {offer.clientRating}
            </p>
            <p>
              <strong>Deadline:</strong> {offer.deadline}
            </p>
            <p>
              <strong>Budget:</strong> {offer.budget}
            </p>
            <button className="accept-button">Accept Offer</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ConsultantOffers;
