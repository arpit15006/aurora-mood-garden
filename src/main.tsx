import { createRoot } from 'react-dom/client';
// import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Temporarily bypassing Clerk
createRoot(document.getElementById("root")!).render(
  <App />
);
