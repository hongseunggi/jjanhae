import "./App.css";
import Main from "./components/Main.jsx";
import Login from "./components/Login/Login.jsx";
import Navigator from "./components/nav/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Register from "./components/Regist/Register";
import FindId from "./components/FindId/FindId";
import FindPwd from "./components/FindPwd/FindPwd";
import RegisterComplete from "./components/Regist/RegisterComplete";
import ResetPwd from "./components/FindPwd/ResetPwd";
import NotFound from "./components/NotFound/NotFound";
import User from "./routes/User";
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
          {/* <Route path="/" element={<ResetPwd />} /> */}
          <Route path="/" element={<Main status={code} />} />
          <Route path="user/*" element={<User />} />
          {/* <Route path="user/login" element={<Login />} />
          <Route path="user/signup" element={<Register />} />
          <Route path="user/signup/complete" element={<RegisterComplete />} />
          <Route path="user/findId" element={<FindId />} />
          <Route path="user/findPwd" element={<FindPwd />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
