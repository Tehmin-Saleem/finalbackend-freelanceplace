import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "./styles.scss";
import Header from "../Header";
import axios from "axios";

const QueryForm = () => {
  const location = useLocation();
  const user = location.state || {}; // Access user data passed from FreelanceDashboardPage
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    queryType: '',
    name: user.first_name || '', // Pre-fill name if available
    email: user.email || '', // Pre-fill email if available
    message: '',
  });
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        console.log("token", token);
        if (!token) {
            console.error("No token found");
            // navigate('/signin'); // Uncomment if you want to redirect to signin
            return;
        }
        const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const userRole = decodedToken.role;

        console.log("userid", userId);

        if (!userId) {
            console.error("User ID not found in token");
            return;
        }

        // Prepare request configuration and body
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        };

        const requestBody = {
            ...formData, // Ensure that formData is defined and populated elsewhere in your component
            userId,
        };

        // Define the route based on the user role
        let route;
        if (userRole === "client") {
            route = `${BASE_URL}/api/client/query`;
        } else if (userRole === "freelancer") {
            route = `${BASE_URL}/api/freelancer/query`;
        } else {
            return;
        }

        // Make the API request
        const { data } = await axios.post(route, requestBody, config);
        console.log('Query submitted successfully', data);

        // Handle success message and redirection
        setSuccessMessage('Your query has been submitted!');
        alert("Your query has been submitted");

        setTimeout(() => {
            if(userRole=='client'){
                navigate('/ClientDashboard'); 
            }else{
                navigate('/freelancedashboard'); 
            }
            // Redirect to the dashboard after a few seconds
        }, 2000);

    } catch (error) {
        console.error('Error submitting query:', error);
    }
};


























    //     const response = await fetch('http://localhost:5000/api/freelancer/query', {
    //         method: 'POST',
    //         headers: { 
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ 
    //             ...formData, 
    //             userId 
    //           })
    //     });

    //     if (!response.ok) {
    //         throw new Error(`Error: ${response.statusText}`);
    //     }

    //     const data = await response.json();
    //     console.log('Query submitted successfully', data);

    //     setSuccessMessage('Your query has been submitted!');
    //     alert("Your query has been submitted");
    //     setTimeout(() => {
    //         navigate('/freelancedashboard'); // Redirect to the dashboard after a few seconds
    //     }, 2000);
    // } catch (error) {
    //     console.error('Error submitting query:', error);
    // }
// };



  return (
    <>
    <Header/>
    <div className="query-form-container">
      <h2>Submit Your Query</h2>
      {successMessage && <p>{successMessage}</p>} {/* Display success message */}
      <form className="query-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="queryType">Query Type</label>
          <select
            id="queryType"
            name="queryType"
            value={formData.queryType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a Query Type</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Client">Client</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your query"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Submit Query</button>
      </form>
    </div>
    </>
  );
};

export default QueryForm;
