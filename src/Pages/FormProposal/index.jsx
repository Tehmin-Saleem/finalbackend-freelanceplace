import React, { useState } from "react";
import { Header } from "../../components/index";
import "./styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  SearchIcon,
  CrossIcon,
  PlusIcon,
  HourlyRate,
  FixedRate,
} from "../../svg/index";

const OfferForm = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [popularSkills, setPopularSkills] = useState([
    "HTML",
    "CSS",
    "JavaScript",
    "React",
  ]);
  const location = useLocation();
  const navigate = useNavigate();
  const { freelancerProfile } = location.state || {};
  const [attachedFile, setAttachedFile] = useState(null);
  const [budgetType, setBudgetType] = useState("");
  const [hourlyRate, setHourlyRate] = useState({ min: "", max: "" });
  const [fixedPrice, setFixedPrice] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSkillAdd = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setPopularSkills(popularSkills.filter((item) => item !== skill));
  };

  const handleSkillRemove = (skill) => {
    setPopularSkills([...popularSkills, skill]);
    setSelectedSkills(selectedSkills.filter((item) => item !== skill));
  };

  const handleFileAttach = (event) => {
    setAttachedFile(event.target.files[0]);
  };

  const handleFileRemove = () => {
    setAttachedFile(null);
  };

  const handleBudgetTypeChange = (type) => {
    setBudgetType(type);
    if (type === "fixed") {
      setHourlyRate({ min: "", max: "" });
    } else {
      setFixedPrice("");
    }
  };

  const validateForm = () => {
    if (!jobTitle || !description || !budgetType) {
      setError("Please fill in all required fields");
      return false;
    }
    if (budgetType === 'hourly' && (!hourlyRate.min || !hourlyRate.max)) {
      setError("Please provide both minimum and maximum hourly rates");
      return false;
    }
    if (budgetType === 'fixed' && !fixedPrice) {
      setError("Please provide a fixed price");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('budget_type', budgetType);
    formData.append('hourly_rate', JSON.stringify(hourlyRate));
    formData.append('fixed_price', fixedPrice);
    formData.append('description', description);
    formData.append('detailed_description', detailedDescription);
    formData.append('freelancer_id', freelancerProfile.freelancer_id);
    formData.append('job_title', jobTitle);
    formData.append('preferred_skills', JSON.stringify(selectedSkills));
    formData.append('status', 'pending');

    if (attachedFile) {
      formData.append('attachment', attachedFile);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/client/offerform', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('Response received:', response.status, response.data);
      navigate('/clientDashboard');
    } catch (error) {
      console.error('Error details:', error);
      setError(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <h2 className="offerTitle">Send an offer</h2>

      <div className="outerContainer">
        <div className="container">
          <div className="left">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Enter job title:</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    placeholder="UI/UX Designer"
                    className="roundedInput"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Description:</label>
                <div className="inputWrapper">
                  <textarea
                    placeholder="Enter about your project details"
                    className="textArea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Skills section */}
              <div className="field">
                <label>Search skills or add your own:</label>
                <div>
                  <input type="text" className="inputWithIcon" />
                  <span>
                    <SearchIcon className="searchIcon" />
                  </span>
                </div>
              </div>

              <h3 className="field">Selected skills</h3>
              <div className="skill">
                {selectedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="skillButton"
                    onClick={() => handleSkillRemove(skill)}
                  >
                    {skill}{" "}
                    <span>
                      <CrossIcon />
                    </span>
                  </button>
                ))}
              </div>

              <h3 className="field">Popular skills for UI/UX Design</h3>
              <div className="skills">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className="skillButton"
                    onClick={() => handleSkillAdd(skill)}
                  >
                    {skill}{" "}
                    <span>
                      <PlusIcon />
                    </span>
                  </button>
                ))}
              </div>

              {/* Budget section */}
              <h3 className="field">Budget</h3>
              <div className="budget-section">
                <div className="pricing-options">
                  <div 
                    className={`option-box ${budgetType === 'hourly' ? 'selected' : ''}`} 
                    onClick={() => handleBudgetTypeChange('hourly')}
                  >
                    <div className="box-content">
                      <span className="icon">
                        <HourlyRate />
                      </span>
                      <p>Hourly rate</p>
                    </div>
                  </div>
                  <div 
                    className={`option-box ${budgetType === 'fixed' ? 'selected' : ''}`} 
                    onClick={() => handleBudgetTypeChange('fixed')}
                  >
                    <div className="box-content">
                      <span className="icon">
                        <FixedRate />
                      </span>
                      <p>Fixed price</p>
                    </div>
                  </div>
                </div>

                {budgetType === 'hourly' && (
                  <div className="rate-inputs">
                    <div className="labels">
                      <label>From</label>
                      <label className="label1">To</label>
                    </div>
                    <div className="input-group">
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="$12.00"
                          value={hourlyRate.min}
                          onChange={(e) => setHourlyRate({...hourlyRate, min: e.target.value})}
                          required={budgetType === 'hourly'}
                        />
                        <span className="rate-unit">/hr</span>
                      </div>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="$15.00"
                          value={hourlyRate.max}
                          onChange={(e) => setHourlyRate({...hourlyRate, max: e.target.value})}
                          required={budgetType === 'hourly'}
                        />
                        <span className="rate-unit">/hr</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {budgetType === 'fixed' && (
                  <div className="rate-inputs">
                    <div className="input-group">
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="$1500.00"
                          value={fixedPrice}
                          onChange={(e) => setFixedPrice(e.target.value)}
                          required={budgetType === 'fixed'}
                        />
                        <span className="rate-unit">Total</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Describe what you need:</label>
                  <div>
                    <textarea 
                      className="textArea"
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="field">
                  <label className="attachButton">
                    <span className="icon">📎</span>
                    ATTACH
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileAttach}
                    />
                  </label>
                  {attachedFile && (
                    <div className="attachedFile">
                      <span>{attachedFile.name}</span>
                      <button type="button" onClick={handleFileRemove}>
                        <span className="icon">✖</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="field">
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="buttonWithIcon" disabled={isLoading}>
                    {isLoading ? "Sending..." : "SEND OFFER"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="right">
            <div className="userProfile">
              {freelancerProfile ? (
                <div className="freelancerProfile">
                  <h3>{freelancerProfile.name}</h3>
                  <p>{freelancerProfile.country || "No country provided"}</p>
                  <p>{freelancerProfile.experience?.title}</p>
                  <p>${freelancerProfile.rate} /hr</p>
                  <p>{freelancerProfile.totalJobs} jobs completed</p>
                </div>
              ) : (
                <p>No freelancer profile selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferForm;