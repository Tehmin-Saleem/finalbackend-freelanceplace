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
      if (existingUser.banned) {
        return res.status(403).json({ message: 'This account is banned. Please contact support.' });
    }
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

      const existingUser = await User.findOne({ email });

      if (existingUser) {
          if (existingUser.banned) {
              return res.status(403).json({ message: 'This account is banned. Please contact support.' });
          }
          return res.status(400).json({ message: 'Email already in use.' });
      }

        const newUser = new User({
          email,
          password,
          first_name,
          last_name,
          role, // This is now handled from request body
          country_name,
      });

        const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

      // Set role-specific IDs based on the role
      if (role === 'freelancer') {
          newUser.freelancer_id = newUser._id;
      } else if (role === 'client') {
          newUser.client_id = newUser._id;
      } else if (role === 'consultant') {
          newUser.consultant_id = newUser._id;
      }

        await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
          expiresIn: '5h',
      });

      const userData = {
          email: newUser.email,
          role: newUser.role,
          userId: newUser._id,
          first_name: newUser.first_name, 
          last_name: newUser.last_name,
          country_name: newUser.country_name,
          token,
      };

      res.status(201).json({ token, message: 'Signup successful', user: userData });
  } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Parse the admin emails from the environment variable
    const adminEmails = process.env.ADMIN_EMAILS.split(',');

    // Check if the login matches any of the admin emails
    if (adminEmails.includes(email) && password === process.env.ADMIN_PASSWORD) {
      // Generate JWT token for admin
      const token = jwt.sign(
        { userId: 'admin', email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7h' }
      );

      // Respond with the token and admin user data
      return res.status(200).json({
        token,
        message: 'Admin login successful',
        user: {
          email,
          role: 'admin',
          userId: 'admin', // Placeholder userId for admin
        }
      });
    }

    // For regular users, proceed with database lookup
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user is soft-banned
    if (user.softBanned) {
      return res.status(403).json({ message: 'Your account has been soft-banned. Please contact support.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for regular user
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7h' }
    );

    // Prepare user data for the response
    const userData = {
      email: user.email,
      role: user.role,
      userId: user._id,
    };

    // Assign specific IDs based on user role
    if (user.role === 'client') {
      userData.clientId = user._id;
    } else if (user.role === 'freelancer') {
      userData.freelancerId = user._id;
    } else if (user.role === 'consultant') {
      userData.consultantId = user._id;
    }

    // Respond with the token and user data
    res.status(200).json({ token, message: 'Login successful', user: userData });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
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



const getAllClient = async (req, res) => {
  try {
    // Fetch the client count based on the role 'client'
    const clientCount = await User.countDocuments({ role: 'client' });
    
    // Send the count in response
    res.status(200).json({ count: clientCount });

    // Optional: Log the count for debugging purposes
    console.log("Client count:", clientCount);
    
  } catch (error) {
    // Log the error and return a 500 Internal Server Error
    console.error("Error fetching client count:", error);
    return res.status(500).json({ error: 'Failed to fetch client count' });
  }
};
  

  
  
const getallfreelancer=async (req, res) => {
  try {
    const freelancerCount = await User.countDocuments({ role: 'freelancer' });
    res.json({ count: freelancerCount });
  } catch (error) {
   return  res.status(500).json({ error: 'Failed to fetch freelancer count' });
  }
};
const getallfreelancerlist= async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'freelancer' });
    res.status(200).json(freelancers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching freelancers' });
  }
};
const getallclientlist= async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'client' });
    res.status(200).json(freelancers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching freelancers' });
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

const freelancersoftban= async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id);
    if (!freelancer) return res.status(404).send({ message: "Freelancer not found" });

    // Toggle soft-banned status
    freelancer.softBanned = !freelancer.softBanned;
    await freelancer.save();

    res.status(200).send({ message: freelancer.softBanned ? "Freelancer soft-banned" : "Freelancer unbanned" });
  } catch (error) {
     return res.status(500).send({ message: "Error toggling soft ban status" });
  }
};

const clientsoftban= async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) return res.status(404).send({ message: "Client not found" });

    // Toggle soft-banned status
    client.softBanned = !freelancer.softBanned;
    await client.save();

    res.status(200).send({ message: client.softBanned ? "Client soft-banned" : "Client unbanned" });
  } catch (error) {
     return res.status(500).send({ message: "Error toggling soft ban status" });
  }
};

const freelancerban=async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id);
    if (!freelancer) return res.status(404).send({ message: "Freelancer not found" });

    // Full ban (mark as banned, or delete)
    freelancer.banned = true;
    await freelancer.save();
    
    // Optionally delete the freelancer data if required
    //  await User.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: "Freelancer fully banned and removed" });
  } catch (error) {
    return res.status(500).send({ message: "Error banning freelancer" });
  }
};

const clientban=async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) return res.status(404).send({ message: "client not found" });

    // Full ban (mark as banned, or delete)
    client.banned = true;
    await client.save();
    
    // Optionally delete the freelancer data if required
    // await Freelancer.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: "client fully banned and removed" });
  } catch (error) {
    return res.status(500).send({ message: "Error banning freelancer" });
  }
};


const freelancerUnban=async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id);
    if (!freelancer) return res.status(404).send({ message: "Freelancer not found" });

    freelancer.softBanned = false;
    freelancer.banned = false;
    await freelancer.save();

    res.status(200).send({ message: "Freelancer unbanned" });
  } catch (error) {
    return res.status(500).send({ message: "Error unbanning freelancer" });
  }
};

const ClientUnban=async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) return res.status(404).send({ message: "Client not found" });

    client.softBanned = false;
    client.banned = false;
    await client.save();

    res.status(200).send({ message: "Client unbanned" });
  } catch (error) {
    return res.status(500).send({ message: "Error unbanning freelancer" });
  }
};
// controllers/consultantProfileController.js





  
module.exports = { signup, login, hashPassword,ChangePass, checkUserExists,getUserById, getAllUsers, SearchallUsers, forgotPassword, searchFreelancers, searchClients, getallfreelancer,getAllClient,getallfreelancerlist,getallclientlist,freelancersoftban,clientsoftban,freelancerban,clientban,freelancerUnban,ClientUnban };