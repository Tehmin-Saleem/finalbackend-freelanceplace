import React, { useState } from "react";
import NewHeader from "../../components/Header/NewHeader";
import Profile from "/images/Profile.png";
import "./styles.scss"; // Import the Sass file
import CommonButton from "../../components/common/CommonButton";
import JobSucces from "../../svg/ProfileView/JobSucces";
import Star from "../../svg/ProfileView/Star";
import Chat from "../../svg/ProfileView/Chat";
import Port1 from "/images/Port1.png";
import Port2 from "/images/Port2.png";
import Port3 from "/images/Port3.png";
import Carousel from "../../components/Carousel/Carousel";
import UserReview from "../../components/ProfileView/UserReviews/UserReview"; // Import the UserReview component
import Australia from "../../svg/ProfileView/Australia";
import UStates from "../../svg/ProfileView/UStates";
import SArabia from "../../svg/ProfileView/SArabia";

function ProfileView() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define portfolio items
  const portfolioItems = [
    {
      id: 1,
      image: Port1,
      title: "Enable Life Care",
      description: "(Figma UX/UI Design)",
    },
    {
      id: 2,
      image: Port2,
      title: "Machine Peddler",
      description: "(Figma UX/UI Design)",
    },
    {
      id: 3,
      image: Port3,
      title: "Smart survey",
      description: "(Figma UX/UI Design)",
    },
    {
      id: 4,
      image: Port1,
      title: "Enable Life Care",
      description: "(Figma UX/UI Design)",
    },
    {
      id: 5,
      image: Port1,
      title: "Enable Life Care",
      description: "(Figma UX/UI Design)",
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

  const userReviews = [
    {
      id: 1,
      name: "Usman Shahid",
      location: "Australia",
      description:
        "Lorem ipsum dolor sit amet consectetur. Dictum blandit turpis hac elit nunc vitae quis adipiscing. Eu pellentesque a curabitur facilisi velit est vestibulum laoreet diam.",
      rating: 3,
      locationIcon: <Australia />,
    },
    {
      id: 2,
      name: "Aqib Ali",
      location: "United States",
      description:
        "Lorem ipsum dolor sit amet consectetur. Dictum blandit turpis hac elit nunc vitae quis adipiscing. Eu pellentesque a curabitur facilisi velit est vestibulum laoreet diam.",
      rating: 5,
      locationIcon: <UStates />,
    },
    {
      id: 3,
      name: "Shehroz Mubarik",
      location: "Saudi Arabia",
      description:
        "Lorem ipsum dolor sit amet consectetur. Dictum blandit turpis hac elit nunc vitae quis adipiscing. Eu pellentesque a curabitur facilisi velit est vestibulum laoreet diam.",
      rating: 4,
      locationIcon: <SArabia />,
    },
    // Add more user reviews as needed
  ];

  return (
    <div>
      <NewHeader />
      {/* border border-[#94A3B8] rounded-md p-4 mb-8 */}
      <div className="m-20 p-8 absolute">
        <div className="upper-part">
          {/* Upper Part */}

          <div className=" container">
            <div className="flex items-center mb-16 pl-8">
              <img
                src={Profile}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <div className="font-Poppins text-[#4BCBEB] text-[32px] name">
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
                  <span className="text-[#2C3E50] text-[20px] font-Poppins mb-5 location">
                    {profileData.location}
                  </span>
                </div>

                <div className="flex">
                  <div className="flex items-center">
                    <JobSucces className="h-3 w-3" />
                    <div className="text-[#2C3E50] text-[14px] font-Poppins ml-4 w-32">
                      {profileData.jobSuccess}% Job Success
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3" />
                    <div className="text-[#2C3E50] text-[14px] font-Poppins ml-4 w-32">
                      {profileData.rate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between buttons ml-[50%] pr-5">
                <CommonButton
                  text={<Chat />}
                  className="bg-[#FFFFFF] border border-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-1 px-6 w-full focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex items-center justify-between buttons">
                <CommonButton
                  text="Hire"
                  className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          {/* Border between upper and lower part */}
          <hr className="border-line" />

          {/* Lower Part */}
          <div className=" flex flex-container">
            {/* Left Side */}
            <div className="LeftSide w-1/3 border-r border-[#94A3B8] rounded-md p-4 mb-4 mr-4">
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
            <div className="RightSide Outer">
              <div className="top">
                <h2 className="Profiletitle">{profileData.experience.title}</h2>
                <div>
                  <p className="ProfileDescription">
                    {profileData.experience.description}
                  </p>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="PortfolioSection">
                <h2 className="PortfolioTitle">Portfolio</h2>
                <Carousel cards={portfolioItems} />
              </div>

              {/* Reviews Section */}
              <div className="">
                <div className="review">
                  <h2 className="reviewtitle">Reviews</h2>
                  {/* Map through user reviews and render each one */}
                  {userReviews.map((review) => (
                    <UserReview
                      key={review.id}
                      name={review.name}
                      location={review.location}
                      description={review.description}
                      rating={review.rating}
                      locationIcon={review.locationIcon}
                    />
                  ))}
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
