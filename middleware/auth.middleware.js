const jwt = require('jsonwebtoken');

// Define public routes that don't need authentication
const publicRoutes = [
  "/client/login",
  
  
];

// Helper function to check if the current route is public
const isPublicRoute = (req) => {
  return publicRoutes.some(route => req.path.includes(route));
};

const authMiddleware = (req, res, next) => {
  // First, check if it's a public route
  if (isPublicRoute(req)) {
    return next(); // Skip authentication for public routes
  }

  const authHeader = req.headers['authorization'];
  
  // For protected routes, verify authentication
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or incorrect format');
    return res.status(401).json({ 
      message: 'Authorization header missing or malformed' 
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user info to request
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    
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