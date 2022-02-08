import React, { useState } from "react";
import style from "./IntoRoom.module.css";
import { ReactComponent as Micx } from "../../assets/icons/micx.svg";
import { ReactComponent as Mic } from "../../assets/icons/mic.svg";
import { ReactComponent as Videox } from "../../assets/icons/videox.svg";
import { ReactComponent as Video } from "../../assets/icons/video.svg";
import { useNavigate } from "react-router-dom";

function IntoRoom({ onClose, room }) {
  // const { open, close, header } = props;
  const [isMic, setMic] = useState(false);
  const [isVideo, setVideo] = useState(false);
  const navigate = useNavigate();

  
  console.log(room, "난 모달");

  const handleClose = (e) => {
    e.stopPropagation();
  };
  const handleMic = () => {
    console.log("마이크 : ", isMic, "비디오 : ", isVideo);
    setMic(!isMic);
  };
  const handleVideo = () => {
    console.log("마이크 : ", isMic, "비디오 : ", isVideo);
    setVideo(!isVideo);
  };
  const handleSubmit = () => {
    // axios ???????????
    navigate(`/conferences/detail/${room.roomSeq}`);
    onClose();
  };

  return (
    <div className={`${style.openModal} ${style.modal}`} onClick={onClose}>
      <div className={style.modalForm} onClick={handleClose}>
        <button className={style.close} onClick={onClose}>
          X
        </button>
        <h1>{room.title}</h1>
        <div className={style.videoPreview}>
          {/*비디오 들어가는 자리 추후에 추가 하면 될듯 합니다  */}
        </div>
        <div style={{ display: "inline-block" }} onClick={handleMic}>
          {isMic ? (
            <button className={style.vbtn}>
              {" "}
              <Mic
                className={style.buttonicon}
                width="20"
                height="20"
              ></Mic>{" "}
              음소거{" "}
            </button>
          ) : (
            <button className={style.vbtn}>
              {" "}
              <Micx
                className={style.buttonicon}
                width="20"
                height="20"
                filter="invert(34%) sepia(54%) saturate(4911%) hue-rotate(327deg) brightness(100%) contrast(103%)"
              ></Micx>{" "}
              음소거 해제{" "}
            </button>
          )}
        </div>
        <div style={{ display: "inline-block" }} onClick={handleVideo}>
          {isVideo ? (
            <button className={style.vbtn}>
              {" "}
              <Video
                className={style.buttonicon}
                width="20"
                height="20"
              ></Video>{" "}
              비디오 중지{" "}
            </button>
          ) : (
            <button className={style.vbtn}>
              {" "}
              <Videox
                className={style.buttonicon}
                width="20"
                height="20"
                filter="invert(34%) sepia(54%) saturate(4911%) hue-rotate(327deg) brightness(100%) contrast(103%)"
              ></Videox>{" "}
              비디오 시작{" "}
            </button>
          )}
        </div>
        {/* <a href="/conferences/detail" target="_blank"> */}
        <button className={style.closeBtn} onClick={handleSubmit}>
          입장
        </button>
        {/* </a> */}
      </div>
    </div>
  );
}

export default IntoRoom;
