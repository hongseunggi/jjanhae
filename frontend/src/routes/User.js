import React from "react";
import { Route, Routes } from "react-router-dom";
import FindId from "../components/FindId/FindId";
import FindPwd from "../components/FindPwd/FindPwd";
import ResetPwd from "../components/FindPwd/ResetPwd";
import Login from "../components/Login/Login";
import Register from "../components/Regist/Register";
import RegisterComplete from "../components/Regist/RegisterComplete";

const User = ({ onLoginChange }) => {
  return (
    <div>
      <Routes>
        {/* <Route path="" element={<Navigate to={}} /> */}
        <Route
          path="/login"
          element={<Login onLoginChange={onLoginChange} />}
        />
        <Route path="/signup" element={<Register />} />
        <Route path="/signup/complete" element={<RegisterComplete />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/newpwd" element={<ResetPwd />} />
      </Routes>
    </div>
  );
};

export default User;
