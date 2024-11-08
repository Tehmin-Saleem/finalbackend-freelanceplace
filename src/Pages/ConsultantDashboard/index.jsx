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
    const [user, setUser] = useState(null);

    const handleProfileSave = (profileData) => {
        console.log('Profile saved:', profileData);
        setSavedProfile(profileData);
        setProfileSaved(true);
        setIsProfileViewOpen(true);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
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
                        setUser(data);
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
        if (profileSaved) {
            setIsProfileViewOpen(!isProfileViewOpen);
        } else {
            navigate('/ConsultantProfileForm');
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

            {isProfileViewOpen && profileSaved ? (
                <ConsultantProfileView profile={savedProfile} />
            ) : (
                <p>{!profileSaved && "Profile not saved yet."}</p>
            )}

            {/* Uncomment the following to show ConsultantProfileForm when profile is not saved */}
            {!profileSaved && (
                <ConsultantProfileForm onSave={handleProfileSave} />
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
