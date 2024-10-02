
// const express = require('express');
// const Chat = require('../models/chat.model'); // Assuming the Chat model is in models/Chat.js
// const router = express.Router();

// // Send a message
// router.post('/sendMessage', async (req, res) => {
//   const { client_id, freelancer_id, send_to, send_by, message, attachment } = req.body;
  
//   try {
//     const chatMessage = new Chat({
//       client_id,
//       freelancer_id,
//       send_to,
//       send_by,
//       message,
//       attachment,
//     });

//     const savedMessage = await chatMessage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Fetch chat history between two users
// router.get('/getChatHistory/:client_id/:freelancer_id', async (req, res) => {
//   const { client_id, freelancer_id } = req.params;

//   try {
//     const chatHistory = await Chat.find({
//       $or: [
//         { client_id, freelancer_id },
//         { client_id: freelancer_id, freelancer_id: client_id }
//       ]
//     }).sort({ createdAt: 1 }); // Sort by timestamp

//     res.status(200).json(chatHistory);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// ========================================================================================================

// const Chat = require('../models/chat.model');

// // Send a message
// exports.sendMessage = async (req, res) => {
//   const { client_id, freelancer_id, send_to, send_by, message, attachment } = req.body;

//   try {
//     const chatMessage = new Chat({
//       client_id,
//       freelancer_id,
//       send_to,
//       send_by,
//       message,
//       attachment,
//     });

//     const savedMessage = await chatMessage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Fetch chat history between two users
// exports.getChatHistory = async (req, res) => {
//   const { client_id, freelancer_id } = req.params;

//   try {
//     const chatHistory = await Chat.find({
//       $or: [
//         { client_id, freelancer_id },
//         { client_id: freelancer_id, freelancer_id: client_id }
//       ]
//     }).sort({ createdAt: 1 }); // Sort by timestamp

//     res.status(200).json(chatHistory);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// ===========================================================================================
// =========================================================================================

// const Chat = require('../models/chat.model');

// // Send a message
// exports.sendMessage = async (req, res) => {
//   const { client_id, freelancer_id, send_to, send_by, message, attachment } = req.body;

//   if (!client_id || !freelancer_id || !send_to || !send_by || !message) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const chatMessage = new Chat({
//       client_id,
//       freelancer_id,
//       send_to,
//       send_by,
//       message,
//       attachment,
//     });

//     const savedMessage = await chatMessage.save();

//     if (req.io) {
//       req.io.to(send_to.toString()).emit('newMessage', savedMessage);
//     }

//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Fetch chat history with pagination
// exports.getChatHistory = async (req, res) => {
//   const { client_id, freelancer_id } = req.params;
//   const { page = 1, limit = 20 } = req.query;

//   try {
//     const chatHistory = await Chat.find({
//       $or: [
//         { client_id, freelancer_id },
//         { client_id: freelancer_id, freelancer_id: client_id }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(limit * 1)
//     .skip((page - 1) * limit);

//     res.status(200).json({
//       page,
//       totalMessages: chatHistory.length,
//       messages: chatHistory,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Mark a message as read
// exports.markAsRead = async (req, res) => {
//   const { messageId } = req.params;

//   try {
//     const updatedMessage = await Chat.findByIdAndUpdate(
//       messageId,
//       { isRead: true },
//       { new: true }
//     );

//     if (!updatedMessage) {
//       return res.status(404).json({ error: 'Message not found' });
//     }

//     res.status(200).json(updatedMessage);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// =================================
// ==================================



const Chat = require('../models/chat.model');
const User = require('../models/user.model'); // Assuming you have a User model

// Get chat history between client and freelancer
exports.getChatHistory = async (req, res) => {
  try {
    const { clientId, freelancerId } = req.params;

    // Fetch the chat between the client and freelancer
    const chat = await Chat.findOne({ client_id: clientId, freelancer_id: freelancerId });

    // If no chat exists, return an empty array
    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "An error occurred while fetching the chat history" });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { clientId, freelancerId, message, sender, attachment } = req.body;

    let chat = await Chat.findOne({ client_id: clientId, freelancer_id: freelancerId });

    // If no chat exists between the client and freelancer, create one
    if (!chat) {
      chat = new Chat({
        client_id: clientId,
        freelancer_id: freelancerId,
        messages: [],
      });
    }

    // Add the new message to the chat
    const newMessage = {
      sender,
      message,
      timestamp: new Date(),
    };

    if (attachment) {
      newMessage.attachment = attachment; // Add attachment if provided
    }

    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "An error occurred while sending the message" });
  }
};

// Fetch all chat conversations for a specific client (chat overview)
exports.getClientChats = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Fetch all chat histories for this client
    const chats = await Chat.find({ client_id: clientId }).populate('freelancer_id', 'name profilePic');

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching client chats:", error);
    res.status(500).json({ error: "An error occurred while fetching client chats" });
  }
};

// Fetch all chat conversations for a specific freelancer (chat overview)
exports.getFreelancerChats = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    // Fetch all chat histories for this freelancer
    const chats = await Chat.find({ freelancer_id: freelancerId }).populate('client_id', 'name profilePic');

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching freelancer chats:", error);
    res.status(500).json({ error: "An error occurred while fetching freelancer chats" });
  }
};
