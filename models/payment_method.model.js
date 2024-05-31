const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payment_MethodSchema = new Schema({
  billing_method: {
    type: String,
    enum: ["Credit/Debit card", "Paypal"], // Enum for billing method values
    required: true,
  },
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", // Reference to User model (client)
  },
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", // Reference to User model (freelancer)
  },
  card_details: {
    address_line: {
      type: String,
    }, // Home address
    billing_address: {
      type: String,
    }, // Country name
    card_number: {
      type: Number,
    }, // Card number
    city: {
      type: String,
    }, // City
    first_name: {
      type: String,
    }, // First name
    last_name: {
      type: String,
    }, // Last name
    postal_code: {
      type: String,
    }, // Postal code
    security_code: {
      type: String,
    }, // Security code
  },
  paypal_details: {
    email: {
      type: String,
    },
  },
});

const Payment_Method = mongoose.model("Payment_Method", payment_MethodSchema);

module.exports = Payment_Method;
