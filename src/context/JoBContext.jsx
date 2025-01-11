
import React, { createContext, useState, useContext } from 'react';

const JobContext = createContext(undefined);

export const JobProvider = ({ children }) => {
  const [jobCounts, setJobCounts] = useState({
    completedJobCount: 0,
    ongoingJobCount: 0
  });

  const value = {
    jobCounts,
    setJobCounts
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
