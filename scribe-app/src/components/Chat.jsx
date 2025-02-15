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
          <p>RAG-based digital archive query model. Type a message to start the conversation.</p>
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