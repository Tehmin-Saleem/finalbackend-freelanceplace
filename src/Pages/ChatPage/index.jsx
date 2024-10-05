import React, { useState, useEffect } from "react";
import "./styles.scss";
import axios from "axios";
import { Header } from "../../components";

// const socket = io("http://localhost:5173"); // Replace with your server URL

const Chat = () => {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState(""); // State for error messages

  // Function to open the drawer
  const handleSearchClick = () => {
    setIsDrawerOpen(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSearch = async () =>{
    if (!search) {
      setError("Please enter something in the search."); // Show error if input is empty
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear previous error messages

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // i have to correct the route here ..........
      const { data } = await axios.get(`/api/client/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data); // Store the search result

    } catch (error) {
      setLoading(false);
      setError("Failed to load search results. Please try again."); // Handle error
    }
  };


  return (
    <>
      <Header />
      <div className="chat-page">
      <div className="chat-header">

      </div>
        <div className="left-section">
          <h2>Messages</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              onClick={handleSearchClick}
            />
          </div>
          <div className="list">

          </div>
        </div>
        <div className="right-section">

            <>
              <div className="chat-header">

                <h3>jobtitle</h3>
              </div>
              <div className="chat-messages">

              </div>

              <div className="message-input">
                <input
                  type="text"
                  placeholder="Write a message..."

                />
                <button>Send</button>
              </div>
            </>

        </div>

        {/* Side Drawer */}
        <div className={`side-drawer ${isDrawerOpen ? "open" : ""}`}>
          <div className="drawer-header">
            <h3>Search</h3>
            <button onClick={closeDrawer}>X</button> {/* Close drawer button */}
          </div>
          <div className="drawer-search-bar">
            <input type="text" 
            placeholder="Search Users" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}/>
            <button className="drawer-search-bar-button" onClick={handleSearch}>Go</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
