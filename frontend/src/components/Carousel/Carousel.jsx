import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import "../../common/css/Main.css";

function Carousel() {
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

  // 방 생성 모달

  const activeSlideRef = useRef(activeSlide);
  activeSlideRef.current = activeSlide;
  const prevSlideRef = useRef(prevSlide);
  prevSlideRef.current = prevSlide;

  useEffect(() => {
    runAutochangeTo();
    setTimeout(() => {
      setActiveSlide(0);
      setSliderReady(true);
    }, 0);
    return () => {
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
    // console.log(pSlide);
    let actSlide = pSlide + change;
    // console.log(actSlide);
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

  return (
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
  );
}

export default Carousel;
