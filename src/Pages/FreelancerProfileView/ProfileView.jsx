import React, { useState } from "react";
import NewHeader from "../../components/NewHeader";
import Profile from "/images/Profile.png";
import "./ProfileView.scss"; // Import the Sass file
import CommonButton from "../../components/CommonButton";
import JobSucces from "../../svg/ProfileView/JobSucces";
import Star from "../../svg/ProfileView/Star";
import Chat from "../../svg/ProfileView/Chat";
import Port1 from "/images/Port1.png";
import Carousel from "../../components/Carousel";

function ProfileView() {
  // Define state variables
  // Define state variables
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === portfolioItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? portfolioItems.length - 1 : prevIndex - 1
    );
  };

  // Define portfolio items
  const portfolioItems = [
    {
      id: 1,
      image: Port1,
      title: "Enable Life Care",
      description: "Figma UX/UI Design",
    },
    // Add more portfolio items as needed
  ];
  // Define state variables
  const [profileData, setProfileData] = useState({
    name: "Sammar Zahra",
    location: "Lahore, Punjab, Pakistan",
    jobSuccess: 96,
    rate: "Top Rated",
    skills: ["Mobile App Design", "Wireframe", "Mockup", "Figma", "New Skill"],
    totalJobs: 10,
    totalHours: 200,
    experience: {
      title: "UI/UX Designer| Figma Expert| Graphic Designer",
      description:
        "Are you looking to create memorable and user-centric digital experiences? Your search ends here! I am a highly skilled and innovative UX UI designer, Graphic designer, and WordPress designer from Bangladesh, ready to revolutionize your projects. With a deep passion for creating outstanding user experiences and effective visuals, I guarantee top-notch results that will leave a lasting impression.",
    },
  });

  return (
    <div>
      <NewHeader />

      <div className=" m-20 p-8">
        <div className="border border-[#94A3B8] rounded-md p-4 mb-8">
          {/* Upper Part */}
          <div className="flex items-center mb-16 pl-8 ">
            <img
              src={Profile}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex flex-col">
              <div className="font-Poppins text-[#4BCBEB] text-[32px]">
                {profileData.name}
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-9a1 1 0 100 2 1 1 0 000-2zm0 16a1 1 0 100 2 1 1 0 000-2zm8-11a1 1 0 011 1v2a1 1 0 11-2 0V7a1 1 0 011-1zm-14 0a1 1 0 011 1v2a1 1 0 11-2 0V7a1 1 0 011-1zm14 8a1 1 0 100 2 1 1 0 000-2zM7 17a1 1 0 100 2 1 1 0 000-2zm6-2a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#2C3E50] text-[20px] font-Poppins mb-5">
                  {profileData.location}
                </span>
              </div>

              <div className="flex">
                {/* SVG icon and text for Job Success */}
                <div className="flex items-center ">
                  <JobSucces className=" h-3 w-3" />
                  <div className="text-[#2C3E50] text-[14px] font-Poppins ml-4 w-32">
                    {profileData.jobSuccess}% Job Success
                  </div>
                </div>
                {/* SVG icon and text for Top Rated */}
                <div className="flex items-center">
                  <Star className="h-3 w-3" />
                  <div className="text-[#2C3E50] text-[14px] font-Poppins ml-4 w-32">
                    {profileData.rate}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between  ml-[50%] pr-5">
              <CommonButton
                text={<Chat />}
                className=" bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex items-center justify-between  ">
              <CommonButton
                text="  Hire"
                className=" bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          {/* Border between upper and lower part */}
          <hr className="border-t border-[#94A3B8] mb-4" />

          {/* Lower Part */}
          <div className="flex">
            {/* Left Side */}
            <div className=" w-1/3 border-r border-[#94A3B8] rounded-md p-4 mb-4 mr-4">
              <h2 className=" text-[24px] font-Poppins text-[#2C3E50] mb-4 font-medium">
                View Profile
              </h2>

              <h2 className="font-Poppins text-[20px] text-[#2C3E50] mb-6 font-medium">
                Skills:
              </h2>
              <div className="flex flex-wrap mb-6">
                {profileData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="border border-[#94A3B8] rounded-2xl p-2 mr-2 mb-2 text-[14px] text-[#94A3B8] font-Poppins"
                  >
                    {skill}
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-[#2C3E50] text-[20px] font-Poppins font-medium mb-6">
                  Experience:
                </h2>
                <div className="mb-2 flex flex-row  text-center">
                  <div className="mr-6 flex flex-col">
                    <span className="text-[24px] text-[#2C3E50] font-Poppins">
                      {profileData.totalJobs}
                    </span>
                    <span className="font-Poppins text-[#94A3B8] text-[16px]">
                      Total Jobs
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[24px] text-[#2C3E50] font-Poppins">
                      {profileData.totalHours}
                    </span>
                    <span className="font-Poppins text-[#94A3B8] text-[16px]">
                      Total Hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="Outer">
              <h2 className="Profiletitle">{profileData.experience.title}</h2>
              <div>
                <p className="ProfileDescription">
                  {profileData.experience.description}
                </p>
              </div>

              {/* Portfolio Section */}
              <div className="PortfolioSection">
                <h2 className="PortfolioTitle">Portfolio</h2>
                <Carousel
                  cards={portfolioItems}
                  currentIndex={currentIndex}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                />
                <div className="Carousel">
                  {/* Individual portfolio cards go here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
