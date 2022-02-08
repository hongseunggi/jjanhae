import React, { useState } from "react";
import { ReactComponent as LockIcon } from "../../assets/icons/password.svg";
import ImgApi from "../../api/ImgApi";
import RoomApi from "../../api/RoomApi";
import imageUpload from "../../assets/icons/imageUpload.png";
import styles from "./RoomConfig.module.css";
import { useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios1 from "../../api/WebRtcApi";
// import RoomContext from "../../../contexts/RoomContext";
import { useContext } from "react";
const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";


const RoomConfig = ({ open, onClose }) => {
  // const { open, close, header } = props;
  const navigate = useNavigate();
  // const {sessionState, setSessionState} = useContext(RoomContext);
  const [configStatus, setConfigStatus] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [roomConfig, setRoomConfig] = useState("public");
  const [drinkConfig, setDrinkConfig] = useState("first");
  const [thumbnailImg, setThumbnailImg] = useState("https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg");
  const [description, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");

  const {getImgUploadResult} = ImgApi;
  const {getCreateRoomResult} = RoomApi;

  const titleHandler = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  }
  
  const descHandler = (e) => {
    e.preventDefault();
    setDesc(e.target.value);
  }

  const pwdHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  }

  const imgInputhandler = async (e) =>{
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    const { data } = await getImgUploadResult(formData);
    if(data.statusCode === 200){
      console.log(data);
      setThumbnailImg(data.url);
    }
    else console.log("Upload fail");
  };

  const handleRoomConfig = (e) => {
    setRoomConfig(e.target.value);
  };

  const handleDrinkConfig = (e) => {
    setDrinkConfig(e.target.value);
  };
  
  const handleStopEvent = (e) =>{
    e.stopPropagation();
  };

  const joinSession = (sessionId) => {
    const OV = new OpenVidu();

    const mySession = OV.initSession();
    let subScribers;
    let currentVideoDvice;
    let mainStreamManager;
    let publishers;
    mySession.on("streamCreated", (e)=>{
      var subscriber = mySession.subscribe(e.stream, undefined);
      var subscribers = this.state.subscribers;
      subscribers.push(subscriber);
      subScribers = subscribers;
    });

    getToken(sessionId).then((token)=>{
      mySession.connect(token, {clientData : "홍승기"})
      .then(async () => {
        const devices = await OV.getDevices();
        const videoDvices = devices.filter((device) => device.kind === "videoinput");

        let publisher = OV.initPublisher(undefined, {
          audioSource: undefined, // The source of audio. If undefined default microphone
          videoSource: undefined, // The source of video. If undefined default webcam
          publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
          publishVideo: true, // Whether you want to start publishing with your video enabled or not
          resolution: "640x480", // The resolution of your video
          frameRate: 30, // The frame rate of your video
          insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
          mirror: false,
        });
        mySession.publish(publisher);
        currentVideoDvice = videoDvices[0];
        mainStreamManager = publisher;
        publishers = publisher;
      }).catch((error) => {
        console.log("씨발");
      })
    })
    return mySession;
  }



  const createRoomSubmit = async () => {
    let type = 1;
    let drinkLimit = 1;

    if(roomConfig === "private"){
      type = 2;
    }
    if(drinkConfig === "second"){
      drinkLimit = 2;
    }
    else if(drinkConfig === "third"){
      drinkLimit = 3;
    }

    const body = {
      name : title,
      thumbnail : thumbnailImg,
      type : type,
      password : password,
      description : description,
      drinkLimit : drinkLimit,
      ismute : "y",
      isOn : "y"
    }
    const {data} = await getCreateRoomResult(body);
    //// -> 리턴 되는 data 가지고 뭘 한다면 이 밑에 작성
    console.log(data);
    let str = joinSession((data.roomSeq).toString());
    console.log(str);
    // setSessionState(str);
    navigate(`/conferences/detail`);
    //// -> 이 밑 부분에 화상회의 방 ? 으로 라우트 시켜주는게 들어가야 할 듯 합니다. 일단 닫기로 했습니다.
    onClose();
  }


  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      onClick={onClose}
    >
      {open ? (
        <section className={styles.modalForm} onClick={handleStopEvent}>
          <header>
            <h1 className={styles.title}>파티룸 생성하기</h1>
            <div>
              {roomConfig === "public" ? (
                <LockIcon
                  width="24"
                  height="24"
                  fill="rgba(255, 87, 34, 0.3)"
                />
              ) : (
                <LockIcon width="24" height="24" fill="rgba(255, 87, 34, 1)" />
              )}
            </div>
          </header>
          <main>
            <div className={styles.configForm}>
              <div className={styles.imagePreview}>
                
                <img
                  className={styles.thumbnail}
                  src={thumbnailImg}
                  alt="thumbnail"
                />
                <label htmlFor="input-img">
                <img
                    src={imageUpload}
                    alt="upload thumbnail"
                    className={styles.uploadImage}
                    style={{cursor: "pointer"}}
                  />
                </label>
                <input
                  type="file"
                  id="input-img"
                  accept="image/png, image/jpeg"
                  className={styles.uploadBtn}
                  onChange={imgInputhandler}
                  accept="image/gif, image/jpeg, image/png"
                />
              </div>
              <form className={styles.configData}>
                <label htmlFor="title">방 이름</label>
                <input
                  id="title"
                  className={styles.nameInput}
                  value={title}
                  placeholder="방 이름을 입력하세요."
                  onChange={titleHandler}
                />
                <label htmlFor="config">방 설정</label>
                <div className={styles.radioWrap}>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="public"
                      checked={roomConfig === "public"}
                      onChange={handleRoomConfig}
                    />
                    <span>공개방</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="private"
                      checked={roomConfig === "private"}
                      onChange={handleRoomConfig}
                    />
                    <span>비공개방</span>
                  </div>
                  {roomConfig === "private" && (
                    <div className={styles.roomPwd}>
                      <input
                        type="password"
                        placeholder="비밀번호"
                        maxLength="10"
                        value={password}
                        onChange={pwdHandler}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.radioWrap}>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="first"
                      checked={drinkConfig === "first"}
                      onChange={handleDrinkConfig}
                    />
                    <span>0 ~ 1병</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="second"
                      checked={drinkConfig === "second"}
                      onChange={handleDrinkConfig}
                    />
                    <span>2 ~ 3병</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="third"
                      checked={drinkConfig === "third"}
                      onChange={handleDrinkConfig}
                    />
                    <span>4병 ~</span>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <form className={styles.descriptionForm}>
                <label htmlFor="description">방 설명</label>
                <textarea
                  id="description"
                  className={styles.description}
                  placeholder="방에 대한 정보를 입력하세요."
                  value = {description}
                  onChange={descHandler}
                ></textarea>
              </form>
            </div>
          </main>
          <footer>
            <button className={styles.createBtn} onClick={createRoomSubmit}> 방 생성 </button>
            <button className={styles.closeBtn} onClick={onClose}>
              {" "}
              취소{" "}
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

const getToken = (data) => {
  return createSession(data).then((sessionId) =>
    createToken(sessionId)
  );
}

const createSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify({ customSessionId: sessionId });
    axios1
      .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
        headers: {
          Authorization:
            "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("CREATE SESION", response);
        resolve(response.data.id);
      })
      .catch((response) => {
        var error = Object.assign({}, response);
        if (error?.response?.status === 409) {
          resolve(sessionId);
        } else {
          console.log(error);
          console.warn(
            "No connection to OpenVidu Server. This may be a certificate error at " +
              OPENVIDU_SERVER_URL
          );
          if (
            window.confirm(
              'No connection to OpenVidu Server. This may be a certificate error at "' +
                OPENVIDU_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. ' +
                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                OPENVIDU_SERVER_URL +
                '"'
            )
          ) {
            window.location.assign(
              OPENVIDU_SERVER_URL + "/accept-certificate"
            );
          }
        }
      });
  });
}

const createToken = (sessionId) => {
  return new Promise((resolve, reject) => {
    var data = {};
    axios1
      .post(
        OPENVIDU_SERVER_URL +
          "/openvidu/api/sessions/" +
          sessionId +
          "/connection",
        data,
        {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("TOKEN", response);
        resolve(response.data.token);
      })
      .catch((error) => reject(error));
  });
}


export default RoomConfig;
