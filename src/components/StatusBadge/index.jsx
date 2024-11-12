import React from 'react';
import './styles.scss';

const StatusBadge = ({ status, jobStatus }) => {
  const getStatusDisplay = () => {
    if (status === "completed" || jobStatus === "completed") {
      return { text: "Completed", color: "#4CAF50" };
    }
    if (status === "hired" && (jobStatus === "pending" || jobStatus === "ongoing")) {
      return { text: "Ongoing", color: "#2196F3" };
    }
    if (status === "pending") {
      return { text: "Pending", color: "#FFC107" };
    }
    return { text: "Unknown", color: "#9E9E9E" };
  };

  const { text, color } = getStatusDisplay();

  return (
    <div 
      className="status-badge"
      style={{ 
        backgroundColor: color,
        padding: "4px 8px",
        borderRadius: "12px",
        color: "white",
        fontSize: "12px",
        fontWeight: "500"
      }}
    >
      {text}
    </div>
  );
};

export default StatusBadge;