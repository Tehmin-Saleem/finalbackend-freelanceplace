const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Array of allowed origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
