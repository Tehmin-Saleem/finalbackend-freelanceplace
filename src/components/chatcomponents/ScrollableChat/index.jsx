import { Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { jwtDecode } from "jwt-decode";
import { proxy, useSnapshot } from "valtio";
import axios from "axios";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../ChatLogic/index";
import { ChatState } from "../../../context/ChatProvider";
import "./styles.scss";

const state = proxy({
  user: {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    country_name: "",
  },
  dropdownOpen: false,
  selectedOption: "",
  hoveredOption: "",
});

const ScrollableChat = ({ messages }) => {
  const snap = useSnapshot(state);
  const [error, setError] = useState(""); // State for error messages
  const [userData, setuserData] = useState("");
  const { user, selectedFreelancer } = ChatState();

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // const initials = getInitials(snap.user.first_name, snap.user.last_name);

  const retryFetch = async (url, options, retries = 3, delay = 1000) => {
    try {
      const response = await axios.get(url, options);
      return response;
    } catch (err) {
      if (retries === 0) throw err;
      await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
      return retryFetch(url, options, retries - 1, delay * 2); // Retry with exponential backoff
    }
  };

  useEffect(() => {
    const fetchFreelancerProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role; // Assuming role is included in the token (client/freelancer)
        const userId = selectedFreelancer;
        console.log("user ", selectedFreelancer);

        const headers = { Authorization: `Bearer ${token}` };

        if (userRole === "client") {
          const response = await retryFetch(
            `http://localhost:5000/api/freelancer/profilebyfreelancerid/${selectedFreelancer}`,
            { headers }
          );
          setuserData(response.data);
        } else if (userRole === "freelancer") {
          const response = await axios.get(
            `http://localhost:5000/api/client/users/${userId}`
          );
          state.user = response.data;

          // Calculate initials after fetching the data
          const fetchedInitials = getInitials(
            response.data.first_name,
            response.data.last_name
          );
          setuserData({ initials: fetchedInitials });
        }
      } catch (err) {
        console.error("Error fetching freelancer data:", err);
        setError(err.message || "Failed to fetch freelancer data");
      }
    };

    fetchFreelancerProfileData();
  }, [selectedFreelancer]);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="message-row" style={{ display: "flex" }} key={m._id}>
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
    </ScrollableFeed>
  );
};

export default ScrollableChat;
