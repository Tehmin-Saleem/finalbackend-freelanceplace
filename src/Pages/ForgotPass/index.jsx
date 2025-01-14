import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonButton } from "../../components/index";
import { Password, PassEye, LogoName } from "../../svg/index";
import CHARACTER from "../../images/CHARACTER.png";
import Group from "../../images/Group.png";
import { useParams } from "react-router-dom";

function ChangePassword() {
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Validation for new password
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validate password length immediately
    if (password.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long.");
    } else {
      setNewPasswordError("");
    }
  };

  // Validate confirm password
  const handleConfirmPasswordChange = (e) => {
    const password = e.target.value;
    setConfirmPassword(password);

    // Match confirm password with new password
    if (password !== newPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Trigger validations before submission
    if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long.");
    }
  
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match.");
    }
  
    // If there are validation errors, do not submit
    if (newPasswordError || confirmPasswordError || !newPassword || !confirmPassword) {
      setErrorMessage("Please fix the errors before submitting.");
      return;
    }
  
    try {
      // Clear previous messages
      setErrorMessage("");
      setSuccessMessage("Submitting...");
  
      // API call to change the password
      const response = await fetch(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/ChangePass/${id}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send the token in the Authorization header
        },
        body: JSON.stringify({ newPassword , confirmPassword }),
      });
      
      console.log("Token in change pass" , token);
      console.log("id" , id);
  
      const data = await response.json();
      console.log("data", data);


      if (!response.ok) {
        setErrorMessage(data.message || "An error occurred.");
      } else {
        setSuccessMessage("Password has been changed successfully.");
        setTimeout(() => navigate("/signin"), 2000); // Redirect to login after success
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="md:flex md:flex-row h-auto">
      {/* First Half - Logo and Picture */}
      <div className="md:w-1/2 h-screen bg-white hidden md:block">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-6">
            <LogoName />
          </div>
          <div className="mb-3">
            <img src={CHARACTER} alt="Character" className="md:max-w-md" />
          </div>
          <div>
            <img src={Group} alt="Group" />
          </div>
        </div>
      </div>

      {/* Second Half - Form */}
      <div className="md:w-1/2 w-full h-screen md:mr-9 bg-white flex items-center justify-center shadow-lg">
        <div className="w-full max-w-lg p-16 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <h1 className="text-[24px] font-Poppins font-medium text-center px-16 py-2">
              Reset your password
            </h1>

            {/* New Password Input */}
            <div className="relative">
              <div className="flex mb-4 shadow border rounded-xl w-full py-3 px-3 bg-[#ECF0F1] font-Poppins">
                <div className="pr-3">
                  <Password />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
                  onChange={handleNewPasswordChange}
                  value={newPassword}
                  required
                />
                <span
                  className="cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <PassEye />
                </span>
              </div>
              {newPasswordError && (
                <div className="text-red-500 text-xs mt-1">{newPasswordError}</div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="flex mb-4 shadow border rounded-xl w-full py-3 px-3 bg-[#ECF0F1] font-Poppins">
                <div className="pr-3">
                  <Password />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  required
                />
                <span
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <PassEye />
                </span>
              </div>
              {confirmPasswordError && (
                <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>
              )}
            </div>

            {/* Reset Password Button */}
            <div className="flex items-center justify-between">
              <CommonButton
                text="Reset Password"
                className="bg-[#4BCBEB] text-[#FFFFFF] font-semibold font-Poppins text-[24px] py-2 px-7 w-full rounded-xl focus:outline-none focus:shadow-outline"
              />
            </div>

            {/* Error/Success Message Display */}
            {errorMessage && (
              <div className="text-red-500 text-xs mt-4 text-center">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-green-500 text-xs mt-4 text-center">
                {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
