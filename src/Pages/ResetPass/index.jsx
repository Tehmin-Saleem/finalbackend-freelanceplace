import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import CHARACTER from "../../images/CHARACTER.png";
import Group from "../../images/Group.png";
import { CommonButton } from "../../components/index";
import { Mail, LogoName } from "../../svg/index";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email || emailError) {
      setErrorMessage("Please enter a valid email before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_BASE_URL}/api/client/ForgotPass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Password reset link has been sent to your email.");
        setErrorMessage("");
        // setTimeout(() => navigate("/ChangePass"), 2000);
      } else {
        setErrorMessage(data.message || "Failed to request password reset.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  //     const data = await response.json();
  //     console.log("data", data);

  //     if (response.ok) {
  //       // const errorText = await response.text(); // If it's not JSON
  //       setSuccessMessage("Password reset link has been sent to your email.");
  //       setErrorMessage(""); // Clear any existing error messages
  //       setTimeout(() => {
  //         navigate("/ChangePass");
  //       }, 2000); // Redirect after 2 seconds
  //     } else {
  //       setErrorMessage(data.message || "Failed to request password reset. Please try again.");
  //       setSuccessMessage(""); // Clear success message
  //     }
  //   } catch (error) {
  //     console.error("Error during password reset:", error);
  //     setErrorMessage("An error occurred. Please try again later.");
  //     setSuccessMessage(""); // Clear success message
  //   } finally {
  //     setIsLoading(false); // Set loading to false after request
  //   }
  // };

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
          <form onSubmit={handleForgotPassword}>
            <h1 className="text-[24px] font-Poppins font-medium text-center px-16 py-2">
              Forgot Password
            </h1>
            <p className="text-center text-[#64748B] font-Poppins mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Email Input */}
            <div className="relative">
              <div className="flex mb-4 shadow border rounded-xl w-full py-3 px-3 bg-[#ECF0F1] font-Poppins">
                <div className="pr-3">
                  <Mail />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  value={email}
                />
              </div>
              {emailError && (
                <div className="text-red-500 text-xs mt-1">{emailError}</div>
              )}
            </div>

            {/* Reset Password Button */}
            <div className="flex items-center justify-between">
              <CommonButton
                text={isLoading ? "Sending..." : "Send Reset Link"} // Update button text to show loading state
                className="bg-[#4BCBEB] text-[#FFFFFF] font-semibold font-Poppins text-[24px] py-2 px-7 w-full rounded-xl focus:outline-none focus:shadow-outline"
                disabled={isLoading} // Disable button when loading
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

export default ForgotPassword;
