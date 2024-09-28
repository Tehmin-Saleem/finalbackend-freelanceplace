// // // Chat.js
// // import React, { useState } from 'react';
// // import './styles.scss';
// // import dummyData from "../../components/DummyData";
// // import { Header } from '../../components';

// // const Chat = () => {
// //   const [selectedChat, setSelectedChat] = useState(dummyData[0]); // Default to the first chat
// //   const [searchTerm, setSearchTerm] = useState('');

// //   const handleSearch = (e) => {
// //     setSearchTerm(e.target.value);
// //     const filteredChats = dummyData.filter(chat =>
// //       chat.name.toLowerCase().includes(e.target.value.toLowerCase())
// //     );
// //     setSelectedChat(filteredChats[0] || dummyData[0]);
// //   };

// //   return (
// //     <>
// //     <Header/>
// //     <div className="chat-page">
// //       <div className="left-section">
// //         <div className="search-bar">
// //           <input
// //             type="text"
// //             placeholder="Search"
// //             value={searchTerm}
// //             onChange={handleSearch}
// //           />
// //         </div>
// //         <div className="conversations">
// //           {dummyData.map(chat => (
// //             <div
// //               key={chat.id}
// //               className={`conversation ${selectedChat.id === chat.id ? 'active' : ''}`}
// //               onClick={() => setSelectedChat(chat)}
// //             >
// //               <img src={chat.profilePicture} alt="Profile" />
// //               <div>
// //                 <div className="chat-name">{chat.name}</div>
// //                 <div className="latest-message">{chat.latestMessage}</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //       <div className="right-section">
// //         <div className="chat-header">
// //           <div className="job-info">
// //             <h3>{selectedChat.jobTitle}</h3>
// //             <p>{selectedChat.date}</p>
// //           </div>
// //           <hr />
// //         </div>
// //         <div className="chat-messages">
// //           {selectedChat.messages.map((message, index) => (
// //             <div key={index} className="message">
// //               <img src={message.sender.profilePicture} alt="Sender" />
// //               <div className="message-content">
// //                 <div className="sender-info">
// //                   <strong>{message.sender.name}</strong>
// //                   <span>{message.sender.status}</span>
// //                 </div>
// //                 <p>{message.text}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="message-input">
// //           <input type="text" placeholder="Write a message..." />
// //           <div className="input-icons">
// //             <button>📎</button>
// //             <button>😊</button>
// //             <button className="send-btn">Send</button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //     </>
// //   );
// // };

// // export default Chat;

// import React, { useState, useEffect } from "react";
// import "./styles.scss";
// import axios from "axios"; // For making API calls
// import { Header } from "../../components";
// import dummyData from "../../components/DummyData"; // You may replace this with actual user data

// const Chat = () => {
//   const [selectedChat, setSelectedChat] = useState(null); // No default chat selected
//   const [searchTerm, setSearchTerm] = useState("");
//   const [messages, setMessages] = useState([]); // Store chat messages
//   const [newMessage, setNewMessage] = useState(""); // Store new message input

//   // Fetch chat history when a user selects a conversation
//   useEffect(() => {
//     if (selectedChat) {
//       axios
//         .get(`/api/chat/getChatHistory/${selectedChat.id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         })
//         .then((response) => {
//           if (Array.isArray(response.data)) {
//             setMessages(response.data);
//           } else {
//             console.error("Chat history is not an array", response.data);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching chat history", error);
//         });
//     }
//   }, [selectedChat]);

//   // Handle sending a message
//   const sendMessage = () => {
//     axios
//       .post(
//         "/api/chat/sendMessage",
//         { send_to: selectedChat.id, message: newMessage },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       )
//       .then((response) => {
//         setMessages((prevMessages) => [...prevMessages, response.data]); // Add new message
//         setNewMessage(""); // Clear the input field
//       })
//       .catch((error) => {
//         console.error("Error sending message", error);
//       });
//   };

//   return (
//     <>
//       <Header />
//       <div className="chat-page">
//         <div className="left-section">
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="conversations">
//             {dummyData.map((chat) => (
//               <div
//                 key={chat.id}
//                 className={`conversation ${
//                   selectedChat && selectedChat.id === chat.id ? "active" : ""
//                 }`}
//                 onClick={() => setSelectedChat(chat)}
//               >
//                 <img src={chat.profilePicture} alt="Profile" />
//                 <div>
//                   <div className="chat-name">{chat.name}</div>
//                   <div className="latest-message">{chat.latestMessage}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="right-section">
//           <div className="chat-header">
//             {selectedChat && (
//               <>
//                 <h3>{selectedChat.jobTitle}</h3>
//                 <p>{selectedChat.date}</p>
//               </>
//             )}
//           </div>

//           {/* <div className="chat-messages">
//             {messages.map((message, index) => (
//               <div key={index} className="message">
//                 <img src={message.sender.profilePicture} alt="Sender" />
//                 <div className="message-content">
//                   <strong>{message.sender.name}</strong>
//                   <p>{message.text}</p>
//                 </div>
//               </div>
//             ))}
//           </div> */}
//           <div className="chat-messages">
//             {messages.length === 0 ? (
//               <p>No messages yet</p>
//             ) : (
//               messages.map((message, index) => (
//                 <div key={index} className="message">
//                   <img src={message.sender.profilePicture} alt="Sender" />
//                   <div className="message-content">
//                     <strong>{message.sender.name}</strong>
//                     <p>{message.text}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="message-input">
//             <input
//               type="text"
//               placeholder="Write a message..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//             />
//             <button className="send-btn" onClick={sendMessage}>
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Chat;

// =============================================================================================================

import React, { useState, useEffect } from "react";
import "./styles.scss";
import axios from "axios";
import { Header } from "../../components";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your server URL

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]); // Initialize as an empty array

  const [user, setUser] = useState(null); // Current user data (client)
  const freelancerData = JSON.parse(localStorage.getItem("freelancerData")); // Get freelancer data

  // ===============================

  useEffect(() => {
    // Fetch user information (client) and conversations from API
    axios
      .get("/api/user/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUser(response.data);
        loadConversations();
      });
  }, []);

  // Load list of conversations
  const loadConversations = () => {
    axios
      .get("/api/chat/conversations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setConversations(response.data);
      });
  };

  // Fetch chat history when a conversation is selected
  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    axios
      .get(`/api/chat/history/${chat.freelancerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setMessages(response.data);
      });
  };

  // Handle sending a message
  // const sendMessage = () => {
  //   if (newMessage && selectedChat) {
  //     const messageData = {
  //       text: newMessage,
  //       senderId: user.id,
  //       receiverId: selectedChat.freelancerId,
  //     };
  //     socket.emit("chat message", messageData); // Send message through socket
  //     setMessages([...messages, messageData]); // Update local message list
  //     setNewMessage(""); // Clear input
  //   }
  // };

  // Listen for incoming messages through socket
  useEffect(() => {
    socket.on("chat message", (msg) => {
      if (msg.receiverId === user.id) {
        // Check if message is for the current client
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });
    return () => {
      socket.off("chat message");
    };
  }, [user]);

  // =============================== this is old below

  useEffect(() => {
    if (freelancerData) {
      setSelectedChat({
        id: freelancerData.name,  // You can modify the ID based on your logic
        name: freelancerData.name,
        jobTitle: freelancerData.jobTitle,
        profilePicture: freelancerData.image,
      });
    }
  }, [freelancerData]);

  // Fetch chat history when a user selects a conversation
  useEffect(() => {
    if (selectedChat) {
      axios
        .get(`/api/chat/getChatHistory/${selectedChat.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          } else {
            console.error("Chat history is not an array", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching chat history", error);
        });
    }
  }, [selectedChat]);

  // // Listen for incoming messages
  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  // Handle sending a message
  const sendMessage = () => {
    if (newMessage) {
      const messageData = { text: newMessage, sender: { name: "Client" }, receiver: { name: selectedChat.name }, }; // Update as needed
      socket.emit("chat message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Add to current message list
      setNewMessage("");
    }
  };

  // ================================================this is old above

  //   return (
  //     <>
  //       <Header />
  //       <div className="chat-page">
  //         <div className="left-section">
  //           <div className="search-bar">
  //             <input
  //               type="text"
  //               placeholder="Search"
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //             />
  //           </div>
  //           {/* <div className="conversations">
  //             {dummyData.map((chat) => (
  //               <div
  //                 key={chat.id}
  //                 className={`conversation ${
  //                   selectedChat && selectedChat.id === chat.id ? "active" : ""
  //                 }`}
  //                 onClick={() => setSelectedChat(chat)}
  //               >
  //                 <img src={chat.profilePicture} alt="Profile" />
  //                 <div>
  //                   <div className="chat-name">{chat.name}</div>
  //                   <div className="latest-message">{chat.latestMessage}</div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div> */}
  //         </div>
  //         <div className="right-section">
  //           <div className="chat-header">
  //             {selectedChat && (
  //               <>
  //                 <h3>{selectedChat.jobTitle}</h3>
  //                 <p>{selectedChat.date}</p>
  //               </>
  //             )}
  //           </div>
  //           <div className="chat-messages">
  //             {messages.length === 0 ? (
  //               <p>No messages yet</p>
  //             ) : (
  //               messages.map((message, index) => (
  //                 <div key={index} className="message">
  //                   <img src={message.sender.profilePicture} alt="Sender" />
  //                   <div className="message-content">
  //                     <strong>{message.sender.name}</strong>
  //                     <p>{message.text}</p>
  //                   </div>
  //                 </div>
  //               ))
  //             )}
  //           </div>
  //           <div className="message-input">
  //             <input
  //               type="text"
  //               placeholder="Write a message..."
  //               value={newMessage}
  //               onChange={(e) => setNewMessage(e.target.value)}
  //             />
  //             <button className="send-btn" onClick={sendMessage}>
  //               Send
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };

  return (
    <>
      <Header />
      <div className="chat-page">
        <div className="left-section">
          <h2>Messages</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        </div>
        <div className="right-section">
          {selectedChat && (
            <>
              <div className="chat-header">
                <img src={selectedChat.profilePicture} alt="Freelancer" />
                <h3>{selectedChat.jobTitle}</h3>
              </div>
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div key={index} className="message">
                    <strong>{message.sender.name}</strong>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
