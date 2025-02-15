import { useState } from "react";
import Chat from "./components/Chat";
import ChatInput from "./components/ChatInput";
import ConversationHistory from "./components/ConversationHistory";

const App = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar always starts closed

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
    setSidebarOpen(false); // Close the sidebar when a conversation is selected
  };

  return (
    <div className="app-container">
      {/* Hamburger Menu */}
      {!sidebarOpen && (
         <button className="hamburger-menu" onClick={() => setSidebarOpen(true)}>☰</button>
      )}
      {/* Sidebar Overlay - Permanently Toggled by the Button */}
      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        <ConversationHistory
          conversations={conversations}
          onLoadConversation={handleLoadConversation}
        />
      </div>

      {/* Chat Section */}
      <div className="chat-container">
        <Chat messages={currentConversation} welcomeVisible={welcomeVisible} />
        <ChatInput onSendMessage={handleSendMessage} />
        <button className="save-button" onClick={handleSaveConversation}>Save Conversation</button>
      </div>
    </div>
  );
};

export default App;