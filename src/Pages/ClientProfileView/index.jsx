// src/components/ClientProfile/ClientProfile.jsx

import React from "react";
import "./styles.scss";
import { Header, Spinner, CommonButton } from "../../components";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdEmail, MdEdit } from 'react-icons/md';

const ClientProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    country: "",
    image: "",
    about: "",
    email: "",
    languages: [],
  });
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
 
  const navigate = useNavigate();




  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoading(true);
      
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
  //         throw new Error('No authentication token found');
  //       }
  
  //       const decodedToken = jwtDecode(token);
  //       const userId = decodedToken.userId;
  
  //       if (!userId) {
  //         throw new Error('No consultant ID found in token');
  //       }
  
  //       const response1 = await fetch(`http://localhost:5000/api/client/users/${userId}`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  
  //       const data1 = await response1.json();
  //       console.log("User data",data1);
  //       setEmail(data1.email);
        
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching profile:', err);
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchProfile();
  // }, []);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log(userId);

        const [profileResponse, jobPostsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/job-posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const clientProfile = profileResponse.data.data;

        const clientId = clientProfile.client_id;

        const allJobPosts = jobPostsResponse.data.jobPosts;

        const filteredJobPosts = allJobPosts.filter((job) => {
          if (
            job.client_id &&
            typeof job.client_id === "object" &&
            job.client_id._id
          ) {
            return String(job.client_id?._id) === String(clientId);
          }
        });

        setProfileData(clientProfile);
        setJobPosts(filteredJobPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatBudget = (project) => {
    if (project.budget_type === "hourly") {
      return `$${project.hourly_rate?.from || "Unknown"} - $${
        project.hourly_rate?.to || "Unknown"
      }/hour`;
    } else if (project.budget_type === "fixed") {
      return `$${project.fixed_price || "Unknown"}`;
    }
    return "Unknown";
  };

  if (loading) return <Spinner size={100} alignCenter />;
  if (error) return <div>Error: {error}</div>;
  

  return (
    <>
      <Header />
      <div className="client-profile">
        <div className="profile-header">
          <div className="profile-image">
            <img
              src={profileData.image || "https://via.placeholder.com/150"}
              alt="Client Profile"
            />
          </div>
          <div className="profile-info">
            <h1>{profileData.name}</h1>
            <p><MdLocationOn className="text-primary" />{profileData.country}</p>
            <p><MdEmail className="text-primary" />{profileData.email}</p>
          </div>

          <div className="flex items-center justify-between buttons">
            <CommonButton
              onClick={() => navigate(`/ClientProfileForm`)}
              text={<><MdEdit className="inline mr-2" />Edit</>}
              className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
            />
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
                  <h3>{project.job_title || "Unknown"}</h3>
                  <p>{project.description || "Unknown"}</p>
                  <p>
                    <strong>Budget:</strong> {formatBudget(project)}
                  </p>
                  <p>
                    <strong>Status:</strong> {project.status || "Unknown"}
                  </p>
                  {/* <p>
                    <strong>Hired Freelancer:</strong> {project.hiredFreelancer}
                  </p> */}
                </div>
              ))
            ) : (
              <p>No job posts found.</p>
            )
          ) : jobPosts ? (
            <div className="projects-posted">
              <h3>{jobPosts.job_title || "Unknown"}</h3>
              <p>{jobPosts.description || "Unknown"}</p>
              <p>
                <strong>Budget:</strong> {formatBudget(jobPosts)}
              </p>
              <p>
                <strong>Status:</strong> {jobPosts.status || "Unknown"}
              </p>
            </div>
          ) : (
            <p>No job post found.</p>
          )}
        </div>
{/* 
        <div className="reviews">
          <h2>Reviews from Freelancers</h2>
          {clientData.reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.freelancerName}</strong> rated {clientData.name}
                : {review.rating} / 5
              </p>
              <p>"{review.comment}"</p>
            </div>
          ))}
        </div> */}

        {/* <div className="hire-history">
          <h2>Hire History</h2>
          {clientData.hireHistory.map((history, index) => (
            <div key={index} className="history-item">
              <p>
                <strong>Project:</strong> {history.projectName}
              </p>
              <p>
                <strong>Freelancer:</strong> {history.freelancer}
              </p>
              <p>
                <strong>Amount Spent:</strong> {history.amountSpent}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default ClientProfile;
