const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const connectDB = require("./config/db.config");
const corsMiddleware = require("./config/cors.config");
const authMiddleware = require("./middleware/auth.middleware");
const Chat = require('./models/chat.model');
const Freelancer = require('./models/freelancer_profile.model');




const app = express();
const dotenv = require("dotenv");
const clientRoutes = require("./routes/client.route");
const freelancerRoutes = require("./routes/freelancer.route");
const socketIO = require('socket.io');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { Server } = require("socket.io");





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
// const io = socketIo(server);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Set up a simple route (optional)
app.get("/", (req, res) => {
  res.send("Chat server is running");
  console.log("Chat server is running")
});


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



const sendNotification = (userId, notificationData) => {
  io.to(userId.toString()).emit('notification', notificationData);
};



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




