



// =================================
// ==================================



// const Chat = require('../models/chat.model');
// const User = require('../models/user.model'); // Assuming you have a User model

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
// exports.sendMessage = async (req, res) => {
//   try {
//     const { clientId, freelancerId, message, sender, attachment } = req.body;

//     let chat = await Chat.findOne({ client_id: clientId, freelancer_id: freelancerId });

//     // If no chat exists between the client and freelancer, create one
//     if (!chat) {
//       chat = new Chat({
//         client_id: clientId,
//         freelancer_id: freelancerId,
//         messages: [],
//       });
//     }

//     // Add the new message to the chat
//     const newMessage = {
//       sender,
//       message,
//       timestamp: new Date(),
//     };

//     if (attachment) {
//       newMessage.attachment = attachment; // Add attachment if provided
//     }

//     chat.messages.push(newMessage);
//     await chat.save();

//     res.status(200).json(chat);
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ error: "An error occurred while sending the message" });
//   }
// };


// Assuming you have access to the `io` instance here

exports.sendMessage = async (req, res) => {
  const io = req.io; // Access io from req
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

    // Emit the message to the connected clients
    io.emit('newMessage', { clientId, freelancerId, ...newMessage }); // Send the message to all connected clients

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

// --------------------------------------------------------------------------------------------------------------------
// ======================================


// const Chat = require('../models/chat.model');
// const User = require('../models/user.model'); // Assuming you have a User model

// // Get chat history between client and freelancer
// exports.getChatHistory = async (req, res) => {
//   try {
//     const { clientId, freelancerId } = req.params;

//     // Fetch the chat between the client and freelancer
//     const chat = await Chat.findOne({ client_id: clientId, freelancer_id: freelancerId });

//     // If no chat exists, return an empty array
//     if (!chat) {
//       return res.status(200).json({ messages: [] });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     console.error("Error fetching chat history:", error);
//     res.status(500).json({ error: "An error occurred while fetching the chat history" });
//   }
// };

// // Send a new message
// exports.sendMessage = async (req, res) => {
//   try {
//     const { clientId, freelancerId, message, sender, attachment } = req.body;

//     // Find the existing chat or create a new one
//     let chat = await Chat.findOne({ client_id: clientId, freelancer_id: freelancerId });

//     // If no chat exists between the client and freelancer, create one
//     if (!chat) {
//       chat = new Chat({
//         client_id: clientId,
//         freelancer_id: freelancerId,
//         messages: [],
//       });
//     }

//     // Create a new message object
//     const newMessage = {
//       sender,
//       message,
//       timestamp: new Date(),
//     };

//     if (attachment) {
//       newMessage.attachment = attachment; // Add attachment if provided
//     }

//     // Push the new message to the chat's messages array
//     chat.messages.push(newMessage);
//     await chat.save();

//     res.status(200).json(chat);
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ error: "An error occurred while sending the message" });
//   }
// };

// // Fetch all chat conversations for a specific client (chat overview)
// exports.getClientChats = async (req, res) => {
//   try {
//     const { clientId } = req.params;

//     // Fetch all chat histories for this client
//     const chats = await Chat.find({ client_id: clientId }).populate('freelancer_id', 'name profilePic');

//     res.status(200).json(chats);
//   } catch (error) {
//     console.error("Error fetching client chats:", error);
//     res.status(500).json({ error: "An error occurred while fetching client chats" });
//   }
// };

// // Fetch all chat conversations for a specific freelancer (chat overview)
// exports.getFreelancerChats = async (req, res) => {
//   try {
//     const { freelancerId } = req.params;

//     // Fetch all chat histories for this freelancer
//     const chats = await Chat.find({ freelancer_id: freelancerId }).populate('client_id', 'name profilePic');

//     res.status(200).json(chats);
//   } catch (error) {
//     console.error("Error fetching freelancer chats:", error);
//     res.status(500).json({ error: "An error occurred while fetching freelancer chats" });
//   }
// };


// -----------------------------------------------------------------------------
const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chatting.model");
const User = require("../models/user.model");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId,  } = req.body;

  

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "first_name last_name email role",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "first_name last_name email role",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.first_name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }


  var users = JSON.parse(req.body.users);
  console.log(users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user.userId);
  console.log("admin user",req.user.userId);
  console.log("till here the code is working");

  try {
    const groupChat = await Chat.create({
      chatName: req.body.first_name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.userId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
} catch (error) {
  res.status(400);
  throw new Error(error.message);
}
});


// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});




module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};


