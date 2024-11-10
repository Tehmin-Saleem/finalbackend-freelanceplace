// models/ConsultantProfile.js
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  years: String,
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
});

const consultantProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Add userId field
  profilePicture: String, // Store the file path or URL
  bio: String,
  experience: [experienceSchema],
  skills: [String],
  linkedIn: String,
  phoneNumber: String,
  address: String,
  education: [educationSchema],
  certifications: String,
  email: { type: String, required: true }, // Add email field here
});

module.exports = mongoose.model('ConsultantProfile', consultantProfileSchema);
