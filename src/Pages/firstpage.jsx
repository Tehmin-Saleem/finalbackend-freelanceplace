import React from "react";
import ClientFrame from "../svg coponents/ClientFrame";
import RadioButton from "../svg coponents/RadioButton";
// Ensure this is the correct path to your CSS file

const SignUpSection = () => {
  return (
    <div className="container mx-auto p-4 ">
      {/* Main div */}
      <div className="bg-white shadow-md rounded-lg p-6 w-82.324%  h-61.5%  mx-[150px]  ">
        {/* Title name */}
        <h1 className="text-2xl font-Kodchasan text-gradient mb-4 font-3.2%">
          Freelancer Marketplace
        </h1>

        {/* Join as a Client or Freelancer section */}
        <div className="bg-gray-100 p-4   rounded-lg mb-6 w-68% h-66%  mx-[50px]">
          <h2 className="text-xl font-Poppins mb-4 text-[#0F172A] font-bold">
            Join as a Client or Freelancer
          </h2>

          <div className="flex flex-col md:flex-row md:space-x-4 w-68% h-29% mx-[50px]">
            {/* Client div */}
            <div
              className="bg-white shadow-sm rounded-lg  flex-1  md:mb-0 w-50% h-38% mx[30px]"
              style={{ height: "150px" }}
            >
              <div className="flex">
                <ClientFrame />
                <h3 className="text-lg font-medium mt-2 ml-2 ">Client</h3>
              </div>
              <p
                className="  text-sm font-[Poppins] text-[#6D7B8E]
]"
              >
                i’m a client, hiring
                <br />
                for a project.
              </p>
            </div>

            {/* Freelancer div */}
            <div
              className="bg-white shadow-sm rounded-lg  flex-1 mx-[30px] "
              style={{ height: "150px" }}
            >
              <h3 className="text-lg font-medium mb-2">Freelancer</h3>
              <p className="text-sm  font-[Poppins] text-[#6D7B8E]">
                i’m a freelancer,
                <br /> looking for work.
              </p>
            </div>
          </div>
        </div>

        {/* Create Account button */}
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignUpSection;
