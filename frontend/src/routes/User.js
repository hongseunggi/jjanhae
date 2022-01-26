import React from "react";
import { Route, Routes } from "react-router-dom";
import FindId from "../components/FindId/FindId";
import FindPwd from "../components/FindPwd/FindPwd";
import ResetPwd from "../components/FindPwd/ResetPwd";
import Login from "../components/Login/Login";
import Profile from "../components/Profile/Profile";
import Register from "../components/Regist/Register";
import RegisterComplete from "../components/Regist/RegisterComplete";
import CalendarPage from "../components/Calendar/CalendarPage";

const User = ({ onLoginChange }) => {
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginChange={onLoginChange} />}
        />
        <Route path="/signup" element={<Register />} />
        <Route path="/signup/complete" element={<RegisterComplete />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/newpwd" element={<ResetPwd />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default User;
