
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create production build optimizations
const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

// In production, disable React strict mode for better performance
createRoot(root).render(<App />);
