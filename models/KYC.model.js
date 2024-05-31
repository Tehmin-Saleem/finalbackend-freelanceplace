const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KYCSchema = new Schema({
  address: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postal_code: {
      type: String,
    },
  },

  DOB: {
    type: Date,
  },
  first_name: {
    type: String,
  },
  gender: {
    type: String,
  },
  id_card_attachment: {
    type: String,
  }, // Assuming attachment is a string (file path or URL)
  image: {
    type: String,
  },
  last_name: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
  }, // Enum for status values
  updatedAt: {
    type: Date,
  }, // Default value for updated_at is current timestamp
});

const KYC = mongoose.model("KYC", KYCSchema);

module.exports = KYC;
