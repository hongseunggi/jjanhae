import React from "react";
import { Link } from "react-router-dom";
import styles from "./RegisterComplete.module.css";

const RegisterComplete = () => {
  console.log();
  return (
    <div className={styles.form}>
      <div className={styles.title}>Welcome</div>
      <Link to="/user/login">
        <button className={styles.nextBtn} type="submit">
          짠하러 갈까요?
          <span className={styles.icon}>🍻</span>
        </button>
      </Link>
    </div>
  );
};

export default RegisterComplete;
