import React, { useState, useEffect } from "react";
import axios from "axios";
import { JobsCard, Header, Spinner } from "../../components/index";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected jwtDecode import

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [goToPage, setGoToPage] = useState("");
  const formatTimeDifference = (createdAt) => {
    if (!createdAt || isNaN(new Date(createdAt).getTime())) {
      return "Invalid time"; // Fallback for missing or invalid date
    }
  
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };
  
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
        // Fetch jobs, user data, and payment methods concurrently
        const [jobsResponse, userResponse, paymentMethodsResponse] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/client/job-posts`, {
              headers,
            }),
            axios.get(`${BASE_URL}/api/client/users`, { headers }),
            axios.get(`${BASE_URL}/api/client/payment-methods`, {
              headers,
            }),
          ]);
console.log('payment',paymentMethodsResponse.data)
console.log('users',userResponse.data)
console.log('jobs',jobsResponse.data)
        // Check if paymentMethodsResponse.data.paymentMethods is an array
        const paymentMethodsArray = Array.isArray(
          paymentMethodsResponse.data.paymentMethods
        )
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
console.log('paymentmap', paymentMethodMap)
        setPaymentMethods(paymentMethodMap);

        // Combine job data with payment method status and country name
        const jobsWithPaymentStatus = jobsResponse.data.jobPosts.map((job) => {
          const clientId = job.client_id?._id;
          return {
            ...job,
            paymentMethodStatus: paymentMethodMap[clientId] ? "Payment Verified" : "No Payment Method Available",
            country: clientId
            ? userCountryMap[clientId] || "Unknown"
            : "Unknown",
        };
      });

        setJobs(jobsWithPaymentStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
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
  const indexOfLastJob = currentPage * rowsPerPage;
  const indexOfFirstJob = indexOfLastJob - rowsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / rowsPerPage);

  // Pagination handlers
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleGoToPage = (event) => {
    event.preventDefault();
    const pageNumber = parseInt(goToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setGoToPage("");
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("ellipsis1");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(currentPage + 1, totalPages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis2");
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };
  if (loading) return <Spinner size={100} alignCenter />;
  if (error) return <div>{error}</div>;

  return (
    <div className="jobs-page">
      <Header />
      <h1 className="jobs-heading">All Jobs</h1>
      <div className="jobs-container">
        {currentJobs.map((job) => (
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
            proposalCount={job.proposalCount}
            paymentMethodStatus={job.paymentMethodStatus}
            location={job.country}
            // Add these new props
            clientName={
              job.client_id
                ? `${job.client_id.first_name} ${job.client_id.last_name}`
                : "Unknown"
            }
            createdAt={job.createdAt ? formatTimeDifference(job.createdAt) : "Date not available"}


            clientLocation={job.client_id?.country_name || "Unknown"}
          />
        ))}
      </div>
      <div className="pagination">
        <span>Rows per page</span>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <div className="page-controls">
          {getPageNumbers().map((page, index) => (
            page === "ellipsis1" || page === "ellipsis2" ? (
              <span key={page}>...</span>
            ) : (
              <span
                key={page}
                onClick={() => handlePageClick(page)}
                style={{
                  cursor: 'pointer',
                  fontWeight: currentPage === page ? 'bold' : 'normal',
                  margin: '0 5px',
                  padding: '0 5px'
                }}
              >
                {page}
              </span>
            )
          ))}
        </div>
        <span>Go to page</span>
        <input
          type="text"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGoToPage(e)}
        />
        <button onClick={handleGoToPage}>→</button>
      </div>
    </div>
  );
};

export default JobsPage;