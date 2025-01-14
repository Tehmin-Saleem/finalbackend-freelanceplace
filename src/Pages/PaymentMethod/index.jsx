import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_OPTIONS } from '../../config/paypal.config'; // Update the path
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../../components/Commoncomponents/Header/index";
import "./styles.scss";

const PaymentMethod = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [paypalError, setPaypalError] = useState(null);
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
  toast.success("Payment method saved successfully!", {
    position: "top-right"
  });
  setTimeout(() => {
    // navigate('/dashboard');
  }, 3000);
};


  const handlePaymentError = (error) => {
    setPaypalError(error);
    setTimeout(() => setPaypalError(""), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const BASE_URL = import.meta.env.VITE_LOCAL_BASE_URL
      const response = await axios.post(
        `${BASE_URL}/api/client/payment-methods`,
        {
          type: "paypal",
          email,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PayPal method saved:", response.data);
      setLoading(false);
      handlePaymentSuccess();
    } catch (error) {
      console.error("Error saving PayPal method:", error);
      setLoading(false);
      handlePaymentError(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred"
      );
    }
  };

  return (
    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
      <Header />
      <div className="payment-page">
        <h2>Payment Method</h2>
        
        <div className="payment-options">
          <button
            className="payment-option active"
          >
            <span className="payment-option-paypal">PayPal</span>
          </button>
        </div>

        {paypalError && (
          <div className="error-alert">
            {paypalError}
            <button onClick={() => setPaypalError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-section">
            <h3>PayPal Info</h3>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@paypal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="action-buttons">
              <button
                type="submit"
                className="proceed-button"
                disabled={loading || !email}
                onClick={handleSubmit}
              >
                {loading ? "Saving..." : "Save Payment Method"}
              </button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentMethod;
