import React, { useState } from "react";
import styles from "./RegisterTemplate.module.css";
import CheckId from "./CheckId";
import { Route, Routes } from "react-router-dom";
import CheckPwd from "./CheckPwd";
import RegistContext from "../../contexts/RegistContext";
import CheckEmail from "./CheckEmail";
import CheckProfile from "./CheckProfile";
import RegisterComplete from "./RegisterComplete";

const RegisterTemplate = () => {
  const [input, setInput] = useState({
    userId: "",
    password: "",
    email: "",
    name: "",
    birthday: "",
    drink: "",
    drinkLimit: "",
  });

  return (
    <RegistContext.Provider value={{ input, setInput }}>
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {/* <header className={styles.header}>
            <h1>짠해</h1>
          </header> */}
          <Routes>
            <Route path="/" element={<CheckId progress={25} />} />
            <Route path="/checkPwd" element={<CheckPwd progress={50} />} />
            <Route path="/checkEmail" element={<CheckEmail progress={75} />} />
            <Route
              path="/checkProfile"
              element={<CheckProfile progress={100} />}
            />
            <Route path="/complete" element={<RegisterComplete />} />
            {/* <Route path="/findpwd" element={<FindPwd />} />
          <Route path="/newpwd" element={<ResetPwd />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<CalendarPage />} />
        <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </div>
      </div>
    </RegistContext.Provider>
  );
};

export default RegisterTemplate;
