import React from "react";
import Header from "../../components/Common/Header"; // Adjust the import path as necessary
import errorImage from "/images/Errorimage.png"; // Adjust the import path as necessary
import "./styles.scss";

const ErrorPage = () => {
  return (
    <div className="error-page">
      <Header />
      <div className="error-content">
        <img src={errorImage} alt="Error" className="error-image" />
      </div>
    </div>
  );
};

export default ErrorPage;
