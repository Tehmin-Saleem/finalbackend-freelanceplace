// Chat.js
import React, { useState } from 'react';
import './styles.scss';
import dummyData from "../../components/DummyData";
import { Header } from '../../components';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(dummyData[0]); // Default to the first chat
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredChats = dummyData.filter(chat => 
      chat.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSelectedChat(filteredChats[0] || dummyData[0]);
  };

  return (
    <>
    <Header/>
    <div className="chat-page">
      <div className="left-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm} 
            onChange={handleSearch}
          />
        </div>
        <div className="conversations">
          {dummyData.map(chat => (
            <div 
              key={chat.id} 
              className={`conversation ${selectedChat.id === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <img src={chat.profilePicture} alt="Profile" />
              <div>
                <div className="chat-name">{chat.name}</div>
                <div className="latest-message">{chat.latestMessage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right-section">
        <div className="chat-header">
          <div className="job-info">
            <h3>{selectedChat.jobTitle}</h3>
            <p>{selectedChat.date}</p>
          </div>
          <hr />
        </div>
        <div className="chat-messages">
          {selectedChat.messages.map((message, index) => (
            <div key={index} className="message">
              <img src={message.sender.profilePicture} alt="Sender" />
              <div className="message-content">
                <div className="sender-info">
                  <strong>{message.sender.name}</strong>
                  <span>{message.sender.status}</span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input type="text" placeholder="Write a message..." />
          <div className="input-icons">
            <button>📎</button>
            <button>😊</button>
            <button className="send-btn">Send</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chat;
