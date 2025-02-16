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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    const newMessage = { role: "user", text };
    const updatedConversation = [...currentConversation, newMessage];
  
    setCurrentConversation(updatedConversation);
    setWelcomeVisible(false);
  
    // Update the existing conversation
    handleUpdateConversation(updatedConversation);
  };
  
  const handleUpdateConversation = (updatedConversation) => {
    setConversations((prevConversations) => {
      if (prevConversations.length === 0) {
        // If there are no conversations, create a new one
        return [{ title: `Conversation 1`, messages: updatedConversation }];
      }
  
      // Update the latest conversation instead of adding a new one
      return prevConversations.map((conv, index) =>
        index === 0 ? { ...conv, messages: updatedConversation } : conv
      );
    });
  };
  
  const handleLoadConversation = (messages) => {
    setCurrentConversation(messages);
    setWelcomeVisible(false);
    setSidebarOpen(false);
    navigate("/"); // Ensure user is redirected back to chat page
  };

  const handleNewConversation = () => {
    if (currentConversation.length > 0) {
      handleUpdateConversation(currentConversation);
    }
    setCurrentConversation([]);
    setWelcomeVisible(true);
    setSidebarOpen(false);
    navigate("/"); // Ensure user is redirected back to chat page
  };

  return (
    <div className="app-container">
      {!sidebarOpen && (
        <button className="hamburger-menu" onClick={() => setSidebarOpen(true)}>☰</button>
      )}

      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        <button className="new-conversation-btn" onClick={handleNewConversation}>➕ New Conversation</button>
        <ConversationHistory conversations={conversations} onLoadConversation={handleLoadConversation} /> 

        <div className="sidebar-buttons">
          <button><Link to='/about'>About</Link></button>
          <button><Link to='/faq'>FAQ</Link></button>
        </div>
      </div>

      <div className="chat-container">
        <Routes>
          <Route path="/" element={<>
            <Chat messages={currentConversation} welcomeVisible={welcomeVisible} />
            <ChatInput onSendMessage={handleSendMessage} />
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
