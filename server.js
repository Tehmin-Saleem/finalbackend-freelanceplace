const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.config");
const corsMiddleware = require("./config/cors.config");
const authMiddleware = require("./middleware/auth.middleware");
const Chat = require("./models/Chatting.model");
const Freelancer = require("./models/freelancer_profile.model");
const { deleteMessage } = require("./controllers/chat.controller");
const cookieParser = require('cookie-parser');

const app = express();
const dotenv = require("dotenv");
const clientRoutes = require("./routes/client.route");
const freelancerRoutes = require("./routes/freelancer.route");

const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
dotenv.config();
connectDB();
app.use(corsMiddleware);
app.use(express.json());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://13.61.176.80:5173",
  },
});

// Make io accessible globally
global.io = io;

// Middleware for role-based access
const checkAdminAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user information found" });
  }

  // If the user is an admin, allow access to all routes
  if (req.user.role === "admin") {
    return next(); // Admin has access to all routes
  }

  // If the user is a freelancer, allow access to freelancer routes
  if (req.originalUrl.includes('/freelancer') && req.user.role === 'freelancer') {
    return next(); // Freelancer has access to freelancer routes
  }

  // If the user is a client, allow access to client routes
  if (req.originalUrl.includes('/client') && req.user.role === 'client') {
    return next(); // Client has access to client routes
  }

  // If none of the above conditions match, deny access
  return res.status(403).json({ message: "Access denied to this route" });
};



// Apply authentication middleware to secure routes
// app.use(authMiddleware);

// app.use("api/client/login", clientRoutes);
// app.use("api/freelancer/login", freelancerRoutes);

// Middleware applied to protected routes


// Freelancer and Client routes
app.use("/api/client",  clientRoutes);
app.use("/api/freelancer", freelancerRoutes);
// app.use(authMiddleware);
// Socket.io Implementation
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    //  console.log("userdata in server", userData);

    // Check if userData is valid
    if (!userData) {
      console.error("Invalid user data received:", userData);
      return;
    }
    // Check if the user is a freelancer or client based on the presence of freelancer_id or _id
    if (userData.freelancer_id) {
      socket.join(userData.freelancer_id); // Join room using freelancer_id for freelancers
      // console.log(`Freelancer joined room: ${userData.freelancer_id}`);
    } else if (userData._id) {
      socket.join(userData._id); // Join room using _id for clients
      // console.log(`Client joined room: ${userData._id}`);
    } else {
      console.error(
        "Neither _id nor freelancer_id found in user data:",
        userData
      );
      return;
    }
    socket.emit("connected");

    

  });

  socket.on("join chat", (room) => {
    socket.join(room);
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("delete message", async (messageId) => {
    try {
      const deletedMessage = await deleteMessage(messageId);

      if (!deletedMessage) {
        return console.log(`Message with ID ${messageId} not found`);
      }

      const chat = deletedMessage.chat;
      chat.users.forEach((user) => {
        socket.in(user._id).emit("message deleted", { messageId });
      });

      console.log(`Message with ID ${messageId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.userId);
  });
});
