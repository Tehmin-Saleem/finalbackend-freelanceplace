import { Avatar } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../ChatLogic/index";
import { ChatState } from "../../../context/ChatProvider";
import "./styles.scss";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.user.userId) ||
              isLastMessage(messages, i, user.user.userId)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="xs"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  style={{ width: "25px", height: "25px" }}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.user.userId ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.user.userId),
                marginTop: isSameUser(messages, m, i, user.user.userId) ? 8 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
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