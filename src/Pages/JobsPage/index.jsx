import React, { useState, useEffect } from "react";
import axios from "axios";
import { JobsCard, Header } from "../../components/index";
import "./styles.scss";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode"; // Corrected jwtDecode import

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Fetch jobs, user data, and payment methods concurrently
        const [jobsResponse, userResponse, paymentMethodsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/client/job-posts', { headers }),
          axios.get(`http://localhost:5000/api/client/users`, { headers }),
          axios.get('http://localhost:5000/api/client/payment-methods', { headers })
        ]);
        
        // Check if paymentMethodsResponse.data.paymentMethods is an array
        const paymentMethodsArray = Array.isArray(paymentMethodsResponse.data.paymentMethods)
          ? paymentMethodsResponse.data.paymentMethods
          : []; // Fallback to empty array if not

        // Create a map of user IDs to country names
        const userCountryMap = userResponse.data.reduce((acc, user) => {
          acc[user._id] = user.country_name;
          return acc;
        }, {});

        // Create a map of client IDs to payment method status
        const paymentMethodMap = paymentMethodsArray.reduce((acc, method) => {
          if (method && method.client_id) {
            acc[method.client_id.toString()] = true; // Mark as verified
          }
          return acc;
        }, {});

        setPaymentMethods(paymentMethodMap);

        // Combine job data with payment method status and country name
        const jobsWithPaymentStatus = jobsResponse.data.jobPosts.map(job => {
          const clientId = job.client_id && job.client_id._id ? job.client_id._id.toString() : null;
          return {
            ...job,
            paymentMethodStatus: clientId && paymentMethodMap[clientId]
              ? "Payment Verified"
              : "No Payment Method Available",
            country: clientId ? userCountryMap[clientId] || "Unknown" : "Unknown"
            
          };
          
        });
        console.log("Jobs with payment status:", jobsWithPaymentStatus);
        setJobs(jobsWithPaymentStatus);
        
      } catch (error) {
        console.error("Detailed error:", error);
        setError("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);



  const formatRate = (job) => {
    if (job.budget_type === "fixed") {
      return `$${job.fixed_price}`;
    } else if (job.budget_type === "hourly" && job.hourly_rate) {
      const { from, to } = job.hourly_rate;
      return `$${from}-$${to}/hr`;
    } else {
      return "Rate not specified";
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="jobs-page">
      <Header />
      <h1 className="jobs-heading">Jobs matching your skills</h1>
      <div className="jobs-container">
        {jobs.map((job) => (
          <JobsCard
            key={job._id}
            jobPostId={job._id}
            type={job.budget_type === "fixed" ? "Fixed" : "Hourly"}
            title={job.job_title}
            rate={formatRate(job)}
            timeline={job.project_duration?.duration_of_work || "Not specified"}
            level={job.project_duration?.experience_level || "Not specified"}
            description={job.description || "No description provided"}
            tags={job.preferred_skills || []}
            paymentMethodStatus={job.paymentMethodStatus} 
            location={job.country}
          />
        ))}
      </div>
      <div className="pagination">
        <span>Rows per page</span>
        <select>
          <option>5</option>
          <option>10</option>
          <option>15</option>
        </select>
        <div className="page-controls">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
        </div>
        <span>Go to page</span>
        <input type="text" />
        <button>→</button>
      </div>
    </div>
  );
};

export default JobsPage;