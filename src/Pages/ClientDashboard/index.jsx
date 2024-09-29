import React, { useEffect, useState } from "react";
import { Header } from "../../components/index"; // Adjust the import path as needed
import Illustration from "../../images/Illustration.png"; // Adjust the image path as needed
import { BackgroundLining, JobsDropdwon } from "../../svg/index";
import "./styles.scss";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const DashboardPage = () => {
  const [user, setUser] = useState({ first_name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          navigate('/signin');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://localhost:5000/api/client/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate('/signin');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleJobPostingButtonClick = () => {
    navigate('/JobPosting');
  };

  return (
    <div className="dashboard-page">
      <Header />

      <div className="filter-options">
        <div className="filter-item">
          <span className="filter-label">Skills</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Categories</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Availability</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Location</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
        <div className="filter-item">
          <span className="filter-label">Ratings</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
        </div>
      </div>

      <main className="main-content">
        <div className="left-section">
          <div className="left-content">
            <h1 className="welcome-text">
              Welcome, {user.first_name}!
              <br />
              Let's start with
              <br />
              your first job post.
            </h1>
            <p className="description-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="start-button" onClick={handleJobPostingButtonClick}>
              Get started with job posting
            </button>
          </div>
          <BackgroundLining className="background-lining" />
        </div>

        <div className="right-section">
          <img src={Illustration} alt="Placeholder" className="illustration" />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;