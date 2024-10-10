const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const connectDB = require("./config/db.config");
const corsMiddleware = require("./config/cors.config");
const authMiddleware = require("./middleware/auth.middleware");
const Chat = require('./models/chat.model');
const Freelancer = require('./models/freelancer_profile.model');
const socketIo = require('socket.io');

const app = express();
const dotenv = require("dotenv");
const clientRoutes = require("./routes/client.route");
const freelancerRoutes = require("./routes/freelancer.route");

const cors = require("cors");
const jwt = require('jsonwebtoken');






// Enable CORS for all routes
app.use(cors());
dotenv.config();
connectDB();

app.use(corsMiddleware);
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/client", clientRoutes);
app.use("/api/freelancer", freelancerRoutes);

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});


// Set up a simple route (optional)
app.get("/", (req, res) => {
  res.send("Chat server is running");
  console.log("Chat server is running")
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.join(decoded.userId.toString());
      console.log(`User ${decoded.userId} authenticated and joined their room`);
    } catch (error) {
      console.error('Authentication failed:', error.message);
      socket.emit('auth_error', 'Invalid token'); // Emit error to client
    }
  });
  


  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");
    
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      
    

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.userId);
  });
  
});

const sendNotification = (userId, notificationData) => {
  try {
    io.to(userId.toString()).emit('notification', notificationData);
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);
  }
};




