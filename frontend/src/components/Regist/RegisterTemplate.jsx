import React, { useState } from "react";
import styles from "./RegisterTemplate.module.css";
import CheckId from "./CheckId";
import { Route, Routes } from "react-router-dom";
import CheckPwd from "./CheckPwd";
import RegistContext from "../../contexts/RegistContext";
import CheckEmail from "./CheckEmail";
import CheckProfile from "./CheckProfile";
import RegisterComplete from "./RegisterComplete";
import CheckTOS from "./CheckTOS";

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
          <Routes>
            <Route path="/" element={<CheckTOS progress={20} />} />
            <Route path="/checkId" element={<CheckId progress={40} />} />
            <Route path="/checkPwd" element={<CheckPwd progress={60} />} />
            <Route path="/checkEmail" element={<CheckEmail progress={80} />} />
            <Route
              path="/checkProfile"
              element={<CheckProfile progress={100} />}
            />
            <Route path="/complete" element={<RegisterComplete />} />
          </Routes>
        </div>
      </div>
    </RegistContext.Provider>
  );
};

export default RegisterTemplate;
