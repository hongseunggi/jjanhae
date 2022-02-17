import React from "react";
import { Link } from "react-router-dom";
import ErrorIcon from "../../assets/icons/error.png";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.contents}>
      <img src={ErrorIcon} alt="warning" />
      <h1>Error 404 - Page Not Found</h1>
      <span>The page you requested could not be found.</span>
      <Link to="/">
        <button className={styles.HomeBtn}>Go Home</button>
      </Link>
    </div>
  );
};

export default NotFound;
