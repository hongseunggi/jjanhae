import "./App.css";
import Main from "./components/Main.jsx";
import Login from "./components/Login/Login.jsx";
import Navigator from "./components/nav/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
<<<<<<< HEAD
import Login from "./components/Login";
import Register from "./components/Regist/Register";
=======
import Register from "./components/Regist/Register";
import FindId from "./components/FindId/FindId";
import FindPwd from "./components/FindPwd/FindPwd";
import RegisterComplete from "./components/Regist/RegisterComplete";
import ResetPwd from "./components/FindPwd/ResetPwd";
>>>>>>> 00f977fda5edb38fd1342d8ed67b4b4897e55064
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
<<<<<<< HEAD
          <Route path="/" element={<Main status={code} />} />
          <Route path="/login" element={<Login isLogin={handleIsLogin} />} />
          <Route path="/signup" element={<Register />} />
=======
          <Route path="/" element={<ResetPwd />} />
          {/* <Route path="/" element={<Main status={code} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signup/complete" element={<RegisterComplete />} />
          <Route path="/findId" element={<FindId />} />
          <Route path="/findPwd" element={<FindPwd />} /> */}
>>>>>>> 00f977fda5edb38fd1342d8ed67b4b4897e55064
        </Routes>
      </Router>
    </div>
  );
}

export default App;
