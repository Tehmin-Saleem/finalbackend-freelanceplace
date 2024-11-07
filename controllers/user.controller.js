const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const asyncHandler = require("express-async-handler");
const { sendEmail } = require("../utils/email");

// Middleware to check if the user already exists
const checkUserExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to hash password before saving
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

// Signup function
const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, role, country_name } = req.body;

    const newUser = new User({
      email,
      password,
      first_name,
      last_name,
      role,
      country_name,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    if (role === 'freelancer') {
      newUser.freelancer_id = newUser._id;
    } else if (role === 'client') {
      newUser.client_id = newUser._id;
    }

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    res.status(201).json({ token, message: 'Signup successful' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login function with admin and regular user handling
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    const isAdmin = adminEmails.includes(email);

    if (isAdmin) {
      // Hash the incoming password for admin and compare directly with plain text in env
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);
      const isAdminPasswordCorrect = await bcrypt.compare(password, hashedPassword);

      if (!isAdminPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
      );

      return res.status(200).json({
        token,
        message: 'Admin login successful',
        user: { email, role: 'admin' }
      });
    }

    // User Login Flow
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify user password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("User password mismatch.");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create user token and respond
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    console.log("User login successful.");
    res.status(200).json({
      token,
      message: 'Login successful',
      user: { email: user.email, role: user.role, userId: user._id }
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users with all fields
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Function to create an admin user
const createAdminUser = async (req, res) => {
  try {
    const { email, first_name, last_name, country_name } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    const newAdminUser = new User({
      email,
      first_name,
      last_name,
      country_name,
      password: hashedAdminPassword,
      role: 'admin',
      isAdmin: true,
    });

    await newAdminUser.save();
    res.status(201).json({ message: 'Admin user created' });
  } catch (err) {
    console.error('Error creating admin user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email.' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: "10m" });
    const link = `http://localhost:5173/ChangePass/${user._id}/${token}`;
    
    await sendEmail(user.email, 'Password Reset Request', link);
    return res.status(200).json({ message: "Password reset link generated and sent to your email.", link });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const ChangePass = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { id, token } = req.params;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Verify the token with just JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    return res.status(400).json({ message: "Link has expired or is invalid." });
  }
};




  
  
  



//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const SearchallUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
  ? {
        $or: [
          { first_name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  

  const users = await User.find(keyword).find({ _id: { $ne: req.user.userId } });
  res.send(users);
});


//@description     Get or Search only freelancers

const searchFreelancers = asyncHandler(async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const freelancers = await User.find({
      role: 'freelancer', // Search only users with the role of freelancer
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json(freelancers);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to search for freelancers");
  }
});



const searchClients = asyncHandler(async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const clients = await User.find({
      role: 'client', // Search only users with the role of client
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json(clients);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to search for clients");
  }
});



  
module.exports = { signup, login, hashPassword,ChangePass, checkUserExists,getUserById, getAllUsers, SearchallUsers, forgotPassword, searchFreelancers, searchClients };