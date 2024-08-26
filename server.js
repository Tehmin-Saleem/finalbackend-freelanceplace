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


dotenv.config();


connectDB();


app.use(corsMiddleware);
app.use(express.json());


app.use("/api/client", clientRoutes);
app.use("/api/freelancer", freelancerRoutes);


const server = http.createServer(app);
const io = socketIo(server);


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
