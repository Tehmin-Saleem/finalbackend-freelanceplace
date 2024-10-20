const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chatting.model");
const User = require("../models/user.model");
const Message = require("../models/Message.model")






//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId  } = req.body;

  // console.log("userid",req.user.userId)

  

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.userId } } },
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
      users: [req.user.userId, userId],
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
    Chat.find({ users: { $elemMatch: { $eq: req.user.userId } } })
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




//@description     Delete a Chat
//@route           DELETE /api/chat/:chatId
//@access          Protected
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the requesting user is part of the chat
    const isParticipant = chat.users.some(
      (user) => user.toString() === req.user.userId
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    // Optionally, delete all messages associated with this chat
    await Message.deleteMany({ chat: chatId });

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});









//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;


  // Handle file attachment
  let attachment = null;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }


  // If there's an attachment, set up its properties
  if (req.file) {
    attachment = {
      fileName: req.file.originalname,   // Store the original file name
      path: req.file.path,               // Store the path on the server
      description: req.body.description || "",  // Optionally accept a description
    };
  }


  var newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
    attachment: attachment,  // Store the attachment object if it exists
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


//@description     Delete Message
// //@route           DELETE /api/Message/:id
// //@access          Protected
// const deleteMessage = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   // Validate message ID
//   if (!id) {
//     console.log("Message ID not provided");
//     return res.sendStatus(400);
//   }

//   try {
//     // Find the message by ID
//     const message = await Message.findById(id);

//     // Check if message exists
//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }

//     // Check if the user is the sender of the message
//     if (message.sender.toString() !== req.user.userId) {
//       return res.status(403).json({ message: "You are not authorized to delete this message" });
//     }

//     // Delete the message
//     await Message.findByIdAndDelete(id);

//     // Find the related chat
//     const chat = await Chat.findById(message.chat);


//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }
    
//     // Check if the deleted message is the latest message in the chat
//     if (!chat.latestMessage) {
//       return res.status(400).json({ message: "Chat does not have a latest message" });
//     }

//     // Check if the deleted message is the latest message in the chat
//     if (chat.latestMessage.toString() === message._id.toString()) {
//       // Find the new latest message for the chat
//       const latestMessage = await Message.findOne({ chat: chat._id })
//         .sort({ createdAt: -1 }) // Sort by the latest created message
//         .exec();

//       // Update the latest message in the chat
//       chat.latestMessage = latestMessage ? latestMessage._id : null;
//       await chat.save();
//     }

//     // Emit a 'messageDeleted' event to the chat room
//     const io = req.app.get("io"); // Access the Socket.io instance
//     io.to(chat._id).emit("messageDeleted", {
//       messageId: id,
//       chatId: chat._id,
//       latestMessage: chat.latestMessage,
//     });

//     res.json({ message: "Message deleted successfully" });
//   } catch (error) {
//     res.status(500);
//     throw new Error(error.message);
//   }
// });





//@description     Delete Message
//@route           DELETE /api/Message/:id
//@access          Protected
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
 

  // Validate message ID
  if (!id) {
    console.log("Message ID not provided");
    return res.sendStatus(400); // Bad request
  }

  try {
    // Find the message by ID
    const message = await Message.findById(id);

    // Check if message exists
    if (!message) {
      return res.status(404).json({ message: "Message not found" }); // Not found
    }

    // Check if the user is the sender of the message
    if (message.sender.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this message" }); // Forbidden
    }

    // Delete the message
    await Message.findByIdAndDelete(id);

    // Find the related chat
    const chat = await Chat.findById(message.chat);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" }); // Chat not found
    }

    // Check if the deleted message is the latest message in the chat
    if (chat.latestMessage && chat.latestMessage.toString() === message._id.toString()) {
      // Find the new latest message for the chat
      const latestMessage = await Message.findOne({ chat: chat._id })
        .sort({ createdAt: -1 }) // Sort by the latest created message
        .exec();

      // Update the latest message in the chat
      chat.latestMessage = latestMessage ? latestMessage._id : null;
      await chat.save();
    }

    // Emit a 'messageDeleted' event to the chat room
    const io = req.app.get("io"); // Access the Socket.io instance
    io.to(chat._id.toString()).emit("message deleted", {
      messageId: id, // ID of the deleted message
      chatId: chat._id, // ID of the chat
      latestMessage: chat.latestMessage, // Updated latest message, if applicable
    });

    // Send success response to the client
    res.json({
      message: "Message deleted successfully",
      latestMessage: chat.latestMessage, // Return the latest message in the response
    });

  } catch (error) {
    // Send a server error response if something goes wrong
    res.status(500);
    throw new Error(error.message);
  }
});





module.exports = {
  accessChat,
  fetchChats,
  allMessages ,
  sendMessage,
  deleteChat,
  deleteMessage,
};


