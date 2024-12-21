import React, { useState, useEffect } from "react";
import { Header, Spinner } from "../../components/index";
import { JobsDropdwon } from "../../svg/index";
import "./styles.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FreelancerCard = ({ heading, freelancer }) => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState("");

  // New State for Filters
  const [selectedSkills, setSelectedSkills] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");

  const navigate = useNavigate();
  const [userCountryMap, setUserCountryMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      const fetchFreelancerProfiles = async () => {
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          // Fetch freelancers and user countries concurrently
          const [freelancerResponse, usersResponse] = await Promise.all([
            axios.get("http://localhost:5000/api/freelancer/profile", {
              headers,
            }),
            axios.get("http://localhost:5000/api/client/users", { headers }),
          ]);

          const freelancers = freelancerResponse.data.data;
          const users = usersResponse.data;

          // Create a map of user IDs to country names
          const userCountryMap = users.reduce((acc, user) => {
            acc[user._id] = user.country_name;
            return acc;
          }, {});

          setFreelancers(freelancers);
          setUserCountryMap(userCountryMap);

          setLoading(false);
        } catch (err) {
          setError("Failed to fetch freelancer profiles or user data");
          setLoading(false);
        }
      };

      fetchFreelancerProfiles();
    }
  }, [navigate]);

  const handleDropdownClick = (filterName) => {
    setOpenDropdown(openDropdown === filterName ? null : filterName);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const handleNoFilterClick = (filterName) => {
    handleFilterChange(filterName, ""); // Reset the selected filter
    setOpenDropdown(null); // Close the dropdown after deselecting
  };

  const handleInviteClick = (freelancer) => {
    const country = userCountryMap[freelancer.freelancer_id] || "Unknown";

    navigate("/offerform", {
      state: {
        freelancerProfile: {
          ...freelancer,
          country,
        },
      },
    });
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "Skills":
        setSelectedSkills(selectedSkills === value ? "" : value); // Toggling logic
        break;
      case "Categories":
        setSelectedCategories(selectedCategories === value ? "" : value);

        break;
      case "Location":
        setSelectedLocation(selectedLocation === value ? "" : value);
        break;
      case "Availability":
        setSelectedAvailability(selectedAvailability === value ? "" : value);
        break;
      default:
        break;
    }
  };

  // Filter Logic: Filtering freelancers based on selected options
  const filteredFreelancers = freelancers.filter((freelancer) => {
    const skillsMatch = selectedSkills
      ? freelancer.skills.some((skill) =>
          skill.toLowerCase().includes(selectedSkills.toLowerCase())
        )
      : true;

    const categoryMatch = selectedCategories
      ? freelancer.experience.title
          .toLowerCase()
          .includes(selectedCategories.toLowerCase())
      : true;

    const locationMatch = selectedLocation
      ? freelancer.location.toLowerCase() === selectedLocation.toLowerCase()
      : true;

    const availabilityMatch = selectedAvailability
      ? (selectedAvailability === "Full-time" &&
          freelancer.availability.full_time) ||
        (selectedAvailability === "Part-time" &&
          freelancer.availability.part_time) ||
        (selectedAvailability === "Contract" &&
          freelancer.availability.contract)
      : true;

    return skillsMatch && categoryMatch && locationMatch && availabilityMatch;
  });

  const categoriesOptions = [
    "MERN Stack",
    "UI/UX Design",
    "Front end developer",
    "Backend Developer",
  ];
  const skillsOptions = ["JavaScript", "Python", "CSS", "HTML"];
  const availabilityOptions = ["Full-time", "Part-time", "Contract"];
  const locationOptions = ["Remote", "On-site", "Hybrid"];

  if (loading) return <Spinner size={100} alignCenter />;
  if (error) return <div>{error}</div>;

  return (
    <>
    <Header />
    <div className="freelancer-card-container">
      

      <h1 className="heading">{heading}</h1>

      <div className="filter-options">
        {/* Skills Filter */}
        <div
          className="filter-item"
          onClick={() => handleDropdownClick("Skills")}
        >
          <span
            className={`filter-label ${
              selectedSkills ? "selected-filter" : ""
            }`}
          >
            Skills
          </span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === "Skills" && (
            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Search for skills..."
                className="search-input"
                value={selectedSkills}
                onChange={(e) => handleFilterChange("Skills", e.target.value)}
              />
              {skillsOptions
                .filter((option) =>
                  option.toLowerCase().includes(selectedSkills.toLowerCase())
                )
                .map((option, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleFilterChange("Skills", option)}
                  >
                    {option}
                  </div>
                ))}
              <div
                className="dropdown-item no-filter"
                onClick={() => handleNoFilterClick("Skills")}
              >
                No Filter
              </div>
            </div>
          )}
        </div>

        {/* Categories Filter */}
        <div
          className="filter-item"
          onClick={() => handleDropdownClick("Categories")}
        >
          <span
            className={`filter-label ${
              selectedCategories ? "selected-filter" : ""
            }`}
          >
            Categories
          </span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === "Categories" && (
            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Search for categories..."
                className="search-input"
                value={selectedCategories}
                onChange={(e) =>
                  handleFilterChange("Categories", e.target.value)
                }
              />
              {categoriesOptions
                .filter((option) =>
                  option
                    .toLowerCase()
                    .includes(selectedCategories.toLowerCase())
                ) // Filter categories based on search input
                .map((option, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleFilterChange("Categories", option)}
                  >
                    {option}
                  </div>
                ))}
              <div
                className="dropdown-item no-filter"
                onClick={() => handleNoFilterClick("Categories")}
              >
                No Filter
              </div>
            </div>
          )}
        </div>

        {/* Availability Filter */}
        <div
          className="filter-item"
          onClick={() => handleDropdownClick("Availability")}
        >
          <span className="filter-label">Availability</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === "Availability" && (
            <div className="dropdown-menu">
              {availabilityOptions.map((option, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleFilterChange("Availability", option)}
                >
                  {option}
                </div>
              ))}
              <div
                className="dropdown-item no-filter"
                onClick={() => handleNoFilterClick("Availability")}
              >
                No Filter
              </div>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div
          className="filter-item"
          onClick={() => handleDropdownClick("Location")}
        >
          <span className="filter-label">Location</span>
          <JobsDropdwon alt="Dropdown Icon" className="dropdown-icon" />
          {openDropdown === "Location" && (
            <div className="dropdown-menu">
              {locationOptions.map((option, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleFilterChange("Location", option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* No freelancer found */}
      {filteredFreelancers.length === 0 ? (
        <div className="no-freelancer-found">No freelancer found</div>
      ) : (
        filteredFreelancers.map((freelancer, index) => (
          <div key={index} className="freelancer-card">
            <div className="freelancer-profile">
              <img
                src={freelancer.image}
                alt="Profile"
                className="profile-pic"
              />
            </div>
            <div className="freelancer-details">
              <div className="freelancer-header">
                <h2 className="freelancer-name">{freelancer.name}</h2>
                <span className="freelancer-location">
                  {userCountryMap[freelancer.freelancer_id] || "Unknown"}
                </span>
                <button
                  className="inviteButton"
                  onClick={() => handleInviteClick(freelancer)}
                >
                  Invite to job
                </button>
              </div>
              <div className="freelancer-role">
                {freelancer.experience.title}
              </div>
              <div className="freelancer-meta">
                <span className="freelancer-rate">
                  $
                  {freelancer.rate !== "Not specified"
                    ? freelancer.rate
                    : "Rate not specified"}
                  /hr
                </span>
                <span className="freelancer-success">
                  {freelancer.totalJobs} projects completed
                </span>
              </div>
              <div className="freelancer-availability">
                {freelancer.availability.full_time &&
                freelancer.availability.part_time
                  ? "Full-time & Part-time"
                  : freelancer.availability.full_time
                  ? "Full-time"
                  : freelancer.availability.part_time
                  ? "Part-time"
                  : "Not specified"}
              </div>
              <div className="freelancer-skills">
                {freelancer.skills.map((skill, i) => (
                  <span key={i} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default FreelancerCard;
