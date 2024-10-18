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



const ScrollableChat = ({ messages }) => {
  const [userData, setuserData] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
 
  const { user, selectedFreelancer } = ChatState();
 
 
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
