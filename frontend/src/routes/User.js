import React from "react";
import { Route, Routes } from "react-router-dom";
import FindId from "../components/FindId/FindId";
import FindPwd from "../components/FindPwd/FindPwd";
import ResetPwd from "../components/FindPwd/ResetPwd";
import Login from "../components/Login/Login";
import Register from "../components/Regist/Register";
import RegisterComplete from "../components/Regist/RegisterComplete";
import CalendarPage from "../components/Calendar/CalendarPage";

const User = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="" element={<Navigate to={}} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/signup/complete" element={<RegisterComplete />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/newpwd" element={<ResetPwd />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  );
};

export default User;
