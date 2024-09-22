import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";

import {
  UserReview,
  CommonButton,
  Header,
} from "../../components/index";

import {
  Australia,
  UStates,
  SArabia,
  Chat,
  Star,
  JobSucces,
} from "../../svg/index";

function ProfileView() {
  const [profileData, setProfileData] = useState(null);
  // const [portfolioData, setportfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("");
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/freelancer/profile', {
          headers: {
           'Authorization': `Bearer ${token}`
          }
        });
        setProfileData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
    setCountry(localStorage.getItem("country") || "Not specified");
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>No profile data found</div>;

console.log('Profile image path:', `http://localhost:5000${profileData.image}`);
console.log('Profile data:', profileData.image);
console.log('Portfolio path:', `http://localhost:5000/api/freelancer/profile/portfolios/${profileData.attachment}`);

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
      <Header />
      <div className="m-20 p-8 absolute">
        <div className="upper-part">
          <div className="container">
          <div className="flex items-center mb-16 pl-8">
  <img
    src={`http://localhost:5000${profileData.image}`}
    alt={profileData.name}
    className="w-18 h-20 rounded-full  aspect-square"
  />


              <div className="flex flex-col">
                <div className="font-Poppins text-[#4BCBEB] text-[32px] name">
                  {profileData.name}
                </div>
                <div className="flex items-center">
                  {/* <svg
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
                  </svg> */}
                  <div className="text-[#2C3E50] text-[20px] font-Poppins mb-5 location">
                    {country}
                  </div>
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
                  text="Edit"
                  className="bg-[#4BCBEB] text-[18px] font-Poppins text-[#FFFFFF] rounded-lg font-semibold font-Poppins py-2 px-6 w-full focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          <hr className="border-line" />

          <div className="flex flex-container">
            <div className="LeftSide w-1/3 border-r border-[#94A3B8] rounded-md p-4 mb-4 mr-4">
              <h2 className="text-[24px] font-Poppins text-[#2C3E50] mb-4 font-medium">
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
                      Completed Jobs
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

            <div className="RightSide Outer">
              <div className="top">
                <h2 className="Profiletitle">{profileData.experience.title}</h2>
                <div>
                  <p className="ProfileDescription">
                    {profileData.experience.description}
                  </p>
                </div>
              </div>

              <div className="PortfolioSection">
        <h2 className="PortfolioTitle">Portfolio</h2>
        <div className="grid grid-cols-3 gap-4">
          {profileData.portfolios.map((portfolio, index) => (
            <div key={index} className="border rounded p-4">
              {portfolio.attachment && (
                getFileExtension(portfolio.attachment).toLowerCase() === 'pdf' ? (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-200 mb-2">
                    <a 
                      href={`http://localhost:5000/api/freelancer/profile/portfolios/${encodeURIComponent(portfolio.attachment)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View 
                    </a>
                  </div>
                ) : (
                  <img 
                    src={`http://localhost:5000/api/freelancer/profile/portfolios/${encodeURIComponent(portfolio.attachment)}`}
                    alt={portfolio.project_title} 
                    className="w-full h-40 object-cover mb-2" 
                  />
                )
              )}
              <h3 className="font-Poppins text-[16px] text-[#2C3E50]">{portfolio.project_title}</h3>
             
            </div>
          ))}
        </div>
      </div>

              <div className="">
                <div className="review">
                  <h2 className="reviewtitle">Reviews</h2>
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

