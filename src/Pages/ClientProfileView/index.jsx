// src/components/ClientProfile/ClientProfile.jsx

import React from 'react';
import './styles.scss';
import { Header, Spinner } from '../../components';
import axios from 'axios';
import  { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const ClientProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    country: '',
    image: '',
    about: '',
    email: '',
    languages: []
  });
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log(userId)
  
        const [profileResponse, jobPostsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/client/profile", {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/client/job-posts", {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
  
        const clientProfile = profileResponse.data.data;
     
  
        const clientId = clientProfile.client_id; 
       
  
        const allJobPosts = jobPostsResponse.data.jobPosts;
       
      
       
  
        
        const filteredJobPosts = allJobPosts.filter((job) => {
         
  
         
          if (job.client_id && typeof job.client_id === 'object' && job.client_id._id) {
            return String(job.client_id?._id) === String(clientId);
          }
  
        
        });
  
      
        setProfileData(clientProfile);
        setJobPosts(filteredJobPosts); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  



  const formatBudget = (project) => {
    if (project.budget_type === 'hourly') {
      return `$${project.hourly_rate?.from || 'Unknown'} - $${project.hourly_rate?.to || 'Unknown'}/hour`;
    } else if (project.budget_type === 'fixed') {
      return `$${project.fixed_price || 'Unknown'}`;
    }
    return 'Unknown';
  };

  if (loading) return <Spinner size={100} alignCenter />;
  if (error) return <div>Error: {error}</div>;
  const clientData = {
    profilePicture: 'https://via.placeholder.com/150', 
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
 
  };

  return (
    <>
      <Header/>
      <div className="client-profile">
        <div className="profile-header">
          <div className="profile-image">
            <img src={profileData.image || 'https://via.placeholder.com/150'} alt="Client Profile" />
          </div>
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p>{profileData.country}</p>
            <p>Email: {profileData.email}</p>
          </div>
        </div>

        <div className="about-section">
          <h2>About {profileData.name}</h2>
          <p>{profileData.about}</p>
        </div>

      

      
      <div className="projects-posted">
  <h2>Projects Posted</h2>

  {Array.isArray(jobPosts) ? (
    jobPosts.length > 0 ? (
      jobPosts.map((project, index) => (
        <div key={index} className="project">
          <h3>{project.job_title || 'Unknown'}</h3>
          <p>{project.description || 'Unknown'}</p>
          <p><strong>Budget:</strong> {formatBudget(project)}</p>
          <p><strong>Status:</strong> {project.status || 'Unknown'}</p>
          <p><strong>Hired Freelancer:</strong> {project.hiredFreelancer}</p>
        </div>
      ))
    ) : (
      <p>No job posts found.</p>
    )
  ) : (
   
    jobPosts ? (
      <div className="projects-posted">
        <h3>{jobPosts.job_title || 'Unknown'}</h3>
        <p>{jobPosts.description || 'Unknown'}</p>
        <p><strong>Budget:</strong> {formatBudget(jobPosts)}</p>
        <p><strong>Status:</strong> {jobPosts.status || 'Unknown'}</p>
      </div>
    ) : (
      <p>No job post found.</p>
    )
  )}
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

     
    </div>
    </>
  );
};

export default ClientProfile;
