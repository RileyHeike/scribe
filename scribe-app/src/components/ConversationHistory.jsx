import PropTypes from "prop-types";

const ConversationHistory = ({ conversations, onLoadConversation }) => {

  return (
    <div className="sidebar-content">
      <h2 className="sidebar-title">Conversations</h2>
      <ul className="conversation-list">
        {conversations.length === 0 ? (
          <p style={{ color: "gray", fontSize: "14px", textAlign: "center" }}>No conversations yet</p>
        ) : (
          conversations.map((conv, index) => (
            <li 
              key={index} 
              className="conversation-item"
              onClick={() => onLoadConversation(conv.messages)}
            >
              {conv.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

ConversationHistory.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(
        PropTypes.shape({
          role: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  onLoadConversation: PropTypes.func.isRequired,
};

export default ConversationHistory;