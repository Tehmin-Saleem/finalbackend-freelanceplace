import React from "react";
import Header from "../../components/Header";
import NewHeader from "../../components/NewHeader";
import Profile from "/images/Profile.png";
import Edit from "../../svg/ProfileView/Edit";

function ProfileView() {
  return (
    <div>
      <NewHeader />

      <div className=" m-20 px-8 py-8">
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
                Sammar Zahra
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
                <span className="text-[#2C3E50] text-[20px] font-Poppins">
                  Lahore, Punjab, Pakistan
                </span>
              </div>
            </div>
            <button className=" ml-[69%] flex items-center bg-[#4BCBEB] text-white py-1 px-2 rounded-lg">
              <Edit width="10" />
            </button>
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
                <div className="border border-[#94A3B8] rounded-2xl p-2 mr-2 mb-2 text-[14px] text-[#94A3B8] font-Poppins">
                  Mobile App Design
                </div>
                <div className="border border-[#94A3B8] rounded-2xl p-2 mr-2 mb-2 text-[14px] text-[#94A3B8] font-Poppins">
                  Wireframe
                </div>
                <div className="border border-[#94A3B8] rounded-2xl p-2 mr-2 mb-2 text-[14px] text-[#94A3B8] font-Poppins">
                  Mockup
                </div>
                <div className="border border-[#94A3B8] rounded-2xl p-2 mr-2 mb-2 text-[14px] text-[#94A3B8] font-Poppins">
                  Figma
                </div>
              </div>

              <div>
                <h2 className="text-[#2C3E50] text-[20px] font-Poppins font-medium mb-6">
                  Experience:
                </h2>
                <div className="mb-2 flex flex-row  text-center">
                  <div className="mr-6 flex flex-col">
                    <span className="text-[24px] text-[#2C3E50] font-Poppins">
                      10
                    </span>
                    <span className="font-Poppins text-[#94A3B8] text-[16px]">
                      Total Jobs
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[24px] text-[#2C3E50] font-Poppins">
                      200
                    </span>
                    <span className="font-Poppins text-[#94A3B8] text-[16px]">
                      Total Hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="w-3/10 border-b border-gray-300 rounded-md p-4 mb-4">
              <h2 className="font-bold mb-4">Experience</h2>
              <div>
                <h3 className="font-bold mb-2">UI/UX Designer, Figma Expert</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus convallis metus nec sagittis mattis. Fusce vulputate
                  mi sed nunc malesuada, non ullamcorper leo ultricies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
