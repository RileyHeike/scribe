import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import BouncingDotsLoader from "./BouncingDots";
import { TypeAnimation } from 'react-type-animation';

const Chat = ({ messages, welcomeVisible, urlGroups, isLoading }) => {
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
        <>
          <div className="welcome-text">
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Welcome to SCRIBE',
                1000
              ]}
              wrapper="span"
              speed={75}
              style={{ fontSize: '2em', display: 'inline-block' }}
              repeat={0} />
            <div className="welcome-message">
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'A RAG-based AI chatbot built to unearth buried stories and bring SCU digital archives to life.',
                  1000
                ]}
                wrapper="span"
                speed={70}
                style={{ fontSize: '2em', display: 'inline-block' }}
                repeat={0} />
            </div>
          </div></>
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
        {isLoading && <div
          className={`chat-bubble ai-message`}
        >
          <BouncingDotsLoader></BouncingDotsLoader>
        </div>}
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