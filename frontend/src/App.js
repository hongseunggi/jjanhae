import "./App.css";
import Main from "./components/Main.jsx";
import Login from "./components/Login/Login.jsx";
import Navigator from "./components/nav/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Register from "./components/Regist/Register";
import FindId from "./components/FindId/FindId";
function App() {
  const [code, setCode] = useState("1");
  const handleIsLogin = (data) => {
    setCode(data);
  };
  return (
    <div className="App">
      <Router>
        <Navigator status={code} isLogin={handleIsLogin} />
        <Routes>
          <Route path="/" element={<Main status={code} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/findId" element={<FindId />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
