import React from "react";
import "./styles.scss";
import StarRating from "../starrating/index";

const UserReview = ({ name, location, description, rating, profileImage }) => {
  return (
    <div className="user-review">
      <div className="user-info">
        <img 
          src={profileImage || "/api/placeholder/40/40"} 
          alt={`${name}'s profile`} 
          className="user-image w-10 h-10 rounded-full object-cover"
        />
        <div className="user-details">
          <div className="name-info">
            <h3 className="user-name">{name}</h3>
            <StarRating rating={rating} />
          </div>
          <div className="location-info">
            <p className="user-location">{location}</p>
          </div>
        </div>
      </div>
      <p className="user-description">{description}</p>
    </div>
  );
};

export default UserReview;