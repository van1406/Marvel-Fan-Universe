import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/Auth.css";
import "./styles/Dashboard.css";
import "./styles/MarvelMovies.css";
import App from "./App.jsx";
import "./styles/DayNight.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
