import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create the Chat Context
const ChatContext = createContext();

// Chat Provider component, provides chat state to the entire app
export const ChatProvider = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [conversations, setConversations] = useState([]);

  // Log the updated conversations
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