import "./App.css";
import Main from "./components/Main.jsx";
// import Login from "./components/Login.jsx";
import Navigator from "./components/nav/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Regist from "./components/Regist/RegistForm";
import Login from "./components/Login";
import Register from "./components/Regist/Register";
function App() {
  const [code, setCode] = useState("1");
  const handleIsLogin = (data) => {
    setCode(data);
  };
  return (
    <div className="App">
      {/* <Register /> */}
      <Router>
        <Navigator status={code} isLogin={handleIsLogin} />
        <Routes>
          <Route path="/" element={<Main status={code} />} />
          <Route path="/login" element={<Login isLogin={handleIsLogin} />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
