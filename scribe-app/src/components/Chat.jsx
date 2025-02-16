import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";

const Chat = ({ messages, welcomeVisible, urlGroups }) => {
  const [fade, setFade] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      setFade(false);
    }

    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
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


      <div className="chat-messages">{messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-bubble ${msg.role === "assistant" ? "ai-message" : "user-message"}`} // Apply different styles
        >
          {msg.text}
          <div className='url'>
            {urlGroups[(index - 1) / 2] ? urlGroups[(index - 1) / 2][0] : <></>}
          </div>
          <div className='url'>
            {urlGroups[(index - 1) / 2] ? urlGroups[(index - 1) / 2][1] : <></>}
          </div>
          <div className='url'>
            {urlGroups[(index - 1) / 2] ? urlGroups[(index - 1) / 2][2] : <></>}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
      </div>
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