import React from "react";
import Header from "../../components/Common/Header"; // Adjust the import path as needed
import Illustration from "/images/Illustration.png"; // Adjust the image path as needed
import { BackgroundLining } from "../../svg components/index";
import "./styles.scss";

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      {/* Importing Header Component */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        {/* Left Section */}
        <div className="left-section">
          <div className="left-content">
            <h1 className="welcome-text">
              Welcome, Usman!
              <br />
              Let's start with
              <br />
              your first job post.
            </h1>
            <p className="description-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="start-button">Get start job posting</button>
          </div>
          <BackgroundLining className="background-lining" />
        </div>

        {/* Right Section */}
        <div className="right-section">
          <img src={Illustration} alt="Placeholder" className="illustration" />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
