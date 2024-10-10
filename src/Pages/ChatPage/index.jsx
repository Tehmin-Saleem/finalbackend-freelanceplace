import React, { useState, useEffect } from "react";
import "./styles.scss";
import axios from "axios";
import {
  Header,
  ChatLoading,
  UserListItems,
  Spinner,
} from "../../components/index";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../components/chatcomponents/ChatLogic";
import { BigCross } from "../../svg";
import Lottie from "react-lottie";
import ScrollableChat from "../../components/chatcomponents/ScrollableChat";
import io from "socket.io-client";
import animationData from "../../animations/typing.json"


const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const Chat = () => {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [loggedUser, setLoggedUser] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  // Function to open the drawer
  const handleSearchClick = () => {
    setIsDrawerOpen(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      setError("Please enter something in the search."); // Show error if input is empty
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear previous error messages

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // console.log("token in handle  search", user.token);

      // i have to correct the route here ..........
      const { data } = await axios.get(
        `http://localhost:5000/api/client/SearchAllUsers?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data); // Store the search result
      // console.log(data);
    } catch (error) {
      setLoading(false);
      setError("Failed to load search results. Please try again."); // Handle error
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    // console.log("token in acceschats", user.token);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/client/accesschats`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      // console.log("data in function accesschats", data);
      setLoadingChat(false);
      closeDrawer();
      // onClose(); // close the sidedrawer after this
    } catch (error) {
      setError("Failed to fetch chats. Please try again."); // Handle error
    }
  };

  // part below the drawer that is Mychats
  // =============

  const fetchChats = async () => {
    // console.log(userId);

    // Get userInfo from localStorage and parse it
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Extract the token from the userInfo object
    const token = userInfo?.token;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      

      const { data } = await axios.get(
        "http://localhost:5000/api/client/fetchchats",
        config
      );
      
      setChats(data);
    } catch (error) {
      setError("Failed to load the chats. Please try again."); // Handle error
      console.log(error);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    // console.log("loggeduser is" ,loggedUser);
    fetchChats();
  }, [fetchAgain]);



  // messages related integration


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/client/allMessages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      console.log(data)
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setError("Failed to load all the message"); // Handle error
        console.log(error);
    }
  };




  
  useEffect(() => {
 
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
    if (userInfo && userInfo.user) {  // Check if userInfo has a valid user object
      socket = io(ENDPOINT);
      console.log("Emitting setup event with user:", userInfo.user);
      socket.emit("setup", userInfo.user);  // Send only the user object
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

    } else {
      console.error("No valid user data found in localStorage");
      navigate("/");  // Redirect if no valid user
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/client/sendMessage",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        setError("Failed to send the message"); // Handle error
        console.log(error);
    }

  }
};


  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

  };

  return (
    <>
      <Header />
      <div className="chat-page">
        {/* <div className="chat-header"></div> */}
        <div className="left-section">
          <h2 className="msg">Messages</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              onClick={handleSearchClick}
            />
          </div>

          {/* =========================== */}
          <div
            className={`mychats-container ${
              selectedChat ? "hide-on-mobile" : ""
            }`}
          >
            <div className="mychats-header">
              My Chats
              <div className="group-chat-modal">
                <button className="new-group-chat-btn">
                  New Group Chat <span className="plus-icon">+</span>
                </button>
              </div>
            </div>

            <div className="chat-box">
              {chats ? (
                <div className="chat-list">
                  {chats.map((chat) => (
                    <div
                      onClick={() => setSelectedChat(chat)}
                      className={`chat-item ${
                        selectedChat === chat ? "selected" : ""
                      }`}
                      key={chat._id}
                    >
                      <p className="chat-name">
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </p>
                      {chat.latestMessage && (
                        <p className="chat-latest-message">
                          <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ChatLoading />
                // <div className="chat-loading">Loading chats...</div>
              )}
            </div>
          </div>
          {/* =========================== */}
        </div>
        <div className="right-section">
          <>
            {selectedChat ? (
              <>
                <div className="chat-header">
                  {/* Back button visible only on smaller screens */}
                  <button
                    className="icon-button"
                    onClick={() => setSelectedChat("")}
                  >
                    ←
                  </button>

                  {/* Chat title */}
                  <span className="chat-title">
                    {/* {messages && */}
                    {!selectedChat.isGroupChat ? (
                      <>{getSender(user, selectedChat.users)}</>
                    ) : (
                      <>{selectedChat.chatName.toUpperCase()}</>
                    )}
                    {/* } */}
                  </span>
                  </div>

                  <div className="mainchat-box">
                    {loading ? (
                      <div className="spinner">
                      </div>
                    ) : (
                      <div className="messages">
                        <ScrollableChat messages={messages} />
                      </div>
                    )}

                    <div className="form-control">
                      {/* Typing animation */}

                      {istyping && (
                        <div className="typing-animation">
                          <Lottie options={defaultOptions} width={70} />
                        </div>
                       )}


                      {/* Message input */}
                      <input
                        type="text"
                        id="first-name"
                        required
                        placeholder="Type your message..."
                        onKeyDown={sendMessage}
                        className="message-input"
                        value={newMessage}
                        onChange={typingHandler}
                      />
                    </div>
                  </div>
                {/* ); }; */}
              </>
            ) : (
              <div className="rightchat-container">
                <p className="rightchat-text">
                  Click on a user to start chatting
                </p>
              </div>
            )}

            {/* <div className="chat-header"> 
              <h3>jobtitle</h3>
            </div>
            <div className="chat-messages"></div>

            <div className="message-input">
              <input type="text" placeholder="Write a message..." />
              <button>Send</button>
            </div> */}
          </>
        </div>

        {/* Side Drawer */}
        <div className={`side-drawer ${isDrawerOpen ? "open" : ""}`}>
          <div className="drawer-header">
            <h3 className="drawer_search">Search</h3>
            {/* <button onClick={closeDrawer}>X</button> Close drawer button */}
            <button onClick={closeDrawer}>
              <BigCross />
            </button>
          </div>
          <div className="drawer-search-bar">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="drawer-search-bar-button" onClick={handleSearch}>
              Go
            </button>

            {/* Error message */}
            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItems
                  key={user.userId}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
