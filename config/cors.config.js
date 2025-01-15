const cors = require('cors');

const corsOptions = {
  origin: ['http://13.61.176.80:5173', 'http://localhost:5173'], // Array of allowed origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
