import React, { useState } from 'react';
import './styles.scss';
// import creditCardIcon from './assets/credit-card.svg'; // Add your icon file paths
// import paypalIcon from './assets/paypal.svg'; // Add your icon file paths
import { Header, NewHeader } from '../../components';

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState('creditCard'); // Default is credit card

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
  };
 
  
  return (
    <>
    <NewHeader/>
    <div className="payment-page">
      <h2>Payment</h2>
      <p>Choose payment method below</p>
      <div className="payment-options">
        <button
          className={`payment-option ${selectedMethod === 'creditCard' ? 'active' : ''}`}
          onClick={() => handlePaymentMethodChange('creditCard')}
        >
          {/* <img src={creditCardIcon} alt="Credit Card" width={30} /> */}
          Pay with Credit Card
        </button>
        <button
          className={`payment-option ${selectedMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => handlePaymentMethodChange('paypal')}
        >
          {/* <img src={paypalIcon} alt="PayPal" width={30} /> */}
          <span className="payment-option-paypal">PayPal</span>
        </button>
      </div>

      {selectedMethod === 'creditCard' ? (
        <CreditCardForm />
      ) : (
        <PayPalForm />
      )}

      <div className="action-buttons">
        <button className="back-button">Back</button>
        <button className="proceed-button">Proceed</button>
      </div>
    </div>
    </>
  );
};

const CreditCardForm = () => {
  return (
    <div className="form-section">
      <h3>Credit Card Info</h3>
      <form>
        <div className="form-group">
          <label>Cardholder's Name</label>
          <input type="text" placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input type="text" placeholder="5645-6456-7665-0456" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Expiration Month</label>
            <input type="text" placeholder="MM" />
          </div>
          <div className="form-group">
            <label>Expiration Year</label>
            <input type="text" placeholder="YY" />
          </div>
          <div className="form-group">
            <label>CVC Number</label>
            <input type="text" placeholder="CVC" />
          </div>
        </div>
      </form>
    </div>
  );
};

const PayPalForm = () => {
  return (
    <div className="form-section">
      <h3>PayPal Info</h3>
      <form>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="example@paypal.com" />
        </div>
      </form>
    </div>
  
  );
};

export default PaymentMethod;
