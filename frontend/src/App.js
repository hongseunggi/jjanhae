import "./App.css";
import Main from "./components/Main.jsx";
import Navigator from "./components/nav/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
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
      <Router>
        <Navigator status={code} isLogin={handleIsLogin} />
        <Routes>
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
