import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../ChatLogic/index";
import { ChatState } from "../../../context/ChatProvider";
import "./styles.scss";
import io from "socket.io-client";


const ENDPOINT = "http://localhost:5000";
var socket;



const ScrollableChat = () => {
  const [userData, setuserData] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForbiddenPopup, setShowForbiddenPopup] = useState(false); // For handling forbidden errors
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
  
  const { user, selectedFreelancer, messages, setMessages , setChats, selectedChat,
    } = ChatState();




  useEffect(() => {
    socket = io(ENDPOINT);
    // Wait for connection to establish
    socket.on("connect", () => {
      console.log("Connected to socket.io server");
    });

    return () => {
      // Clean up on component unmount
      socket.disconnect();
    };
  }, []);

  
 

 
 
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  useEffect(() => {
    const fetchFreelancerProfileData = async () => {
      // Clear previous data before fetching new data
      setuserData("");
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (!userRole) {
          throw new Error("No role found in token");
        }

        if (!selectedFreelancer) {
          console.warn("No selected freelancer");
          setIsLoading(false); // Stop loading since no selection
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        let response;
        if (userRole === "client") {
          response = await axios.get(
            `http://localhost:5000/api/freelancer/profilebyfreelancerid/${selectedFreelancer}`,
            { headers }
          );
          console.log("Freelancer data fetched successfully:", response.data);
          setuserData(response.data);
        } else if (userRole === "freelancer") {
          response = await axios.get(
            `http://localhost:5000/api/client/users/${selectedFreelancer}`,
            { headers }
          );
          console.log("Client data fetched successfully:", response.data);
          const fetchedInitials = getInitials(
            response.data.first_name,
            response.data.last_name
          );
          setuserData({ ...response.data, initials: fetchedInitials });
        } else {
          throw new Error("Unknown user role");
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false); // Stop loading once fetching is done
      }
    };

    fetchFreelancerProfileData();
  }, [selectedFreelancer]);


  const handleRightClickMessage = (e, messageId) => {
    e.preventDefault(); // Prevent default right-click menu
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      messageId,
    });
  };


    // Close the context menu when clicking elsewhere
    useEffect(() => {
      const handleClickOutside = () => {
        if (contextMenu.visible) {
          setContextMenu({ visible: false, messageId: null });
        }
      };
  
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [contextMenu.visible]);


  //   socket.on("messageDeleted", ({ messageId, chatId, latestMessage }) => {
  //     // Step 1: Remove the deleted message from the messages list
  //     setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
  
  //     // Step 2: Update the chats list to reflect the new latest message
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat._id === chatId ? { ...chat, latestMessage } : chat
  //       )
  //     );
  //   });
  
  //   return () => {
  //     socket.off("message recieved");
  //     socket.off("messageDeleted");
  //   };
  // }, [messages, setMessages, setChats]);
    
    




  // const deleteMessage = async (messageId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  
  //     if (!token) {
  //       throw new Error("No token found");
  //     }
  
  //     const decodedToken = jwtDecode(token);
  //     const userRole = decodedToken.role;
  
  //     let route;
  //     if (userRole === "client") {
  //       route = `http://localhost:5000/api/client/Message/${messageId}`;
  //     } else if (userRole === "freelancer") {
  //       route = `http://localhost:5000/api/freelancer/Message/${messageId}`;
  //     } else {
  //       console.error("Invalid user role.");
  //       setError("Invalid user role. Please log in again.");
  //       return;
  //     }
  
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  
  //     const { data } = await axios.delete(route, config); // Use the correct route based on role
  
  //     setContextMenu({ visible: false, messageId: null }); // Close context menu after deletion
  
  //     // Update UI after message is deleted
      
  //     setMessages(messages.filter((message) => message._id !== messageId));
  
  //     // Update the latest message in the chat list if it has changed
  //     if (data.latestMessage) {
  //       setChats((prevChats) =>
  //         prevChats.map((chat) =>
  //           chat._id === selectedChat._id
  //             ? { ...chat, latestMessage: data.latestMessage }
  //             : chat
  //         )
  //       );
  //     }
  
  //   } catch (error) {
  //     if (error.response && error.response.status === 403) {
  //       setShowForbiddenPopup(true); // Show forbidden popup
  //     } else {
  //       setError("Failed to delete the message");
  //     }
  //   }
  // };
  




  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No token found");
      }
  
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
  
      let route;
      if (userRole === "client") {
        route = `http://localhost:5000/api/client/Message/${messageId}`;
      } else if (userRole === "freelancer") {
        route = `http://localhost:5000/api/freelancer/Message/${messageId}`;
      } else {
        console.error("Invalid user role.");
        setError("Invalid user role. Please log in again.");
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Send delete request to the server
      const { data } = await axios.delete(route, config); // Use the correct route based on role
  
      // Close context menu after deletion
      setContextMenu({ visible: false, messageId: null });
  
      // Emit the "delete message" event to Socket.io for real-time updates
      socket.emit("delete message", messageId);
  
      // Update UI to remove the message locally
      setMessages(messages.filter((message) => message._id !== messageId));
  
      // Update the latest message in the chat list if it has changed
      if (data.latestMessage) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, latestMessage: data.latestMessage }
              : chat
          )
        );
      }
  
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setShowForbiddenPopup(true); // Show forbidden popup
      } else {
        setError("Failed to delete the message");
      }
    }
  };
  


  return (
    <ScrollableFeed>
      <>
      {messages &&
        messages.map((m, i) => (
          <div className="message-row" style={{ display: "flex" }} key={m._id} onContextMenu={(e) => handleRightClickMessage(e, m._id)}>
            {(isSameSender(
              messages,
              m,
              i,
              user.data?.freelancer_id || user._id
            ) ||
            isLastMessage(
              messages,
              i,
              user.data?.freelancer_id || user._id
            )) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="xs"
                  cursor="pointer"
                  name={userData?.initials || m.sender.name}
                  // Conditionally set the image source based on whether the user is a freelancer or client
                  src={
                    userData.data?.freelancer_id
                    ? userData.data.image
                    : m.sender.pic
                  }
                  style={{ width: "25px", height: "25px", marginRight: "10px" }}
                  />
              </Tooltip>
            )}

            {/* Message Content and Attachments */}
            <div className="message-content">
              {/* <p>{m.content}</p> */}

              {/* Attachments */}
              {m.attachment && (
                <div className="attachment">
                  <p>{m.attachment.description}</p>
                  {m.attachment.path &&
                    (m.attachment.fileName.endsWith(".jpg") ||
                    m.attachment.fileName.endsWith(".jpeg") ||
                    m.attachment.fileName.endsWith(".png") ? (
                      <img
                        src={`/${m.attachment.path}`}
                        alt={m.attachment.fileName}
                      />
                    ) : (
                      <a
                      href={`/${m.attachment.path}`}
                        download={m.attachment.fileName}
                        >
                        {m.attachment.fileName}
                      </a>
                    ))}
                </div>
              )}
            </div>

            <span
            onContextMenu={(e) => handleRightClickMessage(e, m._id)}
              style={{
                backgroundColor: `${
                  m.sender._id === (user.data?.freelancer_id || user._id)
                  ? "#BEE3F8"
                  : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user.data?.freelancer_id || user._id
                ),
                marginTop: isSameUser(
                  messages,
                  m,
                  i,
                  user.data?.freelancer_id || user._id
                )
                ? 8
                  : 10,
                  borderRadius: "8px",
                  padding: "8px 12px",
                  maxWidth: "75%",
                }}
                >
              {m.content}
            </span>
          </div>
        ))}

        {/* Context menu for deleting message */}
     {/* Context menu for deleting message */}
     {contextMenu.visible && (
       <div
       className="context-menu"
       style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <button onClick={() => deleteMessage(contextMenu.messageId)}>Delete Message</button>
        </div>
      )}


      {/* Forbidden pop-up */}
      {showForbiddenPopup && (
        <div className="popup">
          <div className="popup-inner">
            <p>You are not authorized to delete this message.</p>
            <button
              onClick={() => {
                setShowForbiddenPopup(false);
                setContextMenu({ visible: false, messageId: null }); // Close both pop-up and context menu
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}


              </>

    </ScrollableFeed>
  );
};

export default ScrollableChat;
