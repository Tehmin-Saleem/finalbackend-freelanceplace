import React from "react";
import "./styles.scss"; // Import the CSS file

const ChatLoading = () => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="skeleton-item"></div>
      ))}
    </div>
  );
};

export default ChatLoading;
