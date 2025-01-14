import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import "./styles.scss";
import { Header } from "../../components";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientProfilePage = () => {
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    about: "",
    gender: "",
    DOB: "",
    email: "",
    languages: "",
    country: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Modify the useEffect hook in ClientProfilePage component
  useEffect(() => {
    const checkAndFetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First, fetch user data
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        if (!userId) {
          throw new Error("No user ID found in token");
        }

        // Fetch user data
        const userResponse = await axios.get(
          `${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = userResponse.data;

        // Set initial profile data with user data
        setProfileData((prevData) => ({
          ...prevData,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          country: userData.country_name || "",
        }));
        console.log("userdata", userData);
        // Then check for existing profile
        const profileResponse = await axios.get(
          `${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("profile", profileResponse.data.data);
        if (profileResponse.data.success && profileResponse.data.data) {
          setIsEditMode(true);
          const profile = profileResponse.data.data;

          setProfileData((prevData) => ({
            ...prevData,
            about: profile.about || "",
            gender: profile.gender || "",
            DOB: profile.DOB
              ? new Date(profile.DOB).toISOString().split("T")[0]
              : "",
            languages: Array.isArray(profile.languages)
              ? profile.languages.join(", ")
              : "",
          }));

          if (profile.image) {
            setProfilePicture(profile.image);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // setError("Failed to fetch user data: " + error.message);
      }
    };

    checkAndFetchProfile();
  }, []);

  // // Check if profile exists and fetch data if it does
  // useEffect(() => {
  //   const checkAndFetchProfile = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         "http://localhost:5000/api/client/profile",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       if (response.data.success && response.data.data) {
  //         setIsEditMode(true);
  //         const profile = response.data.data;
  //         // Split the full name into first and last name
  //         const [firstName, ...lastNameParts] = profile.name.split(" ");

  //         setProfileData({
  //           first_name: firstName || "",
  //           last_name: lastNameParts.join(" ") || "",
  //           about: profile.about || "",
  //           gender: profile.gender || "",
  //           DOB: profile.DOB
  //             ? new Date(profile.DOB).toISOString().split("T")[0]
  //             : "",
  //           email: profile.email || "",
  //           languages: Array.isArray(profile.languages)
  //             ? profile.languages.join(", ")
  //             : "",
  //           country: profile.country || "",
  //         });

  //         if (profile.image) {
  //           setProfilePicture(profile.image);
  //         }
  //       }
  //     } catch (error) {
  //       // If profile doesn't exist, we'll stay in creation mode
  //       console.log("No existing profile found or error fetching profile");
  //     }
  //   };

  //   checkAndFetchProfile();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setProfilePicture(URL.createObjectURL(file));
      setProfileData({ ...profileData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (key === "languages") {
        formData.append(key, JSON.stringify(profileData[key].split(",")));
      } else if (key === "image" && profileData[key] instanceof File) {
        formData.append("image", profileData[key]);
      } else {
        formData.append(key, profileData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");

      // Choose the appropriate endpoint based on whether we're creating or updating
      const endpoint = isEditMode
        ? `${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/profile/update`
        : `${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/clientprofile`;

      const method = isEditMode ? "put" : "post";

      const response = await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsLoading(false);
      if (isEditMode) {
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Profile created successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      // alert(`Profile ${isEditMode ? "updated" : "created"} successfully!`);
      console.log("Profile response:", response.data);
      navigate("/ClientProfile");
    } catch (err) {
      setError(
        `Failed to ${isEditMode ? "update" : "create"} profile: ` +
          (err.response?.data?.message || err.message)
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEditMode ? "Edit" : "Create"} Client Profile</title>
        <meta
          name="description"
          content={`${isEditMode ? "Edit" : "Create"} your client profile on YourApp`}
        />
        <meta
          property="og:title"
          content={`${isEditMode ? "Edit" : "Create"} Client Profile | YourApp`}
        />
        <meta
          property="og:description"
          content={`${isEditMode ? "Edit" : "Create"} your client profile on YourApp`}
        />
        <meta property="og:type" content="profile" />
      </Helmet>
      <Header />
      <div className="client-profile-page">
        <h1>{isEditMode ? "Edit" : "Create"} Your Profile</h1>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <div className="profile-image-section">
            <h3>Upload your profile image</h3>
            <div className="img-format">
              <span>Support Format: PNG, JPEG</span>
              <span>Maximum Size: 5MB</span>
            </div>
            <div className="profile-image">
              <div className="profile-image">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile Preview" />
                ) : (
                  <div className="empty-picture">
                    <FaCamera className="camera-icon" />
                  </div>
                )}
                <label htmlFor="profilePicture" className="upload-overlay">
                  <FaCamera />
                  <span>Upload</span>
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/png, image/jpeg"
                  onChange={handlePictureUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={profileData.first_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={profileData.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="DOB">Date of Birth</label>
              <input
                type="date"
                id="DOB"
                name="DOB"
                value={profileData.DOB}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={profileData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Germany">Germany</option>
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* About Me Section */}
          <div className="form-section">
            <h3>About Me</h3>
            <div className="form-group">
              <label htmlFor="about">Tell us about yourself</label>
              <textarea
                id="about"
                name="about"
                value={profileData.about}
                onChange={handleInputChange}
                rows="5"
              />
            </div>
          </div>

          {/* Languages Section */}
          <div className="form-section">
            <h3>Languages</h3>
            <div className="form-group">
              <label htmlFor="languages">Languages (comma-separated)</label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={profileData.languages}
                onChange={handleInputChange}
                placeholder="e.g., English, Spanish, French"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Profile"
                  : "Create Profile"}
            </button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
};

export default ClientProfilePage;
