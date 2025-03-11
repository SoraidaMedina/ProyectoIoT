import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Verifica que App.jsx está en la misma carpeta
import "./index.css"; // Verifica que index.css existe
import "bootstrap/dist/css/bootstrap.min.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
