import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  // const [token, settoken] = useState();
  const [chats, setChats] = useState([]);

  const navigate = useNavigate(); // Use navigate from react-router-dom

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // const token = (localStorage.getItem("token"));
    console.log(userInfo);
    setUser(userInfo);
    

    



    if (!userInfo) navigate("/"); // Replace history.push with navigate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        // token,
        // settoken,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
