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





module.exports = {
  accessChat,
  fetchChats,
  allMessages ,
  sendMessage,
  deleteChat,
};


