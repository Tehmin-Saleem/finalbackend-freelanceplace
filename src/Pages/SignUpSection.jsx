import React, { useState } from "react";
import ClientFrame from "../svg coponents/ClientFrame"; // Assume this is the SVG component for the client
import FreelancerFrame from "../svg coponents/FreelancerFrame";
// import ProjectName from "../svg coponents/ProjectName";

const SignUpSection = () => {
  const [selectedUserType, setSelectedUserType] = useState("");

  const handleChange = (e) => {
    setSelectedUserType(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 md:p-20">
      {/* Main div */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mx-auto ">
        {/* Title name */}
        <div
          className="text-center mb-4 text-gradient font-[Poppins] text-[32px] "
          style={{
             fontFamily: "kodchasan",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "41.6px",
            letterSpacing: "0.2em",
            textAlign: "center",
          }}
        >
          Freelance Marketplace
          {/* <ProjectName/> */}
        </div>

        {/* Join as a Client or Freelancer section */}
        <div className="bg-white p-4 rounded-lg mb-10">
          <h2 className="font-poppins mb-4 text-center  text-[#0F172A] text-[20px] md:text-[28px]">
            Join as a Client or Freelancer
          </h2>

          <div className="flex flex-col md:flex-row md:space-x-4 md:mx-20">
            {/* Client div */}
            <div
              className={`bg-white shadow-lg rounded-lg p-6 mt-8 relative ${
                selectedUserType === "client" ? "ring-2 ring-[#4BCBEB]" : ""
              } mb-4 md:mb-0 w-full md:w-1/2`}
            >
              <input
                type="radio"
                name="userType"
                value="client"
                id="client"
                className="absolute top-8 right-10 bg-[#4BCBEB]"
                onChange={handleChange}
                checked={selectedUserType === "client"}
                required
              />
              <div className="flex items-center md:items-start">
                <ClientFrame className="mr-2 md:mr-4" />
                <label
                  htmlFor="client"
                  className="text-xs md:text-lg font-medium ml-2"
                >
                  Client
                </label>
              </div>
              <p className="text-sm font-poppins text-[#6D7B8E] mt-2">
                I’m a client, hiring
                <br />
                for a project.
              </p>
            </div>

            {/* Freelancer div */}
            <div
              className={`bg-white shadow-lg rounded-lg p-6 mt-8 relative ${
                selectedUserType === "freelancer" ? "ring-2 ring-[#4BCBEB]" : ""
              } w-full md:w-1/2`}
            >
              <input
                type="radio"
                name="userType"
                value="freelancer"
                id="freelancer"
                className="absolute top-8 right-10 bg-[#4BCBEB]"
                onChange={handleChange}
                checked={selectedUserType === "freelancer"}
                required
              />
              <div className="flex items-center md:items-start">
                <FreelancerFrame className="mr-2 md:mr-4" />
                <label
                  htmlFor="freelancer"
                  className="text-xs md:text-lg font-medium ml-2"
                >
                  Freelancer
                </label>
              </div>
              <p className="text-sm font-poppins text-[#6D7B8E] mt-2">
                I’m a freelancer,
                <br />
                looking for work.
              </p>
            </div>
          </div>
        </div>

        {/* Create Account button */}
        <div className="flex flex-col items-center">
          <button className="bg-[#4BCBEB] text-white py-2 px-6 md:px-10 rounded-lg hover:bg-[#4BCBEB] transition w-full md:w-48">
            Create Account
          </button>
          <p className="mt-2 text-sm text-gray-500 font-poppins text-center">
            Already have an account?{" "}
            <a href="#" className="text-[#4BCBEB] hover:underline font-bold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;
