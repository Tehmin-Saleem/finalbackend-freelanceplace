import React, { useEffect, useState, useContext } from "react";
import { proxy, useSnapshot } from "valtio";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { NotificationContext } from '../../../Pages/Notifications/NotificationContext';
import {
  JobsDropdwon,
  IconSearchBar,
  Notification,
  Logo,
} from "../../../svg/index";
import "./styles.scss";
//  import jwtDecode from 'jwt-decode'; // Use the default import

const state = proxy({
  user: {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    country_name: "",
  },
  dropdownOpen: false,
  selectedOption: "",
  hoveredOption: "",
});

const Header = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { unreadCount } = useContext(NotificationContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(
          `http://localhost:5000/api/client/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        state.user = response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      const fetchUnreadNotificationsCount = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
  
          const response = await axios.get(
            'http://localhost:5000/api/freelancer/notifications/unread-count',
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setUnreadNotifications(response.data.count);
        } catch (error) {
          console.error("Error fetching unread notifications count:", error);
        }
      };
  
      fetchUnreadNotificationsCount();
      // Set up an interval to fetch the count periodically
      const interval = setInterval(fetchUnreadNotificationsCount, 60000); // every minute
  
      return () => clearInterval(interval);
    
  
    };

    fetchUser();
  }, []);

  const toggleDropdown = (e, dropdownType) => {
    e.stopPropagation();
    if (dropdownType === "jobs") {
      state.dropdownOpen = !state.dropdownOpen;
      setProfileDropdownOpen(false);
    } else if (dropdownType === "profile") {
      setProfileDropdownOpen(!profileDropdownOpen);
      state.dropdownOpen = false;
    }
  };

  const handleSelect = (option) => {
    state.selectedOption = option;
    state.dropdownOpen = false;
  
    if (option === "Explore Jobs") {
      navigate("/matchingjobs");
    } else if (option === "Post a Job") {
      navigate("/jobPosting");
    } 
    else if (option === "Explore Freelancers") {
      navigate("/FreelanceCard");  
    }else if (option === "All Jobs Post") {
      navigate("/alljobs");
    } else if (option === "Add Payment") {
      navigate("/payment");
    }
  };
  

  const handleLogoClick = () => {
    if (snap.user.role === "client") {
      navigate("/ClientDashboard");
    } else if (snap.user.role === "freelancer") {
      navigate("/FreelanceDashBoard");
    } else {
      navigate("/signin");
    }
  };
  const token = localStorage.getItem("token");
  
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const handleProfileOption = (option) => {
    setProfileDropdownOpen(false);
    if (option === "PROFILE") {
      navigate(`/profile/${userId}`);
    } else if (option === "LOGOUT") {
      localStorage.clear();
      navigate("/signin");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      state.dropdownOpen = false;
      setProfileDropdownOpen(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const initials = getInitials(snap.user.first_name, snap.user.last_name);

  const dropdownOptions =
    snap.user.role === "client"
      ? [
          "Post a Job",
          "Explore Freelancers",
          "Add Payment",
          "All Jobs Post",
          "Privacy Policy"
          
        ]
      : ["Explore Jobs", "Add Payment", "Privacy Policy"];

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Logo width="100" height="40" onClick={handleLogoClick} />
        </div>
        <div className="dropdown-container">
          <h2 className="find-work">
            {snap.user.role === "client" ? "Find Talent" : "Find Work"}
          </h2>
          <div
            onClick={(e) => toggleDropdown(e, "jobs")}
            className="dropdown-toggle"
          >
            <JobsDropdwon />
          </div>
          {snap.dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                {dropdownOptions.map((option) => (
                  <li
                    key={option}
                    className={`dropdown-item ${
                      snap.selectedOption === option ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => (state.hoveredOption = option)}
                    onMouseLeave={() => (state.hoveredOption = "")}
                    style={{
                      color:
                        snap.hoveredOption === option ? "#4BCBEB" : "black",
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Link to="/chat">
          <h2 className="messages">Messages</h2>
        </Link>
      </div>
      <div className="header-bottom">
        <div className="search-bar">
          <IconSearchBar className="search-icon" width="20" height="20" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="icon">
                    <Link to="/notifications">
                        <div className="notification-icon-container">
                            <Notification className="icon" width="20" height="20" />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </div>
                    </Link>
                </div>
        <div className="user-info">
          <div
            className="profile-dropdown"
            onClick={(e) => toggleDropdown(e, "profile")}
          >
            <div className="profile-image-container">
              <div className="profile-initials-circle">{initials}</div>
            </div>
            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <ul>
                  {["PROFILE", "LOGOUT"].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleProfileOption(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
