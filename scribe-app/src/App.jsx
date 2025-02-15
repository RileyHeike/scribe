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
    setCurrentConversation([...currentConversation, newMessage]);
    setWelcomeVisible(false);
  };

  const handleSaveConversation = () => {
    if (currentConversation.length === 0) return;
    const newTitle = `Conversation ${conversations.length + 1}`;
    setConversations([{ title: newTitle, messages: currentConversation }, ...conversations]);
    setCurrentConversation([]);
    setWelcomeVisible(true);
  };

  const handleLoadConversation = (messages) => {
    setCurrentConversation(messages);
    setWelcomeVisible(false);
    setSidebarOpen(false);
    navigate("/"); // Ensure user is redirected back to chat page
  };

  const handleNewConversation = () => {
    if (currentConversation.length > 0) {
      handleSaveConversation();
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
            <button className="save-button" onClick={handleSaveConversation}>Save Conversation</button>
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