// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeveloperView from "./components/DeveloperView";
import UserView from "./components/UserView";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/developer" element={<DeveloperView />} />
        <Route path="/user" element={<UserView />} />
      </Routes>
    </Router>
  );
};

export default App;
