const express = require("express");
const http = require("http");
const connectDB = require("./config/db.config");
const corsMiddleware = require("./config/cors.config");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();
const dotenv = require("dotenv");
const clientRoutes = require("./routes/client.route");
const freelancerRoutes = require("./routes/freelancer.route");
const socketIo = require('socket.io');
const cors = require("cors");






// Enable CORS for all routes
app.use(cors());


dotenv.config();


connectDB();


app.use(corsMiddleware);
app.use(express.json());


app.use("/api/client", clientRoutes);
app.use("/api/freelancer", freelancerRoutes);


const server = http.createServer(app);
// const io = socketIo(server);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Specify your client origin here
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});


// Set up a simple route (optional)
app.get("/", (req, res) => {
  res.send("Chat server is running");
});


io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
   
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    
    socket.on('sendMessage', async (data) => {
        const newMessage = new Chat(data); 
        await newMessage.save();
        io.emit('newMessage', newMessage); 
    });
});


const sendNotification = (userId, notificationData) => {
    io.to(userId.toString()).emit('notification', notificationData);
};


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
