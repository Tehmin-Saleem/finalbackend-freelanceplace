const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

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
const signup = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { email, first_name, last_name, password, role, country_name } = req.body;

    // Create user in the database
    const newUser = new User({
      email,
      password,
      first_name,
      last_name,
      role,
      country_name,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user initially
    await newUser.save();

    // Update the user with the correct ID based on role
    if (role === 'freelancer') {
      newUser.freelancer_id = newUser._id;
    } else if (role === 'client') {
      newUser.client_id = newUser._id;
    }

    // Save the updated user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, message: 'Signup successful' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
     
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
      );
  
      
      const userData = {
        email: user.email,
        role: user.role,
        userId: user._id 
      };
  
   
      if (user.role === 'client') {
        userData.clientId = user._id; 
      } else if (user.role === 'freelancer') {
        userData.freelancerId = user._id; 
      }
  
      res.status(200).json({ message: 'Login successful', token, user: userData });
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
  
  
  module.exports = { signup, login, hashPassword, checkUserExists,getUserById, getAllUsers };