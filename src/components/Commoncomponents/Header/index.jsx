import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Corrected import
import { NotificationContext } from "../../../Pages/Notifications/NotificationContext";
import {
  JobsDropdwon,
  IconSearchBar,
  Notification,
  Logo,
} from "../../../svg/index";
import "./styles.scss";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    country_name: "",
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { unreadCount } = useContext(NotificationContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

        if (response.data && response.data.role) {
          setUser(response.data);
        } else {
          console.error("Incomplete user data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchUnreadNotificationsCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/freelancer/notifications/unread-count",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUnreadNotifications(response.data.count);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };

    fetchUser();
    fetchUnreadNotificationsCount();

    const interval = setInterval(fetchUnreadNotificationsCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogoClick = () => {
    console.log("handleLogoClick triggered");
  
    if (!user.role) {
      console.error("User role is not defined. Redirecting to sign-in.");
      navigate("/signin");
      return;
    }
  
    console.log(`Current role: ${user.role}`);
  
    switch (user.role) {
      case "client":
        console.log("Navigating to ClientDashboard...");
        navigate("/ClientDashboard");
        break;
      case "freelancer":
        console.log("Navigating to FreelanceDashBoard...");
        navigate("/FreelanceDashBoard");
        break;
      default:
        console.warn("Unexpected user role. Redirecting to sign-in.");
        navigate("/signin");
        break;
    }
  };


  const toggleDropdown = (e, dropdownType) => {
    e.stopPropagation();
    if (dropdownType === "jobs") {
      setDropdownOpen(!dropdownOpen);
      setProfileDropdownOpen(false);
    } else if (dropdownType === "profile") {
      setProfileDropdownOpen(!profileDropdownOpen);
      setDropdownOpen(false);
    }
  };

  const handleSelect = (option) => {
    setDropdownOpen(false);

    const routes = {
      "Explore Jobs": "/matchingjobs",
      "Post a Job": "/jobPosting",
      "Explore Freelancers": "/freelancercard",
      "All Jobs Post": "/alljobs",
      "Add Payment": "/payment",
    };

    if (routes[option]) navigate(routes[option]);
  };

  const handleProfileOption = async (option) => {
    setProfileDropdownOpen(false);

    if (option === "PROFILE") {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        if (user.role === "client") {
          const response = await axios.get(
            `http://localhost:5000/api/client/client-profile-exists/${user.id}`,
            config
          );
          navigate(response.data.exists ? "/ClientProfile" : "/ClientProfileForm");
        } else if (user.role === "freelancer") {
          const response = await axios.get(
            `http://localhost:5000/api/freelancer/freelancer-profile-exists/${user.id}`,
            config
          );
          navigate(response.data.exists ? `/profile/${user.id}` : "/myProfile");
        }
      } catch (error) {
        console.error("Error checking profile existence:", error);
      }
    } else if (option === "LOGOUT") {
      localStorage.clear();
      navigate("/signin");
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const initials = getInitials(user.first_name, user.last_name);

  const dropdownOptions =
    user.role === "client"
      ? ["Post a Job", "Explore Freelancers", "Add Payment", "All Jobs Post", "Privacy Policy"]
      : ["Explore Jobs", "Add Payment", "Privacy Policy"];

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Logo width="100" height="40" onClick={handleLogoClick} />
        </div>
        <div className="dropdown-container">
          <h2 className="find-work">
            {user.role === "client" ? "Find Talent" : "Find Work"}
          </h2>
          <div onClick={(e) => toggleDropdown(e, "jobs")} className="dropdown-toggle">
            <JobsDropdwon />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                {dropdownOptions.map((option) => (
                  <li
                    key={option}
                    className={`dropdown-item`}
                    onClick={() => handleSelect(option)}
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
                    <li key={option} onClick={() => handleProfileOption(option)}>
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
