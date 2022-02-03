import { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../common/css/Main.css";
import RoomConfig from "./Modals/RoomConfig";
import Keyword from "./Game/Keyword";
import GameList from "./Game/GameList";
import Setting from "./Game/Setting";
import { Link } from "react-router-dom";
import LoginStatusContext from "../contexts/LoginStatusContext";
import Carousel from "./Carousel/Carousel";
import RegistMusic from "./Modals/RegistMusic";

function Home() {
  const { loginStatus } = useContext(LoginStatusContext);
  console.log(loginStatus);

  // 방 생성 모달
  const [modalOpen, setModalOpen] = useState(false);

  const openRoomConfigModal = () => {
    setModalOpen(true);
  };
  const closeRoomConfigModal = () => {
    setModalOpen(false);
  };
  const buttonRender = () => {
    switch (loginStatus) {
      case "1":
        return (
          <Col>
            <Link to="user/login">
              <button className="create_room">방 만들기</button>
            </Link>
            <Link to="user/login">
              <button className="into_room">방 입장하기</button>
            </Link>
          </Col>
        );
      default:
        return (
          <Col>
            <button className="create_room" onClick={openRoomConfigModal}>
              방 만들기
            </button>
            <Link to="conferences/list">
              <button className="into_room">방 입장하기</button>
            </Link>
          </Col>
        );
    }
  };
  return (
    <>
      {/* <RoomConfig open={modalOpen} /> */}
      <Container fluid="true" className="contain">
        <Row fluid="true" id="row" className="rowClass h-100" style={{
          marginLeft : "0",
          marginRight : "0"
        }}>
          <Col lg={1} className="dummy"></Col>
          <Col lg={4} className="h-25">
            <div className="intro_text">WELCOME OUR MEET</div>

            <div className="welcome_text">우리가 짠해?</div>
            <div className="swelcome_text">아니 우린 짠해!</div>
            <Row className="buttonbox">{buttonRender()}</Row>
          </Col>
          <Col className="carousel">
            <Carousel />
          </Col>
        </Row>
      </Container>
      {/* <RoomConfig open={modalOpen} onClose={closeRoomConfigModal} /> */}
      {/* <Keyword open={modalOpen} close={closeRoomConfigModal} /> */}
      {/* <GameList open={modalOpen} close={closeRoomConfigModal} /> */}
      <Setting open={modalOpen} close={closeRoomConfigModal} />
      {/* <RegistMusic open={modalOpen} onClose={closeRoomConfigModal} /> */}
    </>
  );
}

export default Home;
