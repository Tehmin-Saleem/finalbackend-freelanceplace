import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.scss";
import { jwtDecode } from "jwt-decode";
import {
  Cross,
  IconSearchBar,
  UploadIcon,
  PlusIcon,
  ImageIcon,
} from "../../svg/index";
import { Cross, IconSearchBar, UploadIcon, PlusIcon } from "../../svg/index";
import { Header, Spinner } from "../../components/index";
import PortfolioFilePreview from "./PortfolioFilePreview";

const MyProfile = () => {
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPopularSkills, setFilteredPopularSkills] = useState([]);

  const popularSkills = [
    "React",
    "UI/UX Design",
    "JavaScript",
    "CSS",
    "HTML",
    "Figma",
  ];

  const [profile, setProfile] = useState({
    profileId: "",
    first_name: "",
    last_name: "",
    email: "",
    image: "",
    title: "",
    experience: {
      completed_projects: 0,
    },
    availability: {
      full_time: false,
      part_time: false,
      hourly_rate: 0,
    },
    profile_overview: "",
    languages: [],
    skills: [],
    portfolios: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      navigate("/signin");
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        freelancer_id: userId,
      }));
    }
  }, [navigate]);

  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState({
    project_title: "",
    category: "",
    description: "",
    tool_used: "",
    url: "",
    attachment: null,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProfileDataIfNeeded = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const userResponse = await axios.get(
        `http://localhost:5000/api/freelancer/users/${userId}`,
        config
      );

      const userData = userResponse.data;

      setProfile((prevProfile) => ({
        ...prevProfile,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
      }));

      const existenceResponse = await axios.get(
        `http://localhost:5000/api/freelancer/freelancer-profile-exists/${userId}`,
        config
      );

      if (existenceResponse.data.exists) {
        const profileResponse = await axios.get(
          `http://localhost:5000/api/freelancer/profile/${userId}`,
          config
        );

        if (profileResponse.data.data) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...profileResponse.data.data,
            first_name:
              profileResponse.data.data.first_name || prevProfile.first_name,
            last_name:
              profileResponse.data.data.last_name || prevProfile.last_name,
            email: profileResponse.data.data.email || prevProfile.email,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDataIfNeeded();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleExperienceChange = (e) => {
    const { value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      experience: {
        ...prevProfile.experience,
        completed_projects: parseInt(value),
      },
    }));
  };

  const handleAvailabilityChange = (e) => {
    const { value } = e.target;
    setProfile((prevProfile) => {
      const newAvailability = {
        full_time: value === "full_time",
        part_time: value === "part_time",
        hourly_rate: prevProfile.availability.hourly_rate,
      };
      return {
        ...prevProfile,
        availability: newAvailability,
      };
    });
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...profile.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setProfile((prevProfile) => ({
      ...prevProfile,
      languages: updatedLanguages,
    }));
  };

  const addLanguage = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      languages: [
        ...prevProfile.languages,
        { language: "", proficiency_level: "" },
      ],
    }));
  };

  const removeLanguage = (index) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      languages: prevProfile.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = (skill) => {
    if (!profile.skills.includes(skill)) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        skills: [...prevProfile.skills, skill],
      }));
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      skills: prevProfile.skills.filter((s) => s !== skill),
    }));
  };

  // Handle Enter key press to add custom skill
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (skillInput.trim() !== "") {
        handleAddSkill(skillInput.trim()); // Add the skill
        setSkillInput(""); // Clear the input
      }
    }
  };
  useEffect(() => {
    setFilteredPopularSkills(
      popularSkills.filter((skill) =>
        skill.toLowerCase().includes(skillInput.toLowerCase())
      )
    );
  }, [skillInput, popularSkills]);

  // Add this new useEffect after your existing useEffects
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Fetch user data
        const response = await axios.get(
          `http://localhost:5000/api/freelancer/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data;

        // Update profile state with user data
        setProfile((prevProfile) => ({
          ...prevProfile,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          // Add any other fields that come from user data
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioChange = async (e) => {
    const { name, value, type } = e.target;
    setError(null);

    if (type === 'file') {
      const file = e.target.files[0];
      if (!file) return;

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }

      // Validate file type
      if (!file.type.match('application/pdf|image/png|image/jpeg')) {
        setError('Please upload only PDF, PNG, or JPEG files.');
        return;
      }

      setCurrentPortfolio(prev => ({
        ...prev,
        attachment: file
      }));
    } else {
      setCurrentPortfolio(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDeletePortfolio = (index) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      portfolios: prevProfile.portfolios.filter((_, i) => i !== index)
    }));
  };

  const handleSavePortfolio = () => {
    const newPortfolio = {
      project_title: currentPortfolio.project_title,
      category: currentPortfolio.category,
      description: currentPortfolio.description,
      tool_used: currentPortfolio.tool_used,
      url: currentPortfolio.url,
      attachment: currentPortfolio.attachment
    };

    setProfile(prevProfile => ({
      ...prevProfile,
      portfolios: [...prevProfile.portfolios, newPortfolio]
    }));

    setPortfolioModalOpen(false);
    setCurrentPortfolio({
      project_title: "",
      category: "",
      description: "",
      tool_used: "",
      url: "",
      attachment: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);
      formData.append("title", profile.title);
      formData.append("profile_overview", profile.profile_overview);
      formData.append("experience", JSON.stringify(profile.experience));
      formData.append("availability", JSON.stringify(profile.availability));
      formData.append("languages", JSON.stringify(profile.languages));
      formData.append("skills", JSON.stringify(profile.skills));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const portfoliosForUpload = profile.portfolios.map((portfolio, index) => {
        const portfolioData = {
          project_title: portfolio.project_title,
          category: portfolio.category,
          description: portfolio.description,
          tool_used: portfolio.tool_used,
          url: portfolio.url,
        };

        if (portfolio.attachment instanceof File) {
          formData.append(
            `portfolio_attachments`,
            portfolio.attachment,
            `portfolio_${index}_${portfolio.attachment.name}`
          );
        }

        return portfolioData;
      });

      formData.append("portfolios", JSON.stringify(portfoliosForUpload));
      formData.append("email", profile.email);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/freelancer/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/FreelanceDashBoard");
    } catch (error) {
      console.error("Error submitting profile:", error);
      setError("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner alignCenter />;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(skillInput);
      setSkillInput("");
    }
  };

  return (
    <div className="my-profile">
      <Header />

      <div className="profile-container">
        <h1>My Profile</h1>

        <form onSubmit={handleSubmit} className="form-section">
          <div className="input-row">
            <div className="input-group">
              <label>Enter your first name:</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleProfileChange}
                placeholder="First Name"
              />
            </div>
            <div className="input-group">
              <label>Enter your last name:</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleProfileChange}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="profile-image-section">
            <p>Upload your profile image</p>
            <div className="img-format">
              <span>Support Format: PNG, JPEG, jpg</span>
              <span> Maximum Size: 5MB</span>
            </div>
            <div className="profile-image">
              <img src={profile.image} alt="Profile" />
              <label htmlFor="image-upload" className="upload-overlay">
                <UploadIcon />
                <span className="re">Upload</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg,image/jpg"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="field-group">
            <label>Enter your title</label>
            <input
              type="text"
              name="title"
              value={profile.title}
              onChange={handleProfileChange}
              placeholder="UI/UX Designer, Graphic Designer"
            />
          </div>

          <div className="field-group">
            <label>Experience</label>
            <input
              type="number"
              value={profile.experience.completed_projects}
              onChange={handleExperienceChange}
              placeholder="Enter your completed projects"
            />
          </div>

          <div className="field-group">
            <label>Enter hourly rate</label>
            <div className="input-with-icon">
              <span className="icon">$</span>
              <input
                type="number"
                name="hourly_rate"
                value={profile.availability.hourly_rate}
                onChange={handleAvailabilityChange}
                placeholder="120.00/hour"
              />
            </div>
          </div>
          <div className="form-group languages-group">
            <label>Languages</label>
            {profile.languages.map((lang, index) => (
              <div key={index} className="language-input-group">
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) =>
                    handleLanguageChange(index, "language", e.target.value)
                  }
                  placeholder="Language"
                />
                <select
                  value={lang.proficiency_level}
                  onChange={(e) =>
                    handleLanguageChange(
                      index,
                      "proficiency_level",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Native">Native</option>
                </select>
                <button type="button" onClick={() => removeLanguage(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguage}
              className="add-language-btn"
            >
              Add Language
            </button>
          </div>

          <div className="form-group availability-group">
            <label>Availability</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="availability_type"
                  value="full_time"
                  checked={profile.availability.full_time}
                  onChange={handleAvailabilityChange}
                />
                Full Time
              </label>
              <label>
                <input
                  type="checkbox"
                  name="availability_type"
                  value="part_time"
                  checked={profile.availability.part_time}
                  onChange={handleAvailabilityChange}
                />
                Part Time
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Profile Overview</label>
            <textarea
              name="profile_overview"
              value={profile.profile_overview}
              onChange={handleProfileChange}
              placeholder="Write a brief overview of your profile..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Search Skills or add your own:</label>
            <div className="search-bar">
              <IconSearchBar alt="Search" />
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress} // Prevent form submission and add skill
                placeholder="Search skills..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Selected Skills</label>
            <div className="selected-skills">
              {profile.skills.map((skill) => (
                <div className="skill-badge" key={skill}>
                  {skill}
                  <Cross
                    alt="Remove"
                    className="remove-skill"
                    onClick={() => handleRemoveSkill(skill)} // Remove skill
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Popular Skills</label>
            <div className="popular-skills">
              {filteredPopularSkills.length > 0 ? (
                filteredPopularSkills.map((skill) => (
                  <div
                    className="skill-badge"
                    key={skill}
                    onClick={() => handleAddSkill(skill)} // Add skill
                  >
                    {skill}
                    <PlusIcon alt="Add" className="add-skill" />
                  </div>
                ))
              ) : (
                <p>No matching skills found</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Add Your Portfolio</label>
            <div className="portfolio">
            {profile.portfolios.map((portfolio, index) => (
             <div className="thumbnail-preview">
            
            <div key={index} className="portfolio-box">
            <div
               className="delete-icon"
               onClick={() => handleDeletePortfolio(index)}
               style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}
             >
               <Cross alt="Delete" />
             </div>
                <PortfolioFilePreview
                  file={portfolio.attachment instanceof File ? portfolio.attachment : null}
                  fileUrl={portfolio.attachment && portfolio.attachment instanceof File ? URL.createObjectURL(portfolio.attachment) : null}
                />
              </div>
              <h3>{portfolio.project_title}</h3>
              <p>{portfolio.category}</p>
              
            </div>
          ))}
          <div
            className="portfolio-box add-box bg-black"
            onClick={() => setPortfolioModalOpen(true)}
          >
            <PlusIcon />
            <p>Add</p>
          </div>
        </div>
      </div>


          <label>Email:</label>
          <div className="field-group">
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              required
              readOnly
              className="readonly-input"
            />
          </div>

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>

      {portfolioModalOpen && (
        <div className="portfolio-modal">
          <div className="modal-content">
            <h2>Add Portfolio</h2>
            <div className="input-group">
              <label>Project Title</label>
              <input
                type="text"
                name="project_title"
                value={currentPortfolio.project_title}
                onChange={handlePortfolioChange}
                placeholder="Project Title"
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={currentPortfolio.category}
                onChange={handlePortfolioChange}
                placeholder="Category"
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={currentPortfolio.description}
                onChange={handlePortfolioChange}
                placeholder="Project Description"
              ></textarea>
            </div>
            <div className="input-group">
              <label>Tools Used</label>
              <input
                type="text"
                name="tool_used"
                value={currentPortfolio.tool_used}
                onChange={handlePortfolioChange}
                placeholder="Tools Used"
              />
            </div>
            <div className="input-group">
              <label>Project URL</label>
              <input
                type="url"
                name="url"
                value={currentPortfolio.url}
                onChange={handlePortfolioChange}
                placeholder="Project URL"
              />
            </div>
            <div className="input-group">
              <label>Upload Attachment</label>
              <input
                type="file"
                name="attachment"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handlePortfolioChange}
              />
              {error && (
                <div className="error-message" style={{ color: 'red', marginTop: '8px' }}>
                  {error}
                </div>
              )}
              {currentPortfolio.attachment && (
                <div className="file-preview">
                  <PortfolioFilePreview
                    file={currentPortfolio.attachment}
                    fileUrl={URL.createObjectURL(currentPortfolio.attachment)}
                  />
                </div>
              )}
            </div>

            <div className="file-requirements" style={{ marginTop: '8px', fontSize: '0.9em' }}>
              <p>Max file size: 10 MB</p>
              <p>Accepted formats: PDF, PNG, JPG, JPEG</p>
            </div>

            <div className="portfolio-button-group">
              <button
                className="portfolio-save-button"
                onClick={handleSavePortfolio}
              >
                Save Portfolio
              </button>
              <button
                className="portfolio-cancel-button"
                onClick={() => setPortfolioModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
