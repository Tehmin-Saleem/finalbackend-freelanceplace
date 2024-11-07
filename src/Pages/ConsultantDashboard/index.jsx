import React, { useState, useEffect } from 'react';
import './styles.scss';
import { FaUserCircle, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConsultantProfileView from "../../components/ConsultantProfileView";
import ConsultantProfileForm from '../../components/ConsultantProfileForm';

const ConsultantDashboard = () => {
    const [profileSaved, setProfileSaved] = useState(false);
    const [savedProfile, setSavedProfile] = useState(null);
    const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);  // Store the logged-in user data

    // Get saved profile data from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const fetchUserProfile = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/client/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);  // Store user profile
                        setProfileSaved(true);
                        setSavedProfile(data);
                    } else {
                        console.error('Failed to fetch user profile');
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };

            fetchUserProfile();
        }
    }, []);

    const handleProfileClick = () => {
        // Toggle the profile view if profile is saved
        if (profileSaved) {
            setIsProfileViewOpen(!isProfileViewOpen);  // Toggle view visibility
        } else {
            navigate('/ConsultantProfileForm');  // Navigate to form if profile not saved
        }
    };

    return (
        <div className="consultant-dashboard">
            <header className="dashboard-header">
                <h1>Consultant Dashboard</h1>
                <p>Monitor project progress and provide valuable feedback to clients.</p>
                <button className="profile-icon" onClick={handleProfileClick}>
                    {profileSaved ? <FaEye size={24} /> : <FaUserCircle size={24} />}
                </button>
            </header>

            {/* Conditionally render the profile form or view */}
            {user ? (
                !isProfileViewOpen ? (
                    <ConsultantProfileView profile={user} />
                ) : (
                    <div className="profile-view-container">
                        <ConsultantProfileView profile={user} />
                    </div>
                )
            ) : (
                <p>Loading...</p>
            )}

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
    );
};

export default ConsultantDashboard;
