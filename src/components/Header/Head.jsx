// import React, { useState, useEffect } from "react";
// import {
//   Logo,
//   ProfilePic,
//   GreaterThan,
//   Notification,
//   IconSearchBar,
//   JobDropdwon,
// } from "../../svg/index";
// import "./styles.scss";

// const Header = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("");
//   const [hoveredOption, setHoveredOption] = useState("");

//   const toggleDropdown = (e) => {
//     e.stopPropagation();
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleSelect = (option) => {
//     setSelectedOption(option);
//     setDropdownOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = () => {
//       setDropdownOpen(false);
//     };
//     if (dropdownOpen) {
//       window.addEventListener("click", handleClickOutside);
//     } else {
//       window.removeEventListener("click", handleClickOutside);
//     }
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, [dropdownOpen]);

//   return (
//     <header className="header">
//       <div className="header-left">
//         <div className="logo">
//           <Logo width="100" height="100" />
//         </div>
//         <div className="menu">
//           <h2 className="menu-title">Find Work</h2>
//           <div onClick={toggleDropdown} className="dropdown">
//             <JobDropdwon />
//           </div>
//           {dropdownOpen && (
//             <div className="dropdown-menu">
//               <ul>
//                 {[
//                   "Post a Job",
//                   "All Jobs Post",
//                   "Add Payment",
//                   "Privacy Policy",
//                 ].map((option) => (
//                   <li
//                     key={option}
//                     className={`dropdown-option ${
//                       selectedOption === option ? "selected" : ""
//                     }`}
//                     onClick={() => handleSelect(option)}
//                     onMouseEnter={() => setHoveredOption(option)}
//                     onMouseLeave={() => setHoveredOption("")}
//                     style={{
//                       color: hoveredOption === option ? "#4BCBEB" : "black",
//                     }}
//                   >
//                     {option}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <h2 className="menu-title-messages">Messages</h2>
//       </div>

//       <div className="header-right">
//         <div className="search-bar">
//           <IconSearchBar className="search-bar-icon" width="20" height="20" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="search-bar-input"
//           />
//         </div>
//         <div className="user-info">
//           <Notification className="user-info-icon" width="20" height="20" />
//           <ProfilePic className="user-info-icon" width="20" height="20" />
//           <div className="user-info-text">
//             <div className="user-info-name">Sammar Zahra</div>
//             <div className="user-info-status">Status 200</div>
//           </div>
//           <div className="user-info-icon-greater">
//             <GreaterThan width="20" height="20" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



import React, { useState, useEffect } from "react";

import {
  Logo,
  ProfilePic,
  GreaterThan,
  Notification,
  IconSearchBar,
  JobDropdwon,
} from "../../svg/index";
import "./styles.scss";
import {jwt_decode} from 'jwt-decode'; // Import jwt-decode to decode the token

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user data from local storage
    localStorage.removeItem('user');  // Remove specific item (user data)
    // Or use localStorage.clear() to remove everything
    // localStorage.clear();

    // Redirect to login or home page
    navigate('/login');
  };
  
 const handleLogoClick = () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (token) {
      try {
        const decodedToken = jwt_decode(token); // Decode the token to get user information
        const role = decodedToken.role; // Extract the role

        // Navigate to the appropriate dashboard based on the user role
        if (role === 'client') {
          navigate('/ClientDashboard'); // Navigate to client dashboard
        } else if (role === 'freelancer') {
          navigate('/FreelanceDashBoard'); // Navigate to freelancer dashboard
        } else {
          navigate('/signin'); // Redirect to signin if role is unknown
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        navigate('/signin'); // Redirect to signin if token decoding fails
      }
    } else {
      navigate('/signin'); // Redirect to signin if no token is found
    }
  };



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


//     <div className="menu">
// //           <h2 className="menu-title">Find Work</h2>
// //           <div onClick={toggleDropdown} className="dropdown">
// //             <JobDropdwon />
// //           </div>




    <header className="header">
      <div className="header-left">
      
        <div className="logo" >
          <Logo  onClick={handleLogoClick}/>
        </div>
        
        <div className="menu">
          <div className="menu-item dropdown" onClick={toggleDropdown}>
            Jobs
            <div>
            <JobDropdwon />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  {["Post a Job", "All Jobs Post", "Add Payment", "Privacy Policy"].map((option) => (
                    <li
                      key={option}
                      className={`dropdown-option ${
                        selectedOption === option ? "selected" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHoveredOption(option)}
                      onMouseLeave={() => setHoveredOption("")}
                      style={{
                        color: hoveredOption === option ? "#4BCBEB" : "#0F172A",
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="menu-item">Message</div>
        </div>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <IconSearchBar />
          <input type="text" placeholder="Search" />
        </div>
        <div className="user-info">
          <div className="icon">
            <Notification />
          </div>
          <div className="icon">
            <ProfilePic />
          </div>
          <div className="user-details">
            <div className="user-name">Usman Shahid</div>
            <div className="user-status">Status 200</div>
          </div>
          <div className="greater-than">
            <GreaterThan />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
