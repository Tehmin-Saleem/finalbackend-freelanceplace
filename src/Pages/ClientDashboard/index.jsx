import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import Illustration from "../../images/Illustration.png"; // Import the image here
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import "./styles.scss";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: "", email: "" });
  const [quickStats, setQuickStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    CompletedJobs: 0,
    freelancersEngaged: 0,
  });
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [hiredFreelancersCount, setHiredFreelancersCount] = useState(0);
  const [engagedFreelancersCount, setEngagedFreelancersCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);

        const response = await axios.get(
          `http://localhost:5000/api/client/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
      
      const jobCountResponse = await axios.get(
        `http://localhost:5000/api/client/count-job-posts/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTotalJobsCount(jobCountResponse.data.totalJobPosts); 
    
console.log("Total Jobs Count Response:", jobCountResponse.data)
      
      const hiredFreelancersResponse = await axios.get(
        `http://localhost:5000/api/client/hired-freelancers-count/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHiredFreelancersCount(hiredFreelancersResponse.data.hiredFreelancersCount);

      const EngagedFreelancersResponse = await axios.get(
        `http://localhost:5000/api/client/freelancers-engaged-count/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEngagedFreelancersCount(EngagedFreelancersResponse.data.engagedFreelancersCount);
      
      // Update the total jobs count
    } catch (error) {
      // navigate("/ClientDashbaord");
    }
  };

    fetchUser();
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="DashBoard">
        <header className="dashboard-Header">
          <h1>Welcome, {user.first_name || "User"}!</h1>
          <p>Manage projects, track progress, and explore freelancer profiles, all in one place.</p>
        </header>
        
        {/* Quick Stats and Dashboard Summary */}
        <div className="quick-stats-summary">
          <div className="quick-stats">
            <div className="stat-item">
              <h3>Total Jobs</h3>
              <p>{totalJobsCount}</p>
            </div>
            <div className="stat-item">
              <h3>Active Jobs</h3>
              <p>{hiredFreelancersCount}</p>
            </div>
            <div className="stat-item">
              <h3>Completed Jobs</h3>
              <p>{quickStats.CompletedJobs}</p>
            </div>
            <div className="stat-item">
              <h3>Freelancers Engaged</h3>
              <p>{hiredFreelancersCount}</p>
            </div>
          </div>

          <div className="dashboard-summary">
            {/* <h2>Dashboard Summary</h2> */}
            <p>This dashboard provides an overview of your current performance,
               job statistics, and upcoming opportunities. Stay informed and
               make data-driven decisions to ensure the success of your projects.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="card-container">
          <div className="card" onClick={() => navigate('/jobPosting')}>
            <h2>Post a Job</h2>
            <p>Create new jobs for freelancers to view and apply.</p>
            <button>Post Job</button>
          </div>
          <div className="card" onClick={() => navigate('/alljobs')}>
            <h2>Your Jobs</h2>
            <p>View the jobs you’ve posted and their status.</p>
            <button>View Jobs</button>
          </div>
          <div className="card" onClick={() => navigate('/alljobs')}>
            <h2>View Proposals</h2>
            <p>View proposals on your jobs.</p>
            <button>View Proposals</button>
          </div>
          <div className="card" onClick={() => navigate('/ManageProjectbyclient')}>
            <h2>Job Progress</h2>
            <p>Track progress of ongoing jobs and milestones.</p>
            <button>View Progress</button>
          </div>
          <div className="card" onClick={() => navigate('/freelancercard')}>
            <h2>Freelancer Profiles</h2>
            <p>Explore profiles of freelancers you’ve worked with.</p>
            <button>View Freelancers</button>
          </div>
          <div className="card" onClick={() => navigate('/ClientOfferPage')}>
            <h2>Consultants Offers</h2>
            <p>Check the conusltants that you have send the request.</p>
            <button>View Consultants </button>
          </div>
        </div>

        {/* Contact Button */}
        <button className="contact-btn-fixed" onClick={() => navigate('/QueryForm', { state: user })}>
          <FaEnvelope className="contact-icon" />
          Contact Us
        </button>
      </div>
    </>
  );
};

export default ClientDashboard;
