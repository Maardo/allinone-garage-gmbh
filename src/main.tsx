
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure we're creating the root element correctly
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(<App />);
