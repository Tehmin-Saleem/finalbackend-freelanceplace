import React, { useEffect, useState } from "react";
import { Header } from "../../components";


import Illustration from "../../images/Illustration.png"; // Import the image here
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Fix import statement for jwtDecode
import "./styles.scss";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: "", email: "" });
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    totalCompletedJobs: 0,
    totalOngoingJobs: 0,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const checkClientProfile = async (userId, token) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/client/client-profile-exists/${userId}`, // Remove the extra ':id'
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Profile check response:", response.data); // Debug log
      return response.data.exists; // Make sure this matches your backend response
    } catch (error) {
      console.error("Error checking client profile:", error);
      return false;
    }
  };

const handleNavigation = (path) => {
    console.log("Current hasProfile state:", hasProfile); // Debug log
    if (!hasProfile) {
      setShowProfileModal(true);
    } else {
      navigate(path);
    }
  };

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

        // Check for profile when component mounts
        const profileExists = await checkClientProfile(userId, token);
        console.log("Profile exists:", profileExists); // Debug log
        setHasProfile(profileExists);

        // Fetch user details
        const userResponse = await axios.get(
          `http://localhost:5000/api/client/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userResponse.data);

        // Fetch combined counts
        const statsResponse = await axios.get(
          `http://localhost:5000/api/client/dashboard-stats/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDashboardStats(statsResponse.data.data);
        console.log("Dashboard Stats Response:", statsResponse.data);

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        navigate("/signin");
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
              <p>{dashboardStats.totalJobs}</p>
            </div>
            <div className="stat-item">
              <h3>Ongoing Jobs</h3>
              <p>{dashboardStats.totalOngoingJobs}</p>
            </div>
            <div className="stat-item">
              <h3>Completed Jobs</h3>
              <p>{dashboardStats.totalCompletedJobs}</p>
            </div>

            <div className="stat-item">
              <h3>Freelancers Engaged</h3>
              <p>{dashboardStats.totalOngoingJobs}</p>
            </div>






          </div>

          <div className="dashboard-summary">
            <p>
              This dashboard provides an overview of your current performance, job statistics, and upcoming
              opportunities. Stay informed and make data-driven decisions to ensure the success of your projects.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="card-container">
          <div className="card" onClick={() => handleNavigation("/jobPosting")}>
            <h2>Post a Job</h2>
            <p>Create new jobs for freelancers to view and apply.</p>
            <button>Post Job</button>
          </div>
          <div className="card" onClick={() => handleNavigation("/alljobs")}>
            <h2>Your Jobs</h2>
            <p>View the jobs you’ve posted and their status.</p>
            <button>View Jobs</button>
          </div>
          <div className="card" onClick={() => handleNavigation("/alljobs")}>
            <h2>View Proposals</h2>
            <p>View proposals on your jobs.</p>
            <button>View Proposals</button>
          </div>
          <div
            className="card"
            onClick={() => handleNavigation("/ManageProjectbyclient")}
          >
            <h2>Job Progress</h2>
            <p>Track progress of ongoing jobs and milestones.</p>
            <button>View Progress</button>
          </div>
          <div
            className="card"
            onClick={() => handleNavigation("/freelancercard")}
          >
            <h2>Freelancer Profiles</h2>
            <p>Explore profiles of freelancers you’ve worked with.</p>
            <button>View Freelancers</button>
          </div>
          <div
            className="card"
            onClick={() => handleNavigation("/ClientOfferPage")}
          >
            <h2>Consultants Offers</h2>
            <p>Check the conusltants that you have send the request.</p>
            <button>View Consultants </button>
          </div>
        </div>

        {/* Profile Modal */}
        {/* <Modal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          shouldCloseOnOverlayClick={false} // Add this prop if your Modal component supports it
        >
          <div className="profile-modal-content">
            <h2>Complete Your Profile</h2>
            <p>
              Please complete your profile before accessing this feature. A
              complete profile helps freelancers understand your business
              better.
            </p>
            <div className="modal-buttons">
              <button
                className="setup-profile-btn"
                onClick={() => {
                  setShowProfileModal(false);
                  navigate("/ClientProfileForm");
                }}
              >
                Complete Profile
              </button>
              <button
                className="modal-close"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal> */}

        {/* Contact Button */}
        <button
          className="contact-btn-fixed"
          onClick={() => navigate("/QueryForm", { state: user })}
        >
          <FaEnvelope className="contact-icon" />
          Contact Us
        </button>
      </div>
    </>
  );
};

export default ClientDashboard;
