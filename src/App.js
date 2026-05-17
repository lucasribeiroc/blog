import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Blog from "./components/Blog";
import Admin from "./components/Admin";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
