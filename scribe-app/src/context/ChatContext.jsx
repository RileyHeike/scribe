import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create the Chat Context
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [conversations, setConversations] = useState([]);

    // Debug
  useEffect(() => {
    console.log("Updated Conversations:", conversations);
  }, [conversations]);

  return (
    <ChatContext.Provider value={{ 
        currentConversation, setCurrentConversation, 
        welcomeVisible, setWelcomeVisible,
        conversations, setConversations,
        }}>
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using Chat Context
export const useChat = () => {
  return useContext(ChatContext);
};