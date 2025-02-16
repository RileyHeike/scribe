import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import ChatInput from "./components/ChatInput";
import ConversationHistory from "./components/ConversationHistory";
import AboutPage from "./components/AboutPage";
import FAQPage from "./components/FAQPage";
import { useChat } from "./context/ChatContext"; // Import Chat Context


const App = () => {
  const {
    currentConversation, setCurrentConversation,
    welcomeVisible, setWelcomeVisible,
    conversations, setConversations
  } = useChat();

  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [urlGroups, setUrlGroups] = useState([]);
  const navigate = useNavigate();

  const [conversationContext, setConversationContext] = useState([]); // Stores all conversations
  const [activeConversationIndex, setActiveConversationIndex] = useState(null); // Tracks which conversation is selected

  const handleSendMessage = ({ role, text, urls }) => {
    setUrlGroups([...urlGroups, urls ?? []])
    console.log("urls", urlGroups)
    if (!text.trim()) return; // Don't send empty messages
  
    const newMessage = { role, text };
  
    // Check if there is an active conversation
    if (activeConversationIndex !== null) {
      // Append the message to the active conversation
      setConversations((prevConversations) => {
        return prevConversations.map((conv, index) =>
          index === activeConversationIndex
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        );
      });
    } else {
      // Create a new conversation if no active conversation is selected
      const newTitle = `Conversation ${conversations.length + 1}`;
      const newConversation = { title: newTitle, messages: [newMessage] };
  
      // Add the new conversation to the list of conversations
      setConversations([newConversation, ...conversations]); 
      setActiveConversationIndex(0); 
    }
  
    // Also update the current conversation to show the most recent message
    setCurrentConversation((prevMessages) => [...prevMessages, newMessage]);
    setWelcomeVisible(false); 
  };
  
  //Load conversation, set current convo, set active convo index, hide welcome screen, close sidebar, nav to /
  const handleLoadConversation = (messages, index) => {
    setCurrentConversation(messages); 
    setActiveConversationIndex(index); 
    setWelcomeVisible(false);
    setSidebarOpen(false);
    navigate("/"); 
  };
  
  //Reset active convo, current convo, and welcome screen, nav to /
  const handleNewConversation = () => {
    setActiveConversationIndex(null); 
    setCurrentConversation([]);
    setWelcomeVisible(true);
    setSidebarOpen(false);
    navigate("/"); 
  };

  return (
    <div className="app-container">
      {!sidebarOpen && (
        <button className="hamburger-menu" onClick={() => setSidebarOpen(true)}>☰</button>
      )}

      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        <button className="new-conversation-btn" onClick={handleNewConversation}>New Conversation</button>
        <ConversationHistory conversations={conversations} onLoadConversation={handleLoadConversation} /> 

        <div className="sidebar-buttons">
          <button><Link to='/about'>About</Link></button>
          <button><Link to='/faq'>FAQ</Link></button>
          <button><a href="https://content.scu.edu/" target="_blank">SCU Digital Archives</a></button>
        </div>
      </div>

      <div className="chat-container">
        <Routes>
          <Route path="/" element={<>
            <Chat messages={currentConversation} welcomeVisible={welcomeVisible} urlGroups={urlGroups} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} conversationContext={conversationContext} setConversationContext={setConversationContext} setIsLoading={setIsLoading}/>
          </>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
