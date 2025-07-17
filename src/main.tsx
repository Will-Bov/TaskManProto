import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Simple error boundary for the root component
const Root = () => (
  <div className="min-h-screen bg-gray-100">
    <App />
  </div>
);

createRoot(document.getElementById("root")!).render(<Root />);