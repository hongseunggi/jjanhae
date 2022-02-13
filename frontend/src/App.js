import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import NotFound from "./components/NotFound/NotFound";
import User from "./routes/User";
import Conferences from "./routes/Conferences";
import LoginStatusContext from "./contexts/LoginStatusContext";
import NameContext from "./contexts/NameContext";
import VideoMicContext from "./contexts/VideoMicContext";
import Main from "./Main";
import Home from "./components/Home.jsx";
import "./assets/fonts/font.css";
import Room from "./components/Room/Room";
import { useEffect } from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // 1 : 비로그인 상태 2 : 로그인 상태 3 : 파티룸 입장 상태
  const [loginStatus, setLoginStatus] = useState("1");
  const [myName, setMyName] = useState("");
  const [myVMstate, setMyVMstate] = useState({ video: true, audio: true });
  // 추후 refreshtoken을 사용하여 엑세스 토큰 업데이트하는 코드로 변경~~!@~!~!
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken && loginStatus === "1") {
    setLoginStatus("2");
  }
  return (
    <VideoMicContext.Provider value={{ myVMstate, setMyVMstate }}>
      <NameContext.Provider value={{ myName, setMyName }}>
        <LoginStatusContext.Provider value={{ loginStatus, setLoginStatus }}>
          <div className="App">
          
            <Router basename={process.env.PUBLIC_URL}>
              <Routes>
                <Route path="/" element={<Main />}>
                  <Route index element={<Home />} />
                  <Route path="user/*" element={<User />} />
                  <Route path="conferences/*" element={<Conferences />} />
                </Route>
                {/* <Route path="conference" element={<Room />} /> */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <ToastContainer autoClose={1500} style={{width : "450px", display : "inline"}} theme="colored"></ToastContainer>
          </div>
        </LoginStatusContext.Provider>
      </NameContext.Provider>
    </VideoMicContext.Provider>
  );
}

export default App;
