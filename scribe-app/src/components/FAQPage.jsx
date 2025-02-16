import "./FAQ.css";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      
      <div className="faq-item">
        <h2>📌 What is SCRIBE?</h2>
        <p>SCRIBE is a RAG-based AI chatbot that retrieves information from the SCU digital archives to provide accurate and contextual responses.</p>
      </div>

      <div className="faq-item">
        <h2>📌 How does SCRIBE work?</h2>
        <p>SCRIBE uses a combination of natural language processing and vector search to fetch relevant documents before generating responses.</p>
      </div>

      <div className="faq-item">
        <h2>📌 Is SCRIBE free to use?</h2>
        <p>Yes! SCRIBE is free to use for research and general inquiries.</p>
      </div>

      <div className="faq-item">
        <h2>📌 How can I contribute?</h2>
        <p>We welcome feedback and contributions! If you would like to help, reach out to our development team.</p>
      </div>
    </div>
  );
};

export default FAQ;