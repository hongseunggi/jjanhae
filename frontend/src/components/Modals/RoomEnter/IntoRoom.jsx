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
import RoomApi from "../../../api/RoomApi";

const VIDEO = { video: true, audio : false };
let localstream;
function IntoRoom({ onClose, room }) {
  const videoRef = useRef(null);
  const {myVMstate, setMyVMstate} = useContext(VideoMicContext);
  const [errorPwd, setErrorPwd] = useState("");
  const [type, setType] = useState(room.type);
  // const { open, close, header } = props;
  const [isMic, setMic] = useState(true);
  const [isVideo, setVideo] = useState(true);
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  
  const {getRoomEnterResult, getRoomEnterPrivateCheckResult} = RoomApi;


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
    if(type === 1) startVideo();
    return () => {
      localstream.getTracks()[0].stop();
    };
  },[]);
  


  const handleClose = (e) => {
    e.stopPropagation();
  };

  const handleCheckPwd = async () => {
    const params = {
      roomSeq : room.roomSeq,
      password : pwd
    }
    const {data} = await getRoomEnterPrivateCheckResult(params);
    if(data.statusCode === 200){
      startVideo();
      setType(1);
    }
    else if(data.statusCode === 204){
      setErrorPwd("올바르지 않은 비밀번호 입니다.");
    }
    else{
      alert("로그인 필요");
    }
    // if(pwd === room.password){
    //   startVideo();
    //   setType(1);
    // }
    // else{
    //   setErrorPwd("올바르지 않은 비밀번호 입니다.");
    // }
  }
  const handleInputPwd = (e) => {
    e.preventDefault();
    setPwd(e.target.value);
  }
  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      handleCheckPwd();
    }
  };
  const handleMic = () => {
    setMic((prev) => !prev);
  };
  const handleVideo = () => {
    if (isVideo) {
      videoRef.current.pause();
      videoRef.current.src = "";
      localstream.getTracks()[0].stop();
    } else {
      startVideo();
    }
    setVideo((prev) => !prev);
  };
  useEffect(() => {
    console.log("마이크 : ", isMic, "비디오 : ", isVideo);
  }, [isMic, isVideo]);

  const handleSubmit = async () => {
    // axios ???????????
    const body = {
      roomSeq : room.roomSeq
    }
    const {data} = await getRoomEnterResult(body);
    if(data.statusCode === 204){
      alert("이미 다른 방에 입장 중 이거나 종료된 방입니다.")
      onClose();
    }
    else{
      setMyVMstate({ video: isVideo, audio: isMic });
      navigate(`/conferences/detail/${room.title}/${room.roomSeq}/`);
      onClose();
    }
    
  };

  return (
    <div className={`${style.openModal} ${style.modal}`} onClick={onClose}>
      {type === 0 ? (
        <div className={style.pwdmodalForm} onClick={handleClose}>
        <button className={style.close} onClick={onClose}>
          X
        </button>
        <h2>비밀번호</h2>
        <div className={style.pwdbox}>
        <input
          className={style.inputData}
          id="name"
          type="password"
          autoComplete="off"
          onChange={handleInputPwd}
          onKeyPress={onCheckEnter}
        />
        <span className={style.errorMsg}>{errorPwd}</span>
        <button className={style.check} onClick={handleCheckPwd} >
          확인
        </button>
        </div>
      </div>

      ) : null}
      {type === 1 ? (
        <div className={style.modalForm} onClick={handleClose}>
        <button className={style.close} onClick={onClose}>
          X
        </button>
        <h1>{room.title}</h1>
        <div className={style.videoPreview}>
            <video
                autoPlay={true}
                className={style.videoPreview}
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
        </div>
      ): null}
        {/* </a> */}
    </div>
  );
}

export default IntoRoom;
