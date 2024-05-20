import React from 'react';
import Header from '../components/Header'; // Adjust the import path as needed
import Illustration from '/images/Illustration.png'; // Adjust the image path as needed
import BackgroundLining from '../svg coponents/BackgroundLining';

const DashboardPage = () => {
  return (
    <div className="min-h-screen  bg-gray-100 flex flex-col">
      {/* Importing Header Component */}
      <Header />

      {/* Main Content */}
      <main className="pt-10 pl-8 pb-0 flex-grow flex flex-col md:flex-row  ">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-16 relative">
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-start">
            <h1 className="text-2xl md:text-5xl font-Kodchasan mb-4 mt-24 ml-16 text-[#2C3E50] ">
              Welcome, Usman!
              <br />
              Let's start with
              <br />
              your first job post.
            </h1>
            <p className="mb-6 text-lg md:text-xl text-[#64748B] mt-4 ml-16">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <button className="bg-[#4BCBEB] text-center ml-16 md:ml-32 mt-6 text-white py-2 px-8 rounded-lg hover:bg-[#4BCBEB] transition duration-300">
              Get start job posting
            </button>
          </div>
          <BackgroundLining className=" md:w-auto md:h-auto" />
        </div>

        {/* Right Section */}
        <div className="hidden md:block w-full md:w-1/2 p-4 flex items-center justify-center">
          <img src={Illustration} alt="Placeholder" className="w-[80%] md:max-w-[50%] h-auto item-center ml-28 mt-16" />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
