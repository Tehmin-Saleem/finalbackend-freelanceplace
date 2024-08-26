
const express = require('express');
const Chat = require('../models/chat.model'); // Assuming the Chat model is in models/Chat.js
const router = express.Router();

// Send a message
router.post('/sendMessage', async (req, res) => {
  const { client_id, freelancer_id, send_to, send_by, message, attachment } = req.body;
  
  try {
    const chatMessage = new Chat({
      client_id,
      freelancer_id,
      send_to,
      send_by,
      message,
      attachment,
    });

    const savedMessage = await chatMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch chat history between two users
router.get('/getChatHistory/:client_id/:freelancer_id', async (req, res) => {
  const { client_id, freelancer_id } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { client_id, freelancer_id },
        { client_id: freelancer_id, freelancer_id: client_id }
      ]
    }).sort({ createdAt: 1 }); // Sort by timestamp

    res.status(200).json(chatHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
