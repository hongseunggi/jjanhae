import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Navigator.module.css";
import Logo from "../../assets/logo.png";

function Navigator(props) {
  const { status, isLogin } = props;

  const handleLogOut = () => {
    isLogin("1");
  };

  switch (status) {
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
              <Link to="/profile" className={styles.link_profile}>
                PROFILE
              </Link>
            </Col>
          </Row>
        </Container>
      );
    case "3":
      return (
        <Container fluid>
          <Row className="nav">
            <Col>
              <Link to="/" className={styles.logo}>
                <img src={Logo} className={styles.logo} alt="logo"></img>
              </Link>
            </Col>
            <Col>
              <Link to="/conferences" className={styles.link}>
                EXIT
              </Link>
            </Col>
          </Row>
        </Container>
      );
    default:
      return console.log("error");
  }
}

export default Navigator;
