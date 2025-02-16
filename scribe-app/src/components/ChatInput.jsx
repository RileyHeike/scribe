import PropTypes from "prop-types";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';


const ChatInput = ({ onSendMessage, conversationContext, setConversationContext }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      console.log("No message entered");
      return;
    }
  
    const userMessage = { role: "user", text: message };
    onSendMessage(userMessage); // Send the user message
  
    try {
      const payload = JSON.stringify({ prompt: message, context: conversationContext });
      console.log("Payload:", payload);
  
      const response = await fetch("http://localhost:5005/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (data.context) {
        let aiText = data.context[data.context.length - 1]?.content + "\n\nHere are some relevant documents and artifacts:\n\n"
        const urls = []
        for (let i = 0; i < 3; i++) {
          if (data.docs[i]) {
            let doc = data.docs[i]
            let url = `https://content.scu.edu/digital/collection/${doc.collection}/id/${doc.id}/rec/1`
            urls.push(<a href={url} target="_blank" key={i} rel="noopener noreferrer">{url}</a>);
          }
        }
        const aiResponse = {
          role: "assistant",  // Ensure the role is set to 'assistant'
          text: aiText || "No response from AI.",
          urls
        };
        onSendMessage(aiResponse); // Send the AI response
  
        setConversationContext(data.context); // Update conversation context
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  
    setMessage(""); // Clear the input after sending
  };
  
  

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}><FaSearch /></button>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  conversationContext: PropTypes.array.isRequired,
  setConversationContext: PropTypes.func.isRequired,
};

export default ChatInput;