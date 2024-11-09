import React, { createContext, useState, useContext } from 'react';

const JobStatusContext = createContext();

export const useJobStatus = () => {
  return useContext(JobStatusContext);
};

export const JobStatusProvider = ({ children }) => {
  const [jobStatuses, setJobStatuses] = useState({});

  const updateJobStatus = (jobPostId, status) => {
    setJobStatuses(prevState => ({
      ...prevState,
      [jobPostId]: status,
    }));
  };

  return (
    <JobStatusContext.Provider value={{ jobStatuses, updateJobStatus }}>
      {children}
    </JobStatusContext.Provider>
  );
};
