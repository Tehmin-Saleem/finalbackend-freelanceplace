import React, { useState, useEffect } from "react";
import { Header, Proposalscard } from "../../components/index";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "./styles.scss";

const IndexPage = () => {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { jobId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("Token:", token);

        if (!token) {
          navigate("/signin");
          return;
        }

        const proposalsResponse = await axios.get(`http://localhost:5000/api/freelancer/getproposals?jobId=${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Proposals Response:", proposalsResponse.data);
        setProposals(proposalsResponse.data.proposals);
      } catch (err) {
        console.error("Error fetching data:", err.response ? err.response.data : err.message);
        setError(`Error fetching data: ${err.message}`);
      }
    };

    fetchData();
  }, [jobId, navigate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleProposalClick = (proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const handleHire = () => {
    navigate("/offerform");
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const indexOfLastProposal = currentPage * rowsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - rowsPerPage;
  const currentProposals = proposals.slice(indexOfFirstProposal, indexOfLastProposal);
  const totalPages = Math.ceil(proposals.length / rowsPerPage);

  return (
    <div className="proposals-page">
    <Header />
    
    <h1 className="proposals-heading">Proposals</h1>
    <div className="profiles-container">
      {currentProposals.map((proposal) => (
        <div key={proposal.id} onClick={() => handleProposalClick(proposal)} className="profile-card">
          <Proposalscard
            name={proposal.freelancerProfile?.name || "No Name"}
            title={proposal.freelancerProfile?.experience?.title || ""}
            location={localStorage.getItem('country') || "Not specified"}
            rate= {proposal.rate 
              ? `${proposal.rate}$` 
              : proposal.add_requirements?.by_project?.bid_amount 
                ? `${proposal.add_requirements.by_project.bid_amount}$` 
                : "Not specified"
            }
            earned={`$${proposal.freelancerProfile?.totalHours + (proposal.freelancerProfile?.totalJobs || 0)}+ earned`}
            timeline={proposal.timeline || "Not specified"}
            image={proposal.freelancerProfile?.image 
              ? `http://localhost:5000${proposal.freelancerProfile.image}`
              : "/images/Profile.png"}
            coverLetter={proposal.coverLetter || "No cover letter available"}
            jobTitle={proposal.jobTitle || "No job title"}
            status={proposal.proposalStatus || "Available"}
            isAuthenticatedUser={proposal.isAuthenticatedUser}
            onHire={() => handleHire(proposal)}
          />
        </div>
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
          {[...Array(totalPages).keys()].map((page) => (
            <span
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              className={currentPage === page + 1 ? "active" : ""}
            >
              {page + 1}
            </span>
          ))}
        </div>
        <span>Go to page</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => handlePageChange(parseInt(e.target.value))}
        />
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          →
        </button>
      </div>

      {isModalOpen && selectedProposal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Proposal Details</h2>
            <p><strong>Job Title:</strong> {selectedProposal.jobTitle}</p>
            <p><strong>Cover Letter:</strong> {selectedProposal.coverLetter}</p>
            <p><strong>Timeline:</strong> {selectedProposal.timeline}</p>
            <p><strong>Rate:</strong> {selectedProposal.rate}</p>
            <p><strong> Location:</strong> {localStorage.getItem('country')}</p>
            {/* <p><strong>Status:</strong> {selectedProposal.proposalStatus}</p> */}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;









// import React, { useState, useEffect } from "react";
// import { Header, Proposalscard } from "../../components/index";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useParams } from 'react-router-dom';

// import "./styles.scss";

// const IndexPage = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [proposals, setProposals] = useState([]);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const { jobId } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           navigate("/signin");
//           return;
//         }

//         const [profilesResponse, proposalsResponse] = await Promise.all([
//           axios.get("http://localhost:5000/api/freelancer/profile", {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           axios.get(`http://localhost:5000/api/freelancer/getproposals?jobId=${jobId}`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         ]);
//         console.log("Profiles Response:", profilesResponse.data);
//          console.log("Proposals Response:", proposalsResponse.data);
                
//         setProfiles(profilesResponse.data.data);
//         setProposals(proposalsResponse.data.proposals);
//       } catch (err) {
//         setError(`Error fetching data: ${err.message}`);
//       }
//     };

//     fetchData();
//   }, [jobId, navigate]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleRowsPerPageChange = (event) => {
//     setRowsPerPage(parseInt(event.target.value));
//     setCurrentPage(1);
//   };

//   const handleProposalClick = (proposal) => {
//     setSelectedProposal(proposal);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedProposal(null);
//   };

//   const handleHire = () => {
//     navigate("/offerform");
//   };

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   const indexOfLastProfile = currentPage * rowsPerPage;
//   const indexOfFirstProfile = indexOfLastProfile - rowsPerPage;
//   const totalPages = Math.ceil(proposals.length / rowsPerPage);

//   const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

//   return (
//     <div className="proposals-page">
//       <Header />
//       <h1 className="proposals-heading">Freelancer Profiles</h1>
//       <div className="profiles-container">
//         {currentProfiles.map((profile) => {
//           //Filter proposals that match the current profile and jobId
//           const relevantProposals = proposals.filter(
//             proposal => proposal.freelancerId === jobId
//           );

//           return relevantProposals.map((proposal) => (
//             <div key={profile._id} onClick={() => handleProposalClick(proposal)} className="profile-card">
//               <Proposalscard
//                 name={profile.name || ""}
//                 title={profile.experience?.title || ""}
//                 location={profile.location || "Not specified"}
//                 rate={profile.rate ? `$${profile.rate}/hr` : "Not specified"}
//                 earned={`$${profile.totalHours + (profile.totalJobs || 0)}+ earned`}
//                 timeline={proposal.timeline || "Not specified"}
//                 image={profile.image ? `http://localhost:5000${profile.image}` : "/images/Profile.png"}
//                 coverLetter={proposal.coverLetter || "No cover letter available"}
//                 jobTitle={proposal.jobTitle || "Not specified"}
//                 status="Available"
//                 onHire={() => handleHire(profile)}
//               />
//             </div>
//           ));
//         })}
//       </div>

//       <div className="pagination">
//         <span>Rows per page</span>
//         <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={15}>15</option>
//         </select>
//         <div className="page-controls">
//           {[...Array(totalPages).keys()].map((page) => (
//             <span
//               key={page + 1}
//               onClick={() => handlePageChange(page + 1)}
//               className={currentPage === page + 1 ? "active" : ""}
//             >
//               {page + 1}
//             </span>
//           ))}
//         </div>
//         <span>Go to page</span>
//         <input
//           type="number"
//           min={1}
//           max={totalPages}
//           value={currentPage}
//           onChange={(e) => handlePageChange(parseInt(e.target.value))}
//         />
//         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//           →
//         </button>
//       </div>

//       {isModalOpen && selectedProposal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Proposal Details</h2>
//             <p><strong>Job Title:</strong> {selectedProposal.jobTitle}</p>
//             <p><strong>Cover Letter:</strong> {selectedProposal.coverLetter}</p>
//             <p><strong>Timeline:</strong> {selectedProposal.timeline}</p>
//             <p><strong>Rate:</strong> {selectedProposal.rate}</p>
//             <p><strong>Location:</strong> {localStorage.getItem('country')}</p>
//             <button onClick={handleCloseModal}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IndexPage;


// // import React, { useState, useEffect } from "react";
// // import { Header, Proposalscard } from "../../components/index";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // import "./styles.scss";

// // const IndexPage = () => {
// //   const [profile, setProfile] = useState(null);
// //   const [proposals, setProposals] = useState([]);
// //   const [error, setError] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);
// //   const [selectedProposal, setSelectedProposal] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         console.log("Token:", token);

// //         if (!token) {
// //           setError("No authentication token found.");
// //           return;
// //         }

// //         const [profileResponse, proposalsResponse] = await Promise.all([
// //           axios.get("http://localhost:5000/api/freelancer/profile", {
// //             headers: { 'Authorization': `Bearer ${token}` }
// //           }),
// //           axios.get("http://localhost:5000/api/freelancer/getproposals", {
// //             headers: { 'Authorization': `Bearer ${token}` }
// //           })
// //         ]);

// //         console.log("Profile Response:", profileResponse.data);
// //         console.log("Proposals Response:", proposalsResponse.data);
        
// //         setProfile(profileResponse.data.data);
// //         setProposals(proposalsResponse.data.proposals);
// //       } catch (err) {
// //         console.error("Error fetching data:", err.response ? err.response.data : err.message);
// //         setError(`Error fetching data: ${err.message}`);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handlePageChange = (page) => {
// //     setCurrentPage(page);
// //   };

// //   const handleRowsPerPageChange = (event) => {
// //     setRowsPerPage(parseInt(event.target.value));
// //     setCurrentPage(1);
// //   };

// //   const handleProposalClick = (proposal) => {
// //     setSelectedProposal(proposal);
// //     setIsModalOpen(true);
// //   };

// //   const handleCloseModal = () => {
// //     setIsModalOpen(false);
// //     setSelectedProposal(null);
// //   };

// //   const handleHire = () => {
// //     navigate("/offerform");
// //   };

// //   if (error) {
// //     return <div className="error-message">{error}</div>;
// //   }

// //   const indexOfLastProposal = currentPage * rowsPerPage;
// //   const indexOfFirstProposal = indexOfLastProposal - rowsPerPage;
// //   const currentProposals = proposals.slice(indexOfFirstProposal, indexOfLastProposal);

// //   const totalPages = Math.ceil(proposals.length / rowsPerPage);

// //   return (
// //     <div className="proposals-page">
// //       <Header />
// //       <h1 className="proposals-heading">Proposals</h1>
// //       <div className="proposals-container">
// //         {currentProposals.map((proposal) => (
// //           <div key={proposal.id} onClick={() => handleProposalClick(proposal)}>
// //             <Proposalscard
// //               name={profile ? `${profile.name}` : ""}
// //                title={profile ? profile.title : ""}
// //               location={localStorage.getItem('country')}
// //               rate={proposal.rate}
// //               earned={profile ? `$${profile.totalHours + (profile.totalJobs || 0)}+ earned` : "$0 earned"}
// //               timeline={proposal.timeline}
// //               coverLetter={proposal.coverLetter}
// //               image={profile && profile.image ? `http://localhost:5000${profile.image}` : "/images/Profile.png"}
// //               jobTitle={proposal.jobTitle}
// //               status={proposal.proposalStatus}
// //               onHire={handleHire}
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <div className="pagination">
// //         <span>Rows per page</span>
// //         <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
// //           <option value={5}>5</option>
// //           <option value={10}>10</option>
// //           <option value={15}>15</option>
// //         </select>
// //         <div className="page-controls">
// //           {[...Array(totalPages).keys()].map((page) => (
// //             <span
// //               key={page + 1}
// //               onClick={() => handlePageChange(page + 1)}
// //               className={currentPage === page + 1 ? "active" : ""}
// //             >
// //               {page + 1}
// //             </span>
// //           ))}
// //         </div>
// //         <span>Go to page</span>
// //         <input
// //           type="number"
// //           min={1}
// //           max={totalPages}
// //           value={currentPage}
// //           onChange={(e) => handlePageChange(parseInt(e.target.value))}
// //         />
// //         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
// //           →
// //         </button>
// //       </div>

// //       {isModalOpen && selectedProposal && (
// //         <div className="modal">
// //           <div className="modal-content">
// //             <h2>Proposal Details</h2>
// //             <p><strong>Job Title:</strong> {selectedProposal.jobTitle}</p>
// //             <p><strong>Cover Letter:</strong> {selectedProposal.coverLetter}</p>
// //             <p><strong>Timeline:</strong> {selectedProposal.timeline}</p>
// //             <p><strong>Rate:</strong> {selectedProposal.rate}</p>
// //             <p><strong> Location:</strong> {localStorage.getItem('country')}</p>
// //             {/* <p><strong>Status:</strong> {selectedProposal.proposalStatus}</p> */}
// //             <button onClick={handleCloseModal}>Close</button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default IndexPage;