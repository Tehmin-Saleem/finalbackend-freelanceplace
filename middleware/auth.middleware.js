// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers['authorization']; // Capture the authorization header
//   console.log('Authorization header:', authHeader); // Log the header to see if it's present
  
//   const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer '
//   console.log("token" , token);

//   if (!token) {
//     console.error('No token provided');
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; 
//     next();
//   } catch (err) {
//     console.error('Token verification failed:', err);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = authMiddleware;



const jwt = require('jsonwebtoken');


console.log(token);
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Capture the authorization header
  // console.log('Authorization header:', authHeader); // Log the header to see if it's present
  
  // Ensure the header starts with 'Bearer ' and extract the token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or incorrect format');
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'


  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure the same secret is used here
    req.user = decoded;  // Attach the decoded token (user info) to the request// Set the decoded token data to the request
    next();  // Proceed to the next middleware or route handler
    } catch (err) {
    console.error('Token verification failed:', err.message); // Log specific error message
    
    // Handle token expiration or invalid signature specifically
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is invalid' });
    } else {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
};

module.exports = authMiddleware;

