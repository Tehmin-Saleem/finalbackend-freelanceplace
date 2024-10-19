// src/components/ClientProfile/ClientProfile.jsx

import React from 'react';
import './styles.scss';
import { Header } from '../../components';

const ClientProfile = () => {
  const clientData = {
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image
    name: 'Acme Corp',
    location: 'New York, USA',
    Email: 'zahrasamar88@gmail.com',
    aboutMe: 'Acme Corp is a leading company specializing in innovative solutions for e-commerce platforms. We have been collaborating with top freelancers around the globe to build world-class software solutions.',
    projectsPosted: [
      {
        projectName: 'E-commerce Website Redesign',
        description: 'We need a complete redesign of our e-commerce website to improve user experience and increase conversion rates.',
        budget: '$10,000',
        status: 'Completed',
        hiredFreelancer: 'John Doe'
      },
      {
        projectName: 'Mobile App Development',
        description: 'Develop a cross-platform mobile application for our e-commerce platform.',
        budget: '$15,000',
        status: 'Ongoing',
        hiredFreelancer: 'Jane Smith'
      }
    ],
    reviews: [
      {
        freelancerName: 'John Doe',
        rating: 5,
        comment: 'Great to work with! Clear requirements and prompt payments.'
      },
      {
        freelancerName: 'Jane Smith',
        rating: 4.5,
        comment: 'Good communication and easy to collaborate with. Would love to work with them again.'
      }
    ],
    hireHistory: [
      {
        projectName: 'E-commerce Website Redesign',
        freelancer: 'John Doe',
        amountSpent: '$10,000'
      },
      {
        projectName: 'Mobile App Development',
        freelancer: 'Jane Smith',
        amountSpent: '$7,500 (Ongoing)'
      }
    ],
    preferredQualifications: {
      skills: ['React.js', 'Node.js', 'UI/UX Design'],
      languages: ['English', 'Spanish'],
      locationPreference: 'North America'
    }
  };

  return (
    <>
    <Header/>
    <div className="client-profile">
      <div className="profile-header">
        <div className="profile-image">
          <img src={clientData.profilePicture} alt="Client Profile" />
        </div>
        <div className="profile-info">
          <h1>{clientData.name}</h1>
          <p>{clientData.location}</p>
          <p>Email: {clientData.Email}</p>
        </div>
      </div>

      <div className="about-section">
        <h2>About {clientData.name}</h2>
        <p>{clientData.aboutMe}</p>
      </div>

      <div className="projects-posted">
        <h2>Projects Posted</h2>
        {clientData.projectsPosted.map((project, index) => (
          <div key={index} className="project">
            <h3>{project.projectName}</h3>
            <p>{project.description}</p>
            <p><strong>Budget:</strong> {project.budget}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Hired Freelancer:</strong> {project.hiredFreelancer}</p>
          </div>
        ))}
      </div>

      <div className="reviews">
        <h2>Reviews from Freelancers</h2>
        {clientData.reviews.map((review, index) => (
          <div key={index} className="review">
            <p><strong>{review.freelancerName}</strong> rated {clientData.name}: {review.rating} / 5</p>
            <p>"{review.comment}"</p>
          </div>
        ))}
      </div>

      <div className="hire-history">
        <h2>Hire History</h2>
        {clientData.hireHistory.map((history, index) => (
          <div key={index} className="history-item">
            <p><strong>Project:</strong> {history.projectName}</p>
            <p><strong>Freelancer:</strong> {history.freelancer}</p>
            <p><strong>Amount Spent:</strong> {history.amountSpent}</p>
          </div>
        ))}
      </div>

      <div className="preferred-qualifications">
        <h2>Preferred Freelancer Qualifications</h2>
        <p><strong>Skills:</strong> {clientData.preferredQualifications.skills.join(', ')}</p>
        <p><strong>Languages:</strong> {clientData.preferredQualifications.languages.join(', ')}</p>
        <p><strong>Location Preference:</strong> {clientData.preferredQualifications.locationPreference}</p>
      </div>
    </div>
    </>
  );
};

export default ClientProfile;
