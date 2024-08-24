import React, { useState, useEffect } from 'react';
import Header from "../../components/Common/Header";
import ProgressBar from "../../components/Common/ProgressBar.jsx";
import "./styles.scss";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProjectDuration = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [projectSize, setProjectSize] = useState("");
    const [duration, setDuration] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");

    const steps = [
        { number: "1", label: "Job Title", color: "#4BCBEB" },
        { number: "2", label: "Description", color: "#4BCBEB" },
        { number: "3", label: "Preferred Skills", color: "#4BCBEB" },
        { number: "4", label: "Budget", color: "#4BCBEB" },
        { number: "5", label: "Project Duration", color: "#4BCBEB" },
        { number: "6", label: "Attachment", color: "#6b7280" },
    ];

    useEffect(() => {
        // Load saved project duration data from localStorage on component mount
        const savedData = JSON.parse(localStorage.getItem('projectDuration') || '{}');
        setProjectSize(savedData.size || "");
        setDuration(savedData.duration || "");
        setExperienceLevel(savedData.experienceLevel || "");
    }, []);

    const handleAttachmentButtonClick = () => {
        const projectDurationData = {
            size: projectSize,
            duration,
            experienceLevel
        };

        // Debugging: Log data to be saved
        console.log('Saving project duration data to localStorage:', projectDurationData);

        localStorage.setItem('projectDuration', JSON.stringify(projectDurationData));
        navigate('/Attachment'); // Replace with your target route
    };

    const handleSizeChange = (size) => {
        setProjectSize(size);
        // Update localStorage with the selected size
        const currentData = JSON.parse(localStorage.getItem('projectDuration') || '{}');
        const updatedData = { ...currentData, size };
        localStorage.setItem('projectDuration', JSON.stringify(updatedData));
    };

    const handleBackButtonClick = () => {
        navigate('/Budget'); // Replace with your target route
    };

    const handleDurationChange = (duration) => {
        setDuration(duration);
        // Update localStorage with the selected duration
        const currentData = JSON.parse(localStorage.getItem('projectDuration') || '{}');
        const updatedData = { ...currentData, duration };
        localStorage.setItem('projectDuration', JSON.stringify(updatedData));
    };

    const handleExperienceChange = (experience) => {
        setExperienceLevel(experience);
        // Update localStorage with the selected experience level
        const currentData = JSON.parse(localStorage.getItem('projectDuration') || '{}');
        const updatedData = { ...currentData, experienceLevel: experience };
        localStorage.setItem('projectDuration', JSON.stringify(updatedData));
    };

    return (
        <div className="project-duration-container">
            <Header />
            <div className="content">
                <ProgressBar steps={steps} currentStep={4} />
                <div className="content-body">
                    <div className="left-section">
                        <h4>5/6 Project duration</h4>
                        <h1>Next, estimate the 
                            <br/>
                            scope of your
                            <br/>
                            work.</h1>
                        <p>Consider the size of your project 
                            <br/>
                            and the time it will take.</p>
                        <button className="back-button" onClick={handleBackButtonClick}>Back</button>
                    </div>
                    <div className="right-section">
                        <div className="size-options">
                            <div className="size-box">
                                <span
                                    onClick={() => handleSizeChange('Large')}
                                    className={projectSize === 'Large' ? 'selected' : ''}
                                >
                                    Large
                                </span>
                                <input
                                    type="radio"
                                    name="size"
                                    checked={projectSize === 'Large'}
                                    onChange={() => handleSizeChange('Large')}
                                />
                            </div>
                            <div className="size-box">
                                <span
                                    onClick={() => handleSizeChange('Medium')}
                                    className={projectSize === 'Medium' ? 'selected' : ''}
                                >
                                    Medium
                                </span>
                                <input
                                    type="radio"
                                    name="size"
                                    checked={projectSize === 'Medium'}
                                    onChange={() => handleSizeChange('Medium')}
                                />
                            </div>
                            <div className="size-box">
                                <span
                                    onClick={() => handleSizeChange('Small')}
                                    className={projectSize === 'Small' ? 'selected' : ''}
                                >
                                    Small
                                </span>
                                <input
                                    type="radio"
                                    name="size"
                                    checked={projectSize === 'Small'}
                                    onChange={() => handleSizeChange('Small')}
                                />
                            </div>
                        </div>

                        <h2>How long will your work take?</h2>
                        <div className="work-duration-options">
                            <label>
                                <input
                                    type="radio"
                                    name="duration"
                                    value="3 to 6 months"
                                    checked={duration === '3 to 6 months'}
                                    onChange={() => handleDurationChange('3 to 6 months')}
                                />
                                3 to 6 months
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="duration"
                                    value="1 to 3 months"
                                    checked={duration === '1 to 3 months'}
                                    onChange={() => handleDurationChange('1 to 3 months')}
                                />
                                1 to 3 months
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="duration"
                                    value="Less than 1 month"
                                    checked={duration === 'Less than 1 month'}
                                    onChange={() => handleDurationChange('Less than 1 month')}
                                />
                                Less than 1 month
                            </label>
                        </div>

                        <h2>What level of experience will it need?</h2>
                        <div className="experience-options">
                            <label>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="Entry"
                                    checked={experienceLevel === 'Entry'}
                                    onChange={() => handleExperienceChange('Entry')}
                                />
                                Entry
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="Intermediate"
                                    checked={experienceLevel === 'Intermediate'}
                                    onChange={() => handleExperienceChange('Intermediate')}
                                />
                                Intermediate
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="Expert"
                                    checked={experienceLevel === 'Expert'}
                                    onChange={() => handleExperienceChange('Expert')}
                                />
                                Expert
                            </label>
                        </div>

                        <button className="next-button" onClick={handleAttachmentButtonClick}>Next: Attachment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDuration;
