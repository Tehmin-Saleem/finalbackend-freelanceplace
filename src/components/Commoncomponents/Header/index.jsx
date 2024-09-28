// import React, { useEffect, useState } from "react";
// import { proxy, useSnapshot } from "valtio";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// import {
//   JobsDropdwon,
//   IconSearchBar,
//   Notification,
//   Logo,
// } from "../../../svg/index";
// import "./styles.scss";

// const state = proxy({
//   profile: {
//     first_name: "",
//     last_name: "",
//     image: "",
//   },
//   dropdownOpen: false,
//   selectedOption: "",
//   hoveredOption: "",
// });

// const Header = () => {
//   // const profileId = localStorage.getItem("profileId");
//   const snap = useSnapshot(state);
//   const navigate = useNavigate();
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [userType, setUserType] = useState('');

//   const handleLogout = () => {
//     // Clear the user data from local storage
//     localStorage.removeItem('user');  // Remove specific item (user data)
//     // Or use localStorage.clear() to remove everything
//     // localStorage.clear();

//     // Redirect to login or home page
//     navigate('/login');
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/freelancer/profile", {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         state.profile = response.data.data;
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
    
//     // Retrieve user type from local storage
//     const type = localStorage.getItem("userType");
//     setUserType(type);
//   }, []);

//   const toggleDropdown = (e, dropdownType) => {
//     e.stopPropagation();
//     if (dropdownType === "jobs") {
//       state.dropdownOpen = !state.dropdownOpen;
//       setProfileDropdownOpen(false);
//     } else if (dropdownType === "profile") {
//       setProfileDropdownOpen(!profileDropdownOpen);
//       state.dropdownOpen = false;
//     }
//   };

//   const handleSelect = (option) => {
//     state.selectedOption = option;
//     state.dropdownOpen = false;
  
//     if (option === "Explore Jobs") {
//       navigate("/matchingjobs");
//     } else if (option === "Post a Job") {
//       navigate("/jobPosting");
//     } else if (option === "All Jobs Post") {
//       navigate("/alljobs");
//     }
//   };
  

//   const handleProfileOption = async (option) => {
//     setProfileDropdownOpen(false);
//     if (option === "PROFILE") {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/freelancer/profile", {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         navigate('/profile', { state: { profileData: response.data.data } });
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     } else if (option === "LOGOUT") {
//       localStorage.removeItem("token");
//       localStorage.removeItem("firstName");
//       localStorage.removeItem("lastName");
//       localStorage.removeItem("userType");
//       navigate("/signup");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = () => {
//       state.dropdownOpen = false;
//       setProfileDropdownOpen(false);
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const getInitials = (firstName, lastName) => {
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
//   };
//   const firstName = localStorage.getItem("firstName");
//   const lastName = localStorage.getItem("lastName");
  
//   const initials = firstName && lastName
//     ? getInitials(firstName, lastName)
//     : "";

//   // Define dropdown options based on user type
//   const dropdownOptions = userType === "client"
//     ? ["Post a Job", "All Jobs Post", "Add Payment", "Privacy Policy"]
//     : ["Explore Jobs", "Add Payment", "Privacy Policy"];

//   return (
//     <header className="header">
//       <div className="header-top">
//         <div className="logo">
//           <Logo width="100" height="40" />
//         </div>
//         <div className="dropdown-container">
//           <h2 className="find-work">{userType === "client" ? "Find Talent" : "Find Work"}</h2>
//           <div onClick={(e) => toggleDropdown(e, "jobs")} className="dropdown-toggle">
//             <JobsDropdwon />
//           </div>
//           {snap.dropdownOpen && (
//             <div className="dropdown-menu">
//               <ul>
//                 {dropdownOptions.map((option) => (
//                   <li
//                     key={option}
//                     className={`dropdown-item ${snap.selectedOption === option ? "selected" : ""}`}
//                     onClick={() => handleSelect(option)}
//                     onMouseEnter={() => state.hoveredOption = option}
//                     onMouseLeave={() => state.hoveredOption = ""}
//                     style={{
//                       color: snap.hoveredOption === option ? "#4BCBEB" : "black",
//                     }}
//                   >
//                     {option}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <Link to="/chat">
//   <h2 className="messages">Messages</h2>
// </Link>

//       </div>
//       <div className="header-bottom">
//         <div className="search-bar">
//           <IconSearchBar className="search-icon" width="20" height="20" />
//           <input type="text" placeholder="Search" className="search-input" />
//         </div>
//         <div className="icon">
//   <Link to="/notifications">
//     <Notification className="icon" width="20" height="20" />
//   </Link>
// </div>
       
//         <div className="user-info">
//           <div 
//             className="profile-dropdown"
//             onClick={(e) => toggleDropdown(e, "profile")}
//           >
//             <div className="profile-image-container">
//               <div className="profile-initials-circle">
//                 {initials}
//               </div>
//             </div>
//             {profileDropdownOpen && (
//               <div className="profile-dropdown-menu">
//                 <ul>
//                   {["PROFILE", "LOGOUT"].map((option) => (
//                     <li
//                       key={option}
//                       onClick={() => handleProfileOption(option)}
//                     >
//                       {option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;








// =====================================================================================================
// import React, { useEffect, useState } from "react";
// import { proxy, useSnapshot } from "valtio";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   JobsDropdwon,
//   IconSearchBar,
//   Notification,
//   Logo,
// } from "../../../svg/index";
// import "./styles.scss";

// const state = proxy({
//   profile: {
//     first_name: "",
//     last_name: "",
//     image: "",
//   },
//   dropdownOpen: false,
//   selectedOption: "",
//   hoveredOption: "",
// });

// const Header = () => {
//   const userId = localStorage.getItem("userId");
  
//   const snap = useSnapshot(state);
//   const navigate = useNavigate();
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [userType, setUserType] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/freelancer/profile", {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         state.profile = response.data.data;
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
    
//     // Retrieve user type from local storage
//     const type = localStorage.getItem("userType");
//     setUserType(type);
//   }, []);

//   const toggleDropdown = (e, dropdownType) => {
//     e.stopPropagation();
//     if (dropdownType === "jobs") {
//       state.dropdownOpen = !state.dropdownOpen;
//       setProfileDropdownOpen(false);
//     } else if (dropdownType === "profile") {
//       setProfileDropdownOpen(!profileDropdownOpen);
//       state.dropdownOpen = false;
//     }
//   };

//   const handleSelect = (option) => {
//     state.selectedOption = option;
//     state.dropdownOpen = false;
//   };

//   const handleProfileOption = (option) => {
//     setProfileDropdownOpen(false);
//     if (option === "PROFILE") {
//       navigate(`/profile/${userId}`);
//     } else if (option === "LOGOUT") {
//       localStorage.removeItem("token");
//       localStorage.removeItem("firstName");
//       localStorage.removeItem("lastName");
//       localStorage.removeItem("userType");
//       navigate("/signup");
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = () => {
//       state.dropdownOpen = false;
//       setProfileDropdownOpen(false);
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const getInitials = (firstName, lastName) => {
//     return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
//   };
//   const firstName = localStorage.getItem("firstName");
//   const lastName = localStorage.getItem("lastName");
  
//   const initials = firstName && lastName
//     ? getInitials(firstName, lastName)
//     : "";

//   // Define dropdown options based on user type
//   const dropdownOptions = userType === "client"
//     ? ["Post a Job", "All Jobs Post", "Add Payment", "Privacy Policy"]
//     : ["Explore Jobs", "Add Payment", "Privacy Policy"];

//   return (
//     <header className="header">
//       <div className="header-top">
//         <div className="logo">
//           <Logo width="100" height="40" />
//         </div>
//         <div className="dropdown-container">
//           <h2 className="find-work">{userType === "client" ? "Find Talent" : "Find Work"}</h2>
//           <div onClick={(e) => toggleDropdown(e, "jobs")} className="dropdown-toggle">
//             <JobsDropdwon />
//           </div>
//           {snap.dropdownOpen && (
//             <div className="dropdown-menu">
//               <ul>
//                 {dropdownOptions.map((option) => (
//                   <li
//                     key={option}
//                     className={`dropdown-item ${snap.selectedOption === option ? "selected" : ""}`}
//                     onClick={() => handleSelect(option)}
//                     onMouseEnter={() => state.hoveredOption = option}
//                     onMouseLeave={() => state.hoveredOption = ""}
//                     style={{
//                       color: snap.hoveredOption === option ? "#4BCBEB" : "black",
//                     }}
//                   >
//                     {option}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <h2 className="messages">Messages</h2>
//       </div>
//       <div className="header-bottom">
//         <div className="search-bar">
//           <IconSearchBar className="search-icon" width="20" height="20" />
//           <input type="text" placeholder="Search" className="search-input" />
//         </div>
//         <div className="icon"> <Notification className="icon" width="20" height="20" /></div>
       
//         <div className="user-info">
//           <div 
//             className="profile-dropdown"
//             onClick={(e) => toggleDropdown(e, "profile")}
//           >
//             <div className="profile-image-container">
//               <div className="profile-initials-circle">
//                 {initials}
//               </div>
//             </div>
//             {profileDropdownOpen && (
//               <div className="profile-dropdown-menu">
//                 <ul>
//                   {["PROFILE", "LOGOUT"].map((option) => (
//                     <li
//                       key={option}
//                       onClick={() => handleProfileOption(option)}
//                     >
//                       {option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// ===============================================================================================================









import React, { useEffect, useState } from "react";
import { proxy, useSnapshot } from "valtio";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  JobsDropdwon,
  IconSearchBar,
  Notification,
  Logo,
} from "../../../svg/index";
import "./styles.scss";
import jwt_decode from 'jwt-decode'; // Use the default import


const state = proxy({
  profile: {
    first_name: "",
    last_name: "",
    image: "",
  },
  dropdownOpen: false,
  selectedOption: "",
  hoveredOption: "",
});

const Header = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/freelancer/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        state.profile = response.data.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    
    // Retrieve user type from local storage
    const type = localStorage.getItem("userType");
    setUserType(type);
  }, []);

  const toggleDropdown = (e, dropdownType) => {
    e.stopPropagation();
    if (dropdownType === "jobs") {
      state.dropdownOpen = !state.dropdownOpen;
      setProfileDropdownOpen(false);
    } else if (dropdownType === "profile") {
      setProfileDropdownOpen(!profileDropdownOpen);
      state.dropdownOpen = false;
    }
  };

  const handleSelect = (option) => {
    state.selectedOption = option;
    state.dropdownOpen = false;
  
    if (option === "Explore Jobs") {
      navigate("/matchingjobs");
    } else if (option === "Post a Job") {
      navigate("/jobPosting");
    } else if (option === "All Jobs Post") {
      navigate("/alljobs");
    }
  };


  const handleLogoClick = () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (token) {
      try {
        const decodedToken = jwt_decode(token); // Decode the token to get user information
        console.log(decodedToken);
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

  const handleProfileOption = async (option) => {
    setProfileDropdownOpen(false);
    if (option === "PROFILE") {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/freelancer/profile", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate('/profile', { state: { profileData: response.data.data } });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    } else if (option === "LOGOUT") {
      // Clear relevant local storage items on logout
      localStorage.removeItem("token");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("userType");
      localStorage.clear();

      // Redirect the user to the login page
      navigate("/signin");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      state.dropdownOpen = false;
      setProfileDropdownOpen(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  
  const initials = firstName && lastName ? getInitials(firstName, lastName) : "";

  // Define dropdown options based on user type
  const dropdownOptions = userType === "client"
    ? ["Post a Job", "All Jobs Post", "Add Payment", "Privacy Policy"]
    : ["Explore Jobs", "Add Payment", "Privacy Policy"];

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Logo width="100" height="40"  onClick={handleLogoClick}/>
        </div>
        <div className="dropdown-container">
          <h2 className="find-work">{userType === "client" ? "Find Talent" : "Find Work"}</h2>
          <div onClick={(e) => toggleDropdown(e, "jobs")} className="dropdown-toggle">
            <JobsDropdwon />
          </div>
          {snap.dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                {dropdownOptions.map((option) => (
                  <li
                    key={option}
                    className={`dropdown-item ${snap.selectedOption === option ? "selected" : ""}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => state.hoveredOption = option}
                    onMouseLeave={() => state.hoveredOption = ""}
                    style={{
                      color: snap.hoveredOption === option ? "#4BCBEB" : "black",
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Link to="/chat">
          <h2 className="messages">Messages</h2>
        </Link>
      </div>
      <div className="header-bottom">
        <div className="search-bar">
          <IconSearchBar className="search-icon" width="20" height="20" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="icon">
          <Link to="/notifications">
            <Notification className="icon" width="20" height="20" />
          </Link>
        </div>
        <div className="user-info">
          <div 
            className="profile-dropdown"
            onClick={(e) => toggleDropdown(e, "profile")}
          >
            <div className="profile-image-container">
              <div className="profile-initials-circle">
                {initials}
              </div>
            </div>
            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <ul>
                  {["PROFILE", "LOGOUT"].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleProfileOption(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
