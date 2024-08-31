import React, { useEffect, useState } from "react";
import { proxy, useSnapshot } from "valtio";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  JobsDropdwon,
  IconSearchBar,
  Notification,
  Logo,
} from "../../../svg/index";
import "./styles.scss";

const state = proxy({
  profile: {
    first_name: "",
    last_name: "",
    image: "",
  },
  dropdownOpen: false,
  selectedOption: "",
  hoveredOption: "",
});

const Header = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/freelancer/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        state.profile = response.data.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
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
  };

  const handleProfileOption = (option) => {
    setProfileDropdownOpen(false);
    if (option === "PROFILE") {
      navigate("/profile");
    } else if (option === "LOGOUT") {
      localStorage.removeItem("token");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      navigate("/signup");
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
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  
  const initials = firstName && lastName
    ? getInitials(firstName, lastName)
    : "";

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Logo width="100" height="40" />
        </div>
        <div className="dropdown-container">
          <h2 className="find-work">Find Work</h2>
          <div onClick={(e) => toggleDropdown(e, "jobs")} className="dropdown-toggle">
            <JobsDropdwon />
          </div>
          {snap.dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                {["Post a Job", "All Jobs Post", "Add Payment", "Privacy Policy"].map((option) => (
                  <li
                    key={option}
                    className={`dropdown-item ${snap.selectedOption === option ? "selected" : ""}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => state.hoveredOption = option}
                    onMouseLeave={() => state.hoveredOption = ""}
                    style={{
                      color: snap.hoveredOption === option ? "#4BCBEB" : "black",
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <h2 className="messages">Messages</h2>
      </div>
      <div className="header-bottom">
        <div className="search-bar">
          <IconSearchBar className="search-icon" width="20" height="20" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="icon"> <Notification className="icon" width="20" height="20" /></div>
       
        <div className="user-info">
          <div 
            className="profile-dropdown"
            onClick={(e) => toggleDropdown(e, "profile")}
          >
            <div className="profile-image-container">
              <div className="profile-initials-circle">
                {initials}
              </div>
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