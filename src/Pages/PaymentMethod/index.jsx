import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

// Add these imports at the top
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYPAL_OPTIONS } from '../../config/paypal.config'; // Update the path
import PayPalErrorBoundary from '../../components/ErrorBoundry/ErrorBoundary';
import "./styles.scss";
import Header from "../../components/Commoncomponents/Header/index";
import { jwtDecode } from "jwt-decode";

const stripePromise = loadStripe(
  "pk_test_51Q4H9rH8npoWW18Se9Z76jQNTSpGoKFQuhVfplUJoVr00A6yHS57ClGiTiXG1qpm2Is0YeNvPsOfWy0FMlEgh7Hz00ibXnn7Q2"
);

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("creditCard");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
    setErrorMessage("");
  };

  const handlePaymentSuccess = () => {
    setShowSuccessAlert(true);
    setErrorMessage("");
    setTimeout(() => {
      setShowSuccessAlert(false);
      // navigate('/dashboard');
    }, 3000);
  };

  const handlePaymentError = (error) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  return (
    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
      <Elements stripe={stripePromise}>
        <Header />
        <div className="payment-page">
          <h2>Payment Method</h2>
          <p>Choose payment method below</p>
          <div className="payment-options">
            <button
              className={`payment-option ${selectedMethod === "creditCard" ? "active" : ""}`}
              onClick={() => handlePaymentMethodChange("creditCard")}
            >
              Credit/Debit Card
            </button>
            <button
              className={`payment-option ${selectedMethod === "paypal" ? "active" : ""}`}
              onClick={() => handlePaymentMethodChange("paypal")}
            >
              <span className="payment-option-paypal">PayPal</span>
            </button>
          </div>

          {showSuccessAlert && (
            <div className="success-alert">
              Payment method saved successfully!
            </div>
          )}

          {errorMessage && <div className="error-alert">{errorMessage}</div>}

          <form onSubmit={(e) => e.preventDefault()}>
            {selectedMethod === "creditCard" ? (
              <CreditCardForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <PayPalForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </form>
        </div>
      </Elements>
      </PayPalScriptProvider>
  );
};

const CreditCardForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        throw new Error(`Error creating payment method: ${error.message}`);
      }

      const response = await axios.post(
        "http://localhost:5000/api/client/payment-methods",
        {
          type: "credit",
          paymentMethodId: paymentMethod.id,
          userId,
          card: {
            last4: paymentMethod.card.last4,
            brand: paymentMethod.card.brand,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment method saved:", response.data);
      setLoading(false);
      onSuccess();
    } catch (error) {
      console.error("Error saving payment method:", error);
      setLoading(false);
      onError(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred"
      );
    }
  };

  return (
    <div className="form-section">
      <h3>Credit Card Info</h3>
      <div className="form-group">
        <label>Card Details</label>
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <div className="action-buttons">
        <button
          type="submit"
          className="proceed-button"
          disabled={loading || !stripe}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Save Payment Method"}
        </button>
      </div>
    </div>
  );
};





const PayPalForm = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [paypalError, setPaypalError] = useState(null);

  // const createOrder = async (data, actions) => {
  //   if (!email) {
  //     setPaypalError('Please enter your PayPal email first');
  //     return;
  //   }
  
  //   try {
  //     setLoading(true);
  //     return actions.order.create({
  //       purchase_units: [
  //         {
  //           amount: {
  //             value: "10.00", // Replace with your actual amount
  //           },
  //           description: "Payment Method Setup"
  //         },
  //       ],
  //       application_context: {
  //         shipping_preference: 'NO_SHIPPING'
  //       }
  //     });
  //   } catch (error) {
  //     setPaypalError(error.message);
  //     onError(error.message);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // const onApprove = async (data, actions) => {
  //   try {
  //     setLoading(true);
  //     const order = await actions.order.capture();
  //     const token = localStorage.getItem('token');
  //     const decodedToken = jwtDecode(token);
  //     const userId = decodedToken.userId;
  
  //     // Save PayPal as payment method
  //     await axios.post(
  //       'http://localhost:5000/api/client/payment-methods',
  //       {
  //         type: 'paypal',
  //         email: email,
  //         userId: userId,
  //         paypalOrderId: order.id
  //       },
  //       {
  //         headers: { 'Authorization': `Bearer ${token}` }
  //       }
  //     );
  
  //     setPaypalError(null);
  //     onSuccess();
  //   } catch (error) {
  //     setPaypalError(error.message);
  //     onError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

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

      const response = await axios.post(
        "http://localhost:5000/api/client/payment-methods",
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
      onSuccess();
    } catch (error) {
      console.error("Error saving PayPal method:", error);
      setLoading(false);
      onError(
        error.response?.data?.message ||
          error.message ||
          "An unknown error occurred"
      );
    }
  };

  return (
    <div className="form-section">
      <h3>PayPal Info</h3>


      {paypalError && (
      <div className="error-alert">
        {paypalError}
        <button onClick={() => setPaypalError(null)}>✕</button>
      </div>
    )}
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

      {/* <div className="paypal-button-container">
      {loading && <div className="loading-spinner">Processing...</div>}
      {email && !loading && (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            setPaypalError(err.message);
            onError(err);
            console.error('PayPal error:', err);
          }}
          onCancel={() => {
            setPaypalError('Payment cancelled');
          }}
          style={{
            layout: "horizontal",
            color: "blue",
            shape: "rect",
            label: "paypal"
          }}
        />
      )}
    </div> */}

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
  );
};
export default PaymentMethod;
