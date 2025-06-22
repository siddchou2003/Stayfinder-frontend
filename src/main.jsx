// Enable React Strict Mode for highlighting potential problems
import { StrictMode } from 'react'

// React 18+ root rendering API
import { createRoot } from 'react-dom/client'

// Global styles
import './index.css'

// Main application component
import App from './App.jsx'

// Authentication context provider for global state management
import { AuthProvider } from './context/AuthContext';

// Mount the React app into the root DOM element
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)