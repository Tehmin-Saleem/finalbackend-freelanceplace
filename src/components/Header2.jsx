import React, { useState, useEffect } from "react";
import JobDropdown from "../svg/Header/JobDropdwon";
import IconSearchBar from "../svg/Header/IconSearchBar";
import Notification from "../svg/Header/Notification";
import GreaterThan from "../svg/Header/GreaterThan";
import ProfileIcon from "../svg/Header/ClientFrame";
import Logo from "../svg/Header/Logo";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [hoveredOption, setHoveredOption] = useState("");
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };
  const handleSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };
    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-white shadow-md p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-4 relative">
        <div className="text-gradient font-poppins font-bold text-3xl ml-8 md:ml-20">
          <Logo width="100" height="100" />
        </div>
        <div className="relative flex items-center ml-8 md:ml-28">
          <h2 className="text-[20px] text-[#0F172A] font-Poppins font-medium cursor-pointer ml-4 md:ml-8">
            Find Work
          </h2>
          <div
            onClick={toggleDropdown}
            className="cursor-pointer ml-2 md:mr-10"
          >
            <JobDropdown />
          </div>
          {dropdownOpen && (
            <div className="absolute left-0 mt-28 bg-white shadow-lg rounded-lg z-10 w-28 max-h-36 overflow-y-auto origin-top-left">
              <ul>
                {[
                  "Post a Job",
                  "All Jobs Post",
                  "Add Payment",
                  "Privacy Policy",
                ].map((option) => (
                  <li
                    key={option}
                    className={`px-2 py-1 text-xs cursor-pointer ${
                      selectedOption === option
                        ? "bg-white text-[#4BCBEB]"
                        : "text-gray-800 hover:bg-white"
                    }`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHoveredOption(option)}
                    onMouseLeave={() => setHoveredOption("")}
                    style={{
                      color: hoveredOption === option ? "#4BCBEB" : "black",
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <h2 className="text-[20px] font-medium text-[#0F172A] font-Poppins ml-4 md:ml-8">
          Messages
        </h2>
      </div>

      <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto">
        <div className="flex items-center border rounded-2xl p-2 w-full md:w-auto md:mr-16">
          <IconSearchBar className="mr-2 md:mr-4" width="20" height="20" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none w-full ml-2 text-sm md:text-base"
          />
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <Notification className="mr-2 md:mr-4" width="20" height="20" />
          <ProfileIcon className="mr-2 md:mr-4" width="20" height="20" />
          <div className="flex flex-col text-sm md:text-base">
            <div className="font-Poppins font-bold">Sammar Zahra</div>
            <div className="text-gray-500">Status 200</div>
          </div>
          <div className="self-center">
            <GreaterThan width="20" height="20" />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
