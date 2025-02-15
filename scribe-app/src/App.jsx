import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import ChatInput from "./components/ChatInput";
import ConversationHistory from "./components/ConversationHistory";
import AboutPage from "./components/AboutPage";
import FAQPage from "./components/FAQPage";

const App = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  };

  const handleNewConversation = () => {
    if (currentConversation.length > 0) {
      handleSaveConversation(); // Save current chat before starting a new one
    }
    setCurrentConversation([]); // Reset conversation
    setWelcomeVisible(true);
    setSidebarOpen(false); // Close sidebar
  };

  return (
    <Router>
      <div className="app-container">
        {/* Hamburger Menu */}
        {!sidebarOpen && (
          <button className="hamburger-menu" onClick={() => setSidebarOpen(true)}>☰</button>
        )}

        {/* Sidebar Overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
          
          {/* New Conversation Button at the Top */}
          <button className="new-conversation-btn" onClick={handleNewConversation}>+ New Conversation</button>

          {/* Conversation History */}
          <ConversationHistory conversations={conversations} onLoadConversation={handleLoadConversation} />

          {/* Sidebar Navigation Buttons */}
          <div className="sidebar-buttons">
            <button><a href="/about">About</a></button>
            <button><a href="/faq">FAQ</a></button>
            <button><a target='_blank' href="https://content.scu.edu/">SCU Digital Archives</a></button>
          </div>
        </div>

        {/* Main Content Area */}
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
    </Router>
  );
};

export default App;