import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import NotFound from "./components/NotFound/NotFound";
import User from "./routes/User";
import Conferences from "./routes/Conferences";
import LoginStatusContext from "./contexts/LoginStatusContext";
import Main from "./Main";
import Home from "./components/Home.jsx";
import "./assets/fonts/font.css";
import Room from "./components/Room/Room";
function App() {
  // const [code, setCode] = useState("2");
  // 1 : 비로그인 상태 2 : 로그인 상태 3 : 파티룸 입장 상태
  const [loginStatus, setLoginStatus] = useState("1");

  return (
    <LoginStatusContext.Provider value={{ loginStatus, setLoginStatus }}>
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route index element={<Home />} />
              <Route path="user/*" element={<User />} />
              <Route path="conferences/*" element={<Conferences />} />
            </Route>
            <Route path="conference" element={<Room />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </LoginStatusContext.Provider>
  );
}

export default App;
