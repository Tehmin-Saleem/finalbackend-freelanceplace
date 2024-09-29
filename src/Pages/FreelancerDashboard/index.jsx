import React, { useEffect, useState } from "react";
import { Header, ZoomedImage } from "../../components/index"; // Adjust the import path as needed
import { BackgroundLining } from "../../svg/index";
import "./styles.scss";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const FreelanceDashboardPage = () => {
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
    navigate('/myProfile'); 
  };

  return (
    <div className="dashboard-page">
      <Header />
      <main className="main-content">
        <div className="left-section">
          <div className="left-content">
            <h1 className="welcome-text">
              Hello, {user.first_name}!
              <br />
              Let's begin by finding
              <br />
              work that matches
              <br/>
              your skills.
            </h1>
            <p className="description-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="start-button" onClick={handleJobPostingButtonClick}>
              Complete Your profile to get hired
            </button>
          </div>
          <BackgroundLining className="background-lining" />
        </div>
        <div className="right-section">
          <ZoomedImage alt="Placeholder" className="illustration" />
        </div>
      </main>
    </div>
  );
};

export default FreelanceDashboardPage;