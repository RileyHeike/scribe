import { useState, useEffect } from "react";
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

    // Save the ongoing conversation
    handleSaveOngoingConversation(updatedConversation);
  };

  const handleSaveOngoingConversation = (updatedConversation) => {
    if (updatedConversation.length === 0) return;

    setConversations((prevConversations) => {
      if (prevConversations.length === 0) {
        // If no previous conversations exist, start with the first one
        return [{ title: `Conversation 1`, messages: updatedConversation }];
      }

      // Find the current conversation in the list and update it
      return prevConversations.map((conv, index) =>
        index === 0 ? { ...conv, messages: updatedConversation } : conv
      );
    });
  };

  const handleNewConversation = () => {
    if (currentConversation.length > 0) {
      // Save current conversation before creating a new one
      setConversations((prevConversations) => [
        ...prevConversations, // Keep old conversations
        { title: `Conversation ${prevConversations.length + 1}`, messages: currentConversation }
      ]);
    }

    // Clear the chat for a fresh start
    setCurrentConversation([]);
    setWelcomeVisible(true);
    setSidebarOpen(false);
    navigate("/"); // Redirect user to chat page
  };

  const handleLoadConversation = (messages) => {
    setCurrentConversation(messages);
    setWelcomeVisible(false);
    setSidebarOpen(false);
    navigate("/"); // Redirect user to chat page
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
