import React from "react";
// import UserImage from "../../images/Profile.png";
import UserImage from "../../../images/Profile.png";
import "./styles.scss";
import StarRating from "../starrating/index";

const UserReview = ({ name, location, description, rating, locationIcon }) => {
  return (
    <div className="user-review">
      <div className="user-info">
        <img src={UserImage} alt="User" className="user-image" />
        <div className="user-details">
          <div className="name-info">
            <h3 className="user-name">{name}</h3>
            <StarRating rating={rating} />
          </div>
          <div className="location-info">
            {locationIcon}
            <p className="user-location">{location}</p>
          </div>
        </div>
      </div>
      <p className="user-description">{description}</p>
    </div>
  );
};

export default UserReview;
