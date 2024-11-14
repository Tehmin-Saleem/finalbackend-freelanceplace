// import React, { createContext, useState, useContext } from 'react';

// const JobStatusContext = createContext();

// export const useJobStatus = () => {
//   return useContext(JobStatusContext);
// };

// export const JobStatusProvider = ({ children }) => {
//   const [jobStatuses, setJobStatuses] = useState({});

//   const updateJobStatus = (jobPostId, status) => {
//     setJobStatuses(prevState => ({
//       ...prevState,
//       [jobPostId]: status,
//     }));
//   };

//   return (
//     <JobStatusContext.Provider value={{ jobStatuses, updateJobStatus }}>
//       {children}
//     </JobStatusContext.Provider>
//   );
// };
import React, { createContext, useState, useContext, useMemo } from 'react';

const JobStatusContext = createContext();

export const useJobStatus = () => {
  return useContext(JobStatusContext);
};

export const JobStatusProvider = ({ children }) => {
  const [jobStatuses, setJobStatuses] = useState({});
  const [isAnyProposalHired, setIsAnyProposalHired] = useState(false);

  const updateJobStatus = (proposalId, newStatus) => {
    setJobStatuses(prevStatuses => {
      const updatedStatuses = {
        ...prevStatuses,
        [proposalId]: newStatus
      };
      
      // Check if any proposal is hired in the updated statuses
      const hasHiredProposal = Object.values(updatedStatuses).some(
        status => status === 'hired'
      );
      
      // Update the hired status flag
      setIsAnyProposalHired(hasHiredProposal);
      
      return updatedStatuses;
    });
  };

  const value = useMemo(() => ({
    jobStatuses,
    updateJobStatus,
    isAnyProposalHired
  }), [jobStatuses, isAnyProposalHired]);

  return (
    <JobStatusContext.Provider value={value}>
      {children}
    </JobStatusContext.Provider>
  );
};