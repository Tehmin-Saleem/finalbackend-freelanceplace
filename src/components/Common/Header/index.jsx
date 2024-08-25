import React, { useState, useEffect } from "react";

import {
  JobsDropdwon,
  IconSearchBar,
  Notification,
  GreaterThan,
  ProfileIcon,
  Logo,
} from "../../../svg/index";
import "./styles.scss";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [hoveredOption, setHoveredOption] = useState("");

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };
    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Logo width="100" height="100" />
        </div>
        <div className="dropdown-container">
          <h2 className="find-work">Find Work</h2>
          <div onClick={toggleDropdown} className="dropdown-toggle">
            <JobsDropdwon />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                {[
                  "Post a Job",
                  "All Jobs Post",
                  "Add Payment",
                  "Privacy Policy",
                ].map((option) => (
                  <li
                    key={option}
                    className={`dropdown-item ${
                      selectedOption === option ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHoveredOption(option)}
                    onMouseLeave={() => setHoveredOption("")}
                    style={{
                      color: hoveredOption === option ? "#4BCBEB" : "black",
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
        <div className="user-info">
          <Notification className="icon" width="20" height="20" />
          <ProfileIcon className="icon" width="20" height="20" />
          <div className="user-details">
            <div className="user-name">Sammar Zahra</div>
            <div className="user-status">Status 200</div>
          </div>
          <GreaterThan className="icon" width="20" height="20" />
        </div>
      </div>
    </header>
  );
};

export default Header;
