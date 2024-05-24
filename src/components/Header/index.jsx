import React, { useState, useEffect } from "react";
import JobDropdown from "../../svg coponents/JobDropdwon";
import IconSearchBar from "../../svg coponents/IconSearchBar";
import Notification from "../../svg coponents/Notification";
import GreaterThan from "../../svg coponents/GreaterThan";
import ProfileIcon from "../../svg coponents/ClientFrame";

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
        <div className="text-gradient font-poppins font-bold text-3xl ml-8 md:ml-32">
          L o g o
        </div>
        <div className="relative flex items-center ml-8 md:ml-28">
          <h2 className="text-lg font-bold cursor-pointer ml-12">Jobs</h2>
          <div onClick={toggleDropdown} className="cursor-pointer ml-2">
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
        <h2 className="text-xl text-black font-bold ml-16 md:ml-8">Messages</h2>
      </div>
      <div className="flex items-center space-x-4 mt-4 md:mt-0 w-full md:w-auto">
        <div className="flex items-center border rounded-full p-2 w-full md:w-auto">
          <IconSearchBar className="mr-4" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none w-full ml-2"
          />
        </div>
        <ProfileIcon className="ml-4" /> {/* Profile icon moved here */}
        <Notification className="ml-4" />
        <div className="flex flex-col items-center">
          <div className="font-bold">Sammar Zahra</div>
          <div className="text-sm text-gray-500">Status 200</div>
        </div>
        <GreaterThan className="ml-4 self-center" />{" "}
        {/* Positioned GreaterThan icon */}
      </div>
    </header>
  );
};

export default Header;
