import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { Container, Row, Col } from "react-bootstrap";
import "../common/css/Main.css";
function Main() {
    const slide = [{
        img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg' },
      
      {
        img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/singapore.jpg' },
      
      {
        img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/prague.jpg' },
      
      {
        img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/amsterdam.jpg' },
      
      {
        img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/moscow.jpg' }
    ];

    let changeTo = null;
    let AUTOCHANGE_TIME = 4000;
    console.log("랜더")
    const [activeSlide, setActiveSlide] = useState(-1);
    const [prevSlide , setPreSlide] = useState(-1);
    const [sliderReady, setSliderReady] = useState(false);
    console.log("밖 ", activeSlide);
    const activeSlideRef = useRef(activeSlide);
    activeSlideRef.current = activeSlide;
    const prevSlideRef = useRef(prevSlide);
    prevSlideRef.current = prevSlide;
    useEffect(()=>{
        console.log("??????????")
        runAutochangeTo();
        setTimeout(()=>{
            setActiveSlide(0);
            console.log("마운트", activeSlide);
            setSliderReady(true);
        }, 0);
        
        return(()=>{console.log("???")
            window.clearTimeout(changeTo)});
    },[])
    const runAutochangeTo = () =>{
        changeTo = setTimeout(()=>{
            changeSlides(1);
            runAutochangeTo();
        }, AUTOCHANGE_TIME);
    }
    const changeSlides = (change) =>{
        window.clearTimeout(changeTo);
        
        const { length } = slide;
        const pSlide = activeSlideRef.current;
        console.log(pSlide);
        let actSlide = pSlide + change;
        console.log(actSlide)
        if (actSlide < 0) {
            actSlide = length - 1;
        //    setActiveSlide(actSlide);
        }
        if (actSlide >= length) {
            actSlide = 0;
        }
        setActiveSlide(actSlide);
        setPreSlide(pSlide);
    }
    return (
        <Container fluid>
        <div>
            <h1></h1>
            <Row>
                <Col lg={5} >
                    <div className="fwelcome_text">
                        우리가 짠해? <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 아니 우린 짠해!
                    </div>
                    <div className="swelcome_text">
                        우리가 짠해? <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 아니 우린 짠해!
                    </div>
                </Col>
                <Col>
                    <div className={classNames("slider", { "s--ready": sliderReady })}>
                        <div className="slider__slides">
                            {slide.map((slide, index) => (
                                <div className={classNames("slider__slide", {
                                        "s--active": activeSlideRef.current === index,
                                        "s--prev": prevSlideRef.current === index})}>
                                        <div className="slider__slide-parts">
                                            {[...Array(1).fill()].map((x, i) => (
                                                    <div className="slider__slide-part">
                                                        <div className="slider__slide-part-inner" style={{ backgroundImage: `url(${slide.img})`, width : `100%`}}/>
                                                    </div>
                                            ))}
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        </Container>

    );
}

export default Main;