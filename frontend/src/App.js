import "./App.css";
import Main from "./components/Main.jsx";
import Navigator from "./components/nav/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import NotFound from "./components/NotFound/NotFound";
import User from "./routes/User";
import Conferences from "./routes/Conferences";
import LocaleContext from "./contexts/LocaleContext";
function App() {
  // const [code, setCode] = useState("2");
  // 1 : 비로그인 상태 2 : 로그인 상태 3 : 파티룸 입장 상태
  const [loginStatus, setLoginStatus] = useState("1");

  const handleIsLogin = (data) => {
    setLoginStatus(data);
  };
  return (
    <LocaleContext.Provider value={loginStatus}>
      <div className="App">
        <Router>
          <Navigator onLoginChange={handleIsLogin} />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route
              path="user/*"
              element={<User onLoginChange={handleIsLogin} />}
            />
            <Route path="*" element={<NotFound />} />
            <Route path="conferences/*" element={<Conferences />} />
          </Routes>
        </Router>
      </div>
    </LocaleContext.Provider>
  );
}

export default App;
