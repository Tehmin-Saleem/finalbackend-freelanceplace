import React from "react";
import "./styles.scss"; // Import CSS for styling

const UserListItems = ({ user, handleFunction }) => {
  return (
    <div className="user-list-item" onClick={handleFunction}>
      <img src={user.profilepic} alt={user.first_name} className="user-avatar" />
      <div className="user-details">
        <h4>{user.first_name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItems;
