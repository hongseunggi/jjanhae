import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";
import "../common/css/Main.css";
import { Link } from "react-router-dom";

function Main(props) {
  const { status } = props;
  console.log(status);
  const slide = [
    {
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg",
    },
    {
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/singapore.jpg",
    },

    {
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/prague.jpg",
    },

    {
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/amsterdam.jpg",
    },

    {
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/moscow.jpg",
    },
  ];

  let changeTo = null;
  let AUTOCHANGE_TIME = 4000;

  const [activeSlide, setActiveSlide] = useState(-1);
  const [prevSlide, setPreSlide] = useState(-1);
  const [sliderReady, setSliderReady] = useState(false);

  const activeSlideRef = useRef(activeSlide);
  activeSlideRef.current = activeSlide;
  const prevSlideRef = useRef(prevSlide);
  prevSlideRef.current = prevSlide;

  useEffect(() => {
    console.log("??????????");
    runAutochangeTo();
    setTimeout(() => {
      setActiveSlide(0);
      console.log("마운트", activeSlide);
      setSliderReady(true);
    }, 0);
    return () => {
      console.log("???");
      window.clearTimeout(changeTo);
    };
  }, []);

  const runAutochangeTo = () => {
    changeTo = setTimeout(() => {
      changeSlides(1);
      runAutochangeTo();
    }, AUTOCHANGE_TIME);
  };

  const changeSlides = (change) => {
    window.clearTimeout(changeTo);

    const { length } = slide;
    const pSlide = activeSlideRef.current;
    console.log(pSlide);
    let actSlide = pSlide + change;
    console.log(actSlide);
    if (actSlide < 0) {
      actSlide = length - 1;
      //    setActiveSlide(actSlide);
    }
    if (actSlide >= length) {
      actSlide = 0;
    }
    setActiveSlide(actSlide);
    setPreSlide(pSlide);
  };
  const buttonRender = () => {
    switch (status) {
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
          <button className="create_room">방 만들기</button>
          <Link to="conferences/list"><button className="into_room">방 입장하기</button></Link>
          </Col>
        
        );
    }
  };
  return (
    <Container fluid="true" className="body">
      <Row fluid="true" className="h-100">
        <Col lg={1} className="dummy"></Col>
        <Col lg={4} className="h-25">
          <div className="intro_text">WELCOME OUR MEET</div>

          <div className="welcome_text">우리가 짠해?</div>
          <div className="swelcome_text">아니 우린 짠해!</div>
          <Row className="buttonbox">
            {buttonRender()}
          </Row>
        </Col>
        <Col>
          <div className={classNames("slider", { "s--ready": sliderReady })}>
            <div className="slider__slides">
              {slide.map((slide, index) => (
                <div
                  key={index}
                  className={classNames("slider__slide", {
                    "s--active": activeSlideRef.current === index,
                    "s--prev": prevSlideRef.current === index,
                  })}
                >
                  <div className="slider__slide-parts">
                    {[...Array(1).fill()].map((x, i) => (
                      <div key={i} className="slider__slide-part">
                        <div
                          className="slider__slide-part-inner"
                          style={{
                            backgroundImage: `url(${slide.img})`,
                            width: `100%`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Main;
