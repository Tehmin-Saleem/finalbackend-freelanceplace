const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Client_ProfileSchema = new Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    auto: true 
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  about: {
    type: String,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: Date,  
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/  
  },
  languages: [{
    type: String,  
    trim: true
  }],
  country: {
    type: String,  
  },
});

const Client_Profile = mongoose.model("Client_Profile", Client_ProfileSchema);

module.exports = Client_Profile;
