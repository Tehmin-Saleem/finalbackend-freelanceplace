import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.scss';
import { Header } from '../../components';

const OfferCards = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');

  // Function to get freelancer ID from the JWT token stored in localStorage
  const getFreelancerIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    }
    return null;
  };

  // Fetching offers when the component mounts
  useEffect(() => {
    const fetchOffers = async () => {
      const freelancerId = getFreelancerIdFromToken();
      if (!freelancerId) {
        setError('Freelancer ID not found.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/freelancer/offer/${freelancerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setOffers(response.data);
      } catch (err) {
        setError('Failed to fetch offers.');
      }
    };

    fetchOffers();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <>
      <Header />
      <div className="offer-cards-container">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          offers.map((offer) => (
            <div className="offer-card" key={offer._id}>
              <button className="top-right-btn">Accept Offer</button>
              <h3 className="offer-card__title">{offer.job_title}</h3>
              <p className="offer-card__description"><span className="label">Description:</span> {offer.description}</p>
              <p className="offer-card__detailed-description"><span className="label">Detailed Description:</span> {offer.detailed_description}</p>
              
              <div className="offer-card__info-section">
                <div className="offer-card__info-item">
                  <span className="label">Budget Type:</span>
                  <span className="offer-card__info-value">{offer.budget_type}</span>
                </div>
                <div className="offer-card__info-item">
                  <span className="label">Rate:</span>
                  <span className="offer-card__info-value">
                    {offer.budget_type === 'fixed' 
                      ? `$${offer.fixed_price}` 
                      : `$${offer.hourly_rate?.from} - $${offer.hourly_rate?.to} /hr`}
                  </span>
                </div>
              </div>
              
              <div className="offer-card__skills">
                <strong><span className="label">Skills Required:</span></strong>
                <div className="offer-card__skills-list">
                  {offer.preferred_skills.map((skill, index) => (
                    <span key={index} className="offer-card__skill-item">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OfferCards;
