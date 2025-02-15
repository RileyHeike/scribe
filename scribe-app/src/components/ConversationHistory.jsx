import PropTypes from "prop-types";

const ConversationHistory = ({ conversations, onLoadConversation }) => {
  return (
    <div className="history-panel">
      <h2>Conversations</h2>
      {conversations.length === 0 ? <p>No conversations yet</p> : null}
      <ul>
        {conversations.map((conv, index) => (
          <li key={index} onClick={() => onLoadConversation(conv.messages)}>
            {conv.title}
          </li>
        ))}
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