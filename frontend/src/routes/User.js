import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CalendarPage from "../components/Calendar/CalendarPage";
import FindId from "../components/FindId/FindId";
import FindPwd from "../components/FindPwd/FindPwd";
import ResetPwd from "../components/FindPwd/ResetPwd";
import Login from "../components/Login/Login";
import Profile from "../components/Profile/Profile";
import Register from "../components/Regist/Register";
import RegisterComplete from "../components/Regist/RegisterComplete";
import RegisterTemplate from "../components/Regist/RegisterTemplate";

const User = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Register />} /> */}
        <Route path="/signup/*" element={<RegisterTemplate />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/newpwd" element={<ResetPwd />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default User;
