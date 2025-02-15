import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ChatProvider } from './context/ChatContext'; // Import ChatProvider
import './App.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider> {/* Provide chat state to the entire app */}
        <App />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>,
);