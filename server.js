// const express = require("express");
// const http = require("http");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db.config");
// const corsMiddleware = require("./config/cors.config");
// const authMiddleware = require("./middleware/auth.middleware");
// const Chat = require("./models/Chatting.model");
// const Freelancer = require("./models/freelancer_profile.model");
// const {deleteMessage} = require("./controllers/chat.controller")

// const app = express();
// const dotenv = require("dotenv");
// const clientRoutes = require("./routes/client.route");
// const freelancerRoutes = require("./routes/freelancer.route");

// const cors = require("cors");
// const jwt = require("jsonwebtoken");

// app.use(cors());
// dotenv.config();
// connectDB();

// app.use(corsMiddleware);
// app.use(express.json());
// app.use(bodyParser.json());

// const server = http.createServer(app);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:5173",
//     // methods: ["GET", "POST"],
//   },
// });

// // Make io accessible globally
// global.io = io;


// app.use("/api/client", clientRoutes);
// app.use("/api/freelancer", freelancerRoutes);




// io.on("connection", (socket) => {
//   socket.on("setup", (userData) => {
//     if (!userData || !userData.userId) {
//       console.error("Invalid user data received");
//       return;
//     }

//     const notificationRoom = `notification_${userData.userId}`;
//     socket.join(notificationRoom);
//     console.log(`User ${userData.userId} joined notification room: ${notificationRoom}`);
//     socket.emit("connected");
//   });

//   // Chat-specific room handling
//   socket.on("join chat", (room) => {
//     socket.join(`chat_${room}`);
//     console.log("User Joined Chat Room: " + room);
//   });

//   // Chat message handling
//   socket.on("new message", (newMessageReceived) => {
//     const chat = newMessageReceived.chat;

//     if (!chat.users) {
//       console.log("chat.users not defined");
//       return;
//     }

//     chat.users.forEach((user) => {
//       if (user._id === newMessageReceived.sender._id) return;
      
//       // Emit to chat-specific room
//       socket.in(`chat_${chat._id}`).emit("message received", newMessageReceived);
//     });
//   });



//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });



//   // New message deletion logic
//   socket.on("delete message", async (messageId) => {
//     try {
//       // Assuming you have a function to delete the message from the DB
//       const deletedMessage = await deleteMessage(messageId); 

//       if (!deletedMessage) {
//         return console.log(`Message with ID ${messageId} not found or already deleted`);
//       }

//       // Emit a message deletion event to all users in the chat room
//       const chat = deletedMessage.chat;
//       chat.users.forEach((user) => {
//         socket.in(user._id).emit("message deleted", { messageId });
//       });

//       console.log(`Message with ID ${messageId} deleted successfully`);
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   });
//   socket.on("disconnect", () => {
//     console.log(`user disconnected, Socket ID: ${socket.id}`);
//   });
//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData.userId);
//   });


// });

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.config");
const corsMiddleware = require("./config/cors.config");
const authMiddleware = require("./middleware/auth.middleware");
const Chat = require("./models/Chatting.model");
const Freelancer = require("./models/freelancer_profile.model");
const {deleteMessage} = require("./controllers/chat.controller");

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
    origin: "http://localhost:5173",
  },
});

// Make io accessible globally
global.io = io;

app.use("/api/client", clientRoutes);
app.use("/api/freelancer", freelancerRoutes);

io.on("connection", (socket) => {
  // Chat-specific room handling
  socket.on("join chat", (room) => {
    socket.join(`chat_${room}`);
    console.log("User Joined Chat Room: " + room);
  });

  // Chat message handling
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) {
      console.log("chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      
      // Emit to chat-specific room
      socket.in(`chat_${chat._id}`).emit("message received", newMessageReceived);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // Message deletion handling
  socket.on("delete message", async (messageId) => {
    try {
      const deletedMessage = await deleteMessage(messageId); 

      if (!deletedMessage) {
        return console.log(`Message with ID ${messageId} not found or already deleted`);
      }

      // Emit a message deletion event to all users in the chat room
      const chat = deletedMessage.chat;
      chat.users.forEach((user) => {
        socket.in(user._id).emit("message deleted", { messageId });
      });

      console.log(`Message with ID ${messageId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected, Socket ID: ${socket.id}`);
  });
});

