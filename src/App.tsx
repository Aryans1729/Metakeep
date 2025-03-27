// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeveloperView from "./components/DeveloperView";
import UserView from "./components/UserView";
// Use the path alias
import gradientBg from "./assets/Gradient.webp"

const appStyle: React.CSSProperties = {
  backgroundImage: `url(${gradientBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  minHeight: "100vh",
  width: "100%",
};

const App: React.FC = () => {
  return (
    <div style={appStyle}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/developer" element={<DeveloperView />} />
          <Route path="/user" element={<UserView />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;