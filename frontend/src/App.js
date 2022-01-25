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
import Conferences from "./routes/Conferences";
function App() {
  const [code, setCode] = useState("2");
  const handleIsLogin = (data) => {
    setCode(data);
  };
  return (
    <div className="App">
      {/* <Register /> */}
      <Router>
        <Navigator status={code} isLogin={handleIsLogin} />
        <Routes className="body">
          {/* <Route path="/" element={<ResetPwd />} /> */}
          <Route path="/" element={<Main status={code} />} />
          <Route path="user/*" element={<User />} />
          <Route path="*" element={<NotFound />} />
          <Route path="conferences/*" element={<Conferences/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
