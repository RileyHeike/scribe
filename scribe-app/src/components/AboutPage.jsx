import "./About.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>About SCRIBE</h1>
      
      <p className="subtitle">
        Uncovering Hidden Stories – One Query at a Time
      </p>

      <p>
        <strong>SCRIBE</strong> is a RAG-based AI chatbot designed to retrieve and synthesize 
        information from the SCU digital archives. By integrating retrieval-augmented generation (RAG) 
        with a vector search model, SCRIBE is capable of contextually accurate and relevant responses.
      </p>

      <h2>🔍 How SCRIBE Works</h2>
      <ul>
        <li><strong>1. Query Understanding:</strong> The chatbot analyzes user input to extract key intent and topics.</li>
        <li><strong>2. Document Retrieval:</strong> A vector search model retrieves the most relevant documents from the SCU archives.</li>
        <li><strong>3. Contextual Synthesis:</strong> Using OpenAI’s GPT-4 model, the chatbot processes the retrieved data and generates a coherent response.</li>
        <li><strong>4. Feedback Loop:</strong> Continuous improvements are made based on user interactions and accuracy checks.</li>
      </ul>

      <h2>⚙️ Tech Stack</h2>
      <ul>
        <li><strong>Frontend:</strong> React (Vite)</li>
        <li><strong>Backend:</strong> Flask (Python), OpenAI API</li>
        <li><strong>Retrieval Model:</strong> RAG Vector Search</li>
        <li><strong>Data Processing:</strong> Webscraping, Python Scripting</li>
        <li><strong>Database:</strong> MongoDB</li>
      </ul>

      <p>
        Our goal is to make the SCU digital archives more accessible and interactive. 
        If you have feedback or suggestions, feel free to reach out to the development team!
      </p>
    </div>
  );
};

export default AboutPage;