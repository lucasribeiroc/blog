import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Blog from "./components/Blog";
import PostPage from "./components/PostPage";
import Admin from "./components/Admin";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/posts/:id" element={<PostPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
