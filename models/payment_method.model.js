const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payment_MethodSchema = new Schema({
  billing_method: {
    type: String,
    enum: ["Credit/Debit card", "Paypal"], 
    required: true,
  },
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  card_details: {
    address_line: {
      type: String,
    }, 
    billing_address: {
      type: String,
    }, 
    card_number: {
      type: Number,
    }, 
    city: {
      type: String,
    }, 
    first_name: {
      type: String,
    }, 
    last_name: {
      type: String,
    }, 
    postal_code: {
      type: String,
    }, 
    security_code: {
      type: String,
    }, 
  },
  paypal_details: {
    email: {
      type: String,
    },
  },
});

const Payment_Method = mongoose.model("Payment_Method", payment_MethodSchema);

module.exports = Payment_Method;
