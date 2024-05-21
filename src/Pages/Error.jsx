import React from "react";
import Header from "../components/Header"; // Adjust the import path as necessary
import errorImage from "/images/Errorimage.png"; // Adjust the import path as necessary

const ErrorPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <img src={errorImage} alt="Error" className="max-w-sm max-h-full" />
      </div>
    </div>
  );
};

export default ErrorPage;
