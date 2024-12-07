import React, { useState } from 'react';
import './styles.scss';
import Header from '../Commoncomponents/Header';

const ClientOffersPage = () => {
  // Static data for demonstration
  const staticOffers = [
    {
      id: 1,
      consultantName: 'John Doe',
      projectName: 'Website Redesign',
      description: 'Redesign the homepage and user dashboard for better usability.',
      clientRating: 4.8,
      status: 'Pending',
    },
    {
      id: 2,
      consultantName: 'Jane Smith',
      projectName: 'E-commerce App',
      description: 'Develop a mobile-friendly e-commerce application.',
      clientRating: 4.5,
      status: 'Accepted',
    },
  ];

  const [offers, setOffers] = useState(staticOffers);

  return (
    <>
      <Header />
      <div className="client-offers-page">
        <div className="offers-container">
          {offers.map((offer) => (
            <div className="offer-card" key={offer.id}>
              <div className="card-header">
                <h3>{offer.projectName}</h3>
                <span className={`status ${offer.status.toLowerCase()}`}>{offer.status}</span>
              </div>
              <p><strong>Consultant:</strong> {offer.consultantName}</p>
              <p><strong>Description:</strong> {offer.description}</p>
              <p><strong>Client Rating:</strong> {offer.clientRating} / 5</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientOffersPage;
