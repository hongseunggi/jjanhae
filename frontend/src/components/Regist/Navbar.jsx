import React from "react";
import styles from "./Navbar.module.css";
import logo from "../../assets/icons/logo.png";
const Navbar = () => {
  return (
    <div className={styles.nav}>
      <img src={logo} alt="logo" className={styles.logo} />
    </div>
  );
};

export default Navbar;
