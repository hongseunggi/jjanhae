import React, { useState } from "react";
import style from "./IntoRoom.module.css";
import UserModel from "../../models/user-model";
import VideoMicContext from "../../../contexts/VideoMicContext";
import { ReactComponent as Micx } from "../../../assets/icons/micx.svg";
import { ReactComponent as Mic } from "../../../assets/icons/mic.svg";
import { ReactComponent as Videox } from "../../../assets/icons/videox.svg";
import { ReactComponent as Video } from "../../../assets/icons/video.svg";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";


let localUser = new UserModel();
const VIDEO = { video: true, audio : false };
let localstream;
function IntoRoom({ onClose, room }) {
  const videoRef = useRef(null);
  const {myVMstate, setMyVMstate} = useContext(VideoMicContext);
  // const { open, close, header } = props;
  const [isMic, setMic] = useState(true);
  const [isVideo, setVideo] = useState(true);
  const navigate = useNavigate();

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(VIDEO);

    if (videoRef && videoRef.current) {
      console.log("들어옴", stream);
      videoRef.current.srcObject = stream;
      localstream = stream;
    }
  };


  console.log(room, "난 모달");
  useEffect(()=>{
    startVideo();
  },[]);
  


  const handleClose = (e) => {
    e.stopPropagation();
  };
  const handleMic = () => {
    console.log("마이크 : ", isMic, "비디오 : ", isVideo);
    setMic(!isMic);
  };
  const handleVideo = () => {
    console.log("마이크 : ", isMic, "비디오 : ", isVideo);
    if(isVideo){
      videoRef.current.pause();
      videoRef.current.src = "";
      localstream.getTracks()[0].stop();
    }
    else{
      startVideo();
    }
    setVideo(!isVideo);
  };
  const handleSubmit = () => {
    // axios ???????????
    setMyVMstate({video : isVideo, audio : isMic})
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
            <video
                autoPlay={true}
                className={style.videoPreview}
                // id={'video-'+ user.getStreamManager().stream.streamId}
                ref={videoRef}
                muted={isMic}
                style={
                    {
                        width : "100%",
                        height : "100%"
                    }
                }
            />
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
