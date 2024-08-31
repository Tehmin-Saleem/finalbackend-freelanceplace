import React, { useState, useEffect } from "react";
import { Header, Proposalscard } from "../../components/index";
import axios from "axios";

import "./styles.scss";

const IndexPage = () => {
  const [profile, setProfile] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const [profileResponse, proposalsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/freelancer/profile", {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/freelancer/getproposals", {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        console.log("Profile Response:", profileResponse.data);
        console.log("Proposals Response:", proposalsResponse.data);
        
        setProfile(profileResponse.data.data);
        setProposals(proposalsResponse.data.proposals);
      } catch (err) {
        console.error("Error fetching data:", err.response ? err.response.data : err.message);
        setError(`Error fetching data: ${err.message}`);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="proposals-page">
      <Header />
      <h1 className="proposals-heading">Proposals</h1>
      <div className="proposals-container">
        {proposals.map((proposal) => (
          <Proposalscard
            key={proposal.id}
            name={profile ? `${profile.name}` : ""}
            title={profile ? profile.experience.title : ""}
            location={localStorage.getItem("country") || "Not specified"}
            rate={proposal.rate}
            earned={profile ? `$${profile.totalHours + (profile.totalJobs || 0)}+ earned` : "$0 earned"}
            qualification="Bachelor in design"
            timeline={proposal.timeline}
            coverLetter={proposal.coverLetter}
            image={profile ? profile.image : "/images/Profile.png"}
            jobTitle={proposal.jobTitle}
            status="Highly Interested"
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

export default IndexPage;