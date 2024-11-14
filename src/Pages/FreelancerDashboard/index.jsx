import React, { useEffect, useState } from "react";
import { Header, ZoomedImage } from "../../components";
import { BackgroundLining } from "../../svg";
import { FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import "./styles.scss";

const FreelanceDashboardPage = () => {
  const [user, setUser] = useState({ first_name: '', email: '' });
  const [quickStats, setQuickStats] = useState({
    totalJobsApplied: 0,
    ongoingJobs: 0,
    completedJobs: 0,
    clientRatings: 0,
  });
  const navigate = useNavigate();


  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFreelancerReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const freelancerId = decodedToken.userId;

      console.log("Token:", token);

      console.log("freelancerid", freelancerId);
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/freelancer/${freelancerId}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response review", response.data.data.average_rating);
      setReviews(response.data.data.average_rating);

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerReviews();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
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

        const statsResponse = await axios.get(`http://localhost:5000/api/freelancer/proposals/count/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setQuickStats(prevStats => ({
          ...prevStats,
          totalJobsApplied: statsResponse.data.totalProposals
        }));
        const responses = await axios.get(`http://localhost:5000/api/freelancer/hired-jobs/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setQuickStats(prevStats => ({
          ...prevStats,
          ongoingJobs: responses.data.count
        }));

        const completedresponses = await axios.get(`http://localhost:5000/api/freelancer/completed-jobs/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("completed " , completedresponses.data.data.totalCompletedJobs)
        setQuickStats(prevStats => ({
          ...prevStats,
          completedJobs: completedresponses.data.data.totalCompletedJobs
        }));

        const ongoingJobsResponse = await axios.get(`http://localhost:5000/api/freelancer/hired-jobs/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("dattaatattatatata",ongoingJobsResponse.data.count);
        setQuickStats(prevStats => ({
          ...prevStats,
          ongoingJobs: ongoingJobsResponse.data.count
        }));





        // // Fetch stats
        // const statsResponse = await axios.get(`http://localhost:5000/api/freelancer/proposals/count/${userId}`, {
        //   headers: { 'Authorization': `Bearer ${token}` }
        // });
        // setQuickStats(statsResponse.data);
        
      } catch (error) {
        // navigate('/signin');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleJobSearchButtonClick = () => {
    navigate('/matchingjobs');
  };

  const handleProfileButtonClick = () => {
    navigate('/profile/:userId');
  };

  const openQueryForm = () => {
    navigate('/QueryForm', { state: user });
  };

  return (
    <div className="dashboard-page">
      <Header />
      <div className="background-section">
        <h1>Welcome, {user.first_name}!</h1>
        <p>Manage projects, track progress, and explore freelancer profiles, all in one place.</p>
      </div>



            {/* <button className="start-button" onClick={handleJobSearchButtonClick}>
              Explore Jobs
            </button>
          </div>
          <BackgroundLining className="background-lining" />
        </div>

        <div className="right-section">
          <ZoomedImage alt="Placeholder" className="illustration" />
        </div>
      </main> */}

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <h3>Total Jobs Applied</h3>
          <p>{quickStats.totalJobsApplied}</p>
        </div>
        <div className="stat-item">
          <h3>Ongoing Jobs</h3>
          <p>{quickStats.ongoingJobs}</p>
        </div>
        <div className="stat-item">
          <h3>Completed Jobs</h3>
          <p>{quickStats.completedJobs}</p>
        </div>
        <div className="stat-item">
          <h3>Client Ratings</h3>
          <p>{reviews}</p>
        </div>
      </div>

      <div className="summary-section">
        <p>
          This dashboard provides an overview of your current performance, job statistics, and upcoming opportunities.
          Stay informed and make data-driven decisions to ensure the success of your projects.
        </p>
      </div>

      {/* Cards for functionality */}
      <div className="card-container">
        <div className="card" onClick={() => navigate('/matchingjobs')}>
          <h2>Browse Jobs</h2>
          <p>Explore available opportunities that match your skills.</p>
          <button>Browse Jobs</button>
        </div>
        <div className="card" onClick={() => navigate('/freelancerOffers')}>
          <h2>offers</h2>
          <p>View and manage the offers.</p>
          <button>View offers</button>
        </div>
        <div className="card" onClick={() => navigate('/profile/:userId')}>
          <h2>Profile Settings</h2>
          <p>Update your profile and portfolio to attract clients.</p>
          <button>Update Profile</button>
        </div>
        <div className="card" onClick={() => navigate('/freelancersjobpage')}>
          <h2>Job History</h2>
          <p>Review your past jobs and client feedback.</p>
          <button>View History</button>
        </div>
      </div>

      {/* Contact Button */}
      <button className="contact-btn-fixed" onClick={openQueryForm}>
        <FaEnvelope className="contact-icon" />
        Contact Us
      </button>
    </div>
  );
};

export default FreelanceDashboardPage;
