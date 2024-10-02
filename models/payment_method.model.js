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
  card_details: {
    last4: String,
    brand: String,
    exp_month: Number,
    exp_year: Number,
    stripe_payment_method_id: String
  },
  paypal_details: {
    email: String,
  },
});

const Payment_Method = mongoose.model("Payment_Method", payment_MethodSchema);

module.exports = Payment_Method;