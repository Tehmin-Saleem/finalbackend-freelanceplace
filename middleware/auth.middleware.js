const jwt = require('jsonwebtoken');


console.log(token);
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer '\
  console.log("token ", token)

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure the same secret is used here
    req.user = decoded; // Set the decoded token data to the request
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Log specific error message
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;