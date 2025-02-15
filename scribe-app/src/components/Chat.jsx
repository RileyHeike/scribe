import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Chat = ({ messages, welcomeVisible }) => {
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (messages.length > 0) {
      setFade(false);
    }
  }, [messages]);

  return (
    <div className="chat-window">
      {welcomeVisible && fade && (
        <div className="welcome-text">
          <h1>Welcome to SCRIBE</h1>
          <div className="welcome-message">
            <p>A RAG-based AI chatbot built to unearth buried stories and bring SCU digital archives to life.</p>
          </div>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index} className={`chat-bubble ${msg.role}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  welcomeVisible: PropTypes.bool.isRequired,
};

export default Chat;