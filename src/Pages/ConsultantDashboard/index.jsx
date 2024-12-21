import React from 'react';
import './styles.scss';
import { FaUserCircle, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components';

const ConsultantDashboard = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/ConsultantProfileForm'); // Navigate to the profile form
    };

    const handleViewClick = () => {
        navigate('/ConsultantProfileView'); // Navigate to view the profile
    };

    return (
        <>
        <Header/>
        <div className="consultant-dashboard">
            <header className="dashboard-header">
                <h1>Consultant Dashboard</h1>
                <p>Monitor project progress and provide valuable feedback to clients.</p>
                <button className="profile-icon" onClick={handleProfileClick}>
                    <FaUserCircle size={24} />
                </button>
                <button className="view-profile-button" onClick={handleViewClick}>
                    <FaEye size={24} />
                </button>
            </header>

            {/* Dashboard sections */}
            <div className="dashboard-sections">
                <div className="dashboard-card assigned-jobs">
                    <h2>Assigned Jobs</h2>
                    <ul>
                        <li><strong>Website Redesign</strong> for Tech Solutions - Due: Nov 10, 2024</li>
                        <li><strong>Mobile App Development</strong> for Healthify - Due: Nov 15, 2024</li>
                    </ul>
                </div>

                <div className="dashboard-card progress-review">
                    <h2>Progress Review</h2>
                    <ul>
                        <li><strong>Website Redesign</strong> - On Track: Great progress so far.</li>
                        <li><strong>Mobile App Development</strong> - Delayed: Awaiting design updates.</li>
                    </ul>
                </div>

                <div className="dashboard-card feedback-submission">
                    <h2>Feedback Submission</h2>
                    <ul>
                        <li><strong>Website Redesign</strong> - Feedback Submitted: Keep up the good work!</li>
                        <li><strong>Mobile App Development</strong> - Feedback Needed: Design needs improvement.</li>
                    </ul>
                </div>

                <div className="dashboard-card notifications">
                    <h2>Notifications</h2>
                    <ul>
                        <li>New job assigned: E-commerce Site Optimization - Date: Nov 2, 2024</li>
                        <li>Feedback required on: Mobile App Development - Date: Nov 3, 2024</li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
};

export default ConsultantDashboard;
