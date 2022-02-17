import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Navigator.module.css";
import Logo from "../../assets/logo.png";
import LoginStatusContext from "../../contexts/LoginStatusContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navigator() {
  const { loginStatus, setLoginStatus } = useContext(LoginStatusContext);

  const handleLogOut = () => {
    setLoginStatus("1");
    localStorage.removeItem("name");
    sessionStorage.removeItem("accessToken");
    toast.success(
      <div style={{ width: "400px" }}>
        <div>성공적으로 로그아웃되었습니다.</div>
        <span>짠해와 즐거운 시간이 되셨나요?</span>
      </div>,
      {
        position: toast.POSITION.TOP_CENTER,
        role: "alert",
      }
    );
    // axios.defaults.headers.Authorization = undefined;
  };

  switch (loginStatus) {
    case "1":
      return (
        <Container fluid>
          <Row className="nav">
            <Col>
              <Link to="/" className={styles.logo}>
                <img src={Logo} className={styles.logo} alt="logo"></img>
              </Link>
            </Col>
            <Col>
              <Link to="user/login" className={styles.link}>
                LOGIN
              </Link>
            </Col>
            {/* <Col>
              <Link to="user/profile" className={styles.link}>
                PROFILE
              </Link>
            </Col> */}
          </Row>
        </Container>
      );
    case "2":
      return (
        <Container fluid>
          <Row className="nav">
            <Col>
              <Link to="/" className={styles.logo}>
                <img src={Logo} className={styles.logo} alt="logo"></img>
              </Link>
            </Col>
            <Col>
              <Link to="/" onClick={handleLogOut} className={styles.link}>
                LOGOUT
              </Link>
              <Link to="/user/profile" className={styles.link_profile}>
                PROFILE
              </Link>
            </Col>
          </Row>
        </Container>
      );

    default:
      return; //console.log("error");
  }
}

export default Navigator;
