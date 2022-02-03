import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CalendarPage from "../components/Calendar/CalendarPage";
import Login from "../components/Login/Login";
import Profile from "../components/Profile/Profile";
import FindAccount from "../components/Regist/FindAccount";
import FindPassword from "../components/Regist/FindPassword";
import ResetPassword from "../components/Regist/ResetPassword";
import RegisterTemplate from "../components/Regist/RegisterTemplate";

const User = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/*" element={<RegisterTemplate />} />
        <Route path="/findid" element={<FindAccount />} />
        <Route path="/findpwd" element={<FindPassword />} />
        <Route path="/newpwd" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default User;
