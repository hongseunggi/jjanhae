import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { OpenVidu } from "openvidu-browser";
import axios1 from "../../api/WebRtcApi";
import RoomApi from "../../api/RoomApi";
import ImgApi from "../../api/ImgApi.js";
import StreamComponent from "./stream/StreamComponent";
import YangGameComponent from "././game/YangGameComponent";
import SelectingGame from "././game/SelectingGame";

import styles from "./RoomContentsGrid.module.css";
import Chat from "./chat/Chat";
import UserModel from "../models/user-model";
import LoginStatusContext from "../../contexts/LoginStatusContext";
import NameContext from "../../contexts/NameContext";

import SnapShotResult from "./snapshot/SnapShotResult";
import html2canvas from "html2canvas";

import MusicPlayer from "./music/MusicPlayer";
import SessionIdContext from "../../contexts/SessionIdContext";
import Keyword from "../Modals/Game/Keyword";
import Karaoke from "./karaoke/Karaoke";

import { Container, Row, Col } from "react-bootstrap";

const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";

let localUserInit = new UserModel();
let OV = undefined;

const RoomContentsGrid = ({
  sessionName,
  userName,
  media,
  mode,
  musicList,
  music,
  bangzzang,
}) => {
  const { setRoomSnapshotResult } = RoomApi;
  const { getImgUploadResult } = ImgApi;
  const { setSessionId } = useContext(SessionIdContext);
  const { loginStatus, setLoginStatus } = useContext(LoginStatusContext);
  const { myName } = useContext(NameContext);
  //console.log(loginStatus, myName);
  console.log("room content render", loginStatus);
  const [mySessionId, setMySessionId] = useState(sessionName);
  const [myUserName, setMyUserName] = useState(userName);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(undefined);
  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;
  const [targetSubscriber, setTargetSubscriber] = useState({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [allSet, setAllSet] = useState(false);
  const [startPage, setStartPage] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [subscriberkeyword, setSubscriberKeyword] = useState("");
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState([]);
  const [myNickname, setMyNickname] = useState("");
  const [gameStatus, setGameStatus] = useState("0");
  const [streamId, setStreamId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [targetGameName, setTargetGameName] = useState("");
  const [index, setIndex] = useState("1");
  const [keywordInputModal, setKeywordInputModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [modalMode, setModalMode] = useState("start");
  const [participants, setParticipants] = useState([]);
  const [targetNickName, setTargetNickName] = useState("");

  // ?????????
  const [participantNum, setParticpantNum] = useState(1);
  const participantNumRef = useRef(participantNum);
  participantNumRef.current = participantNum;

  console.log(sessionName);

  const sessionRef = useRef(session);
  sessionRef.current = session;
  setSessionId(sessionRef.current);

  const publisherRef = useRef(publisher);
  publisherRef.current = publisher;

  const localUserRef = useRef(localUser);
  localUserRef.current = localUser;

  console.log(localUserRef.current);

  // ????????????
  const [count, setCount] = useState(5);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(0); // 0 : ready 1 : start 2 : complete
  // const [ready, setReady] = useState(true);

  const countRef = useRef(count);
  countRef.current = count;

  const imagesRef = useRef(images);
  imagesRef.current = images;

  const targetSubscriberRef = useRef(targetSubscriber);
  targetSubscriberRef.current = targetSubscriber;

  const joinSession = () => {
    OV = new OpenVidu();
    setSession(OV.initSession());
  };

  useEffect(() => {
    console.log(participantNum);
    console.log(participantNumRef.current);
  }, [participantNum]);

  useEffect(() => {
    setLoginStatus("3");
    console.log(loginStatus);
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      leaveSession();
    };
  }, []);

  useEffect(() => {
    if (sessionRef.current) {
      console.log(sessionRef.current);
      // ???????????? ???????????? ??? ??????
      sessionRef.current.on("streamCreated", (event) => {
        setParticpantNum(participantNumRef.current + 1);
        let subscriber = sessionRef.current.subscribe(event.stream, undefined);
        //console.log(event);
        const newUser = new UserModel();
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setAudioActive(event.stream.audioActive);
        newUser.setVideoActive(event.stream.videoActive);
        newUser.setType("remote");

        const nickname = event.stream.connection.data.split("%")[0];
        //console.log(nickname);
        newUser.setNickname(JSON.parse(nickname).clientData);

        console.log(newUser);
        console.log(subscribersRef.current);
        console.log(subscribers);
        setSubscribers([...subscribersRef.current, newUser]);
      });

      // ???????????? ????????? ???????????? ??? ?????? (????????? / ????????? ???)
      sessionRef.current.on("signal:userChanged", (event) => {
        console.log(sessionRef.current);
        subscribersRef.current.forEach((user) => {
          if (user.getConnectionId() === event.from.connectionId) {
            const data = JSON.parse(event.data);
            if (data.isAudioActive !== undefined) {
              user.setAudioActive(data.isAudioActive);
            }
            if (data.isVideoActive !== undefined) {
              user.setVideoActive(data.isVideoActive);
            }
          }
        });
        setSubscribers([...subscribersRef.current]);
      });

      sessionRef.current.on("streamDestroyed", (event) => {
        setParticpantNum(participantNumRef.current - 1);
        deleteSubscriber(event.stream);
      });

      sessionRef.current.on("exception", (exception) => {
        console.warn(exception);
      });

      sessionRef.current.on("signal:photo", (event) => {
        const data = event.data;
        console.log(data);
        if (data.photoStatus === 1) {
          console.log("?????? ?????????~");
          onCapture();
        }
      });

      getToken().then((token) => {
        sessionRef.current
          .connect(token, { clientData: myUserName })
          .then(async () => {
            let publisherTemp = OV.initPublisher(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: media.audio,
              publishVideo: media.video,
              resolution: "640x480",
              frameRate: 30,
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false,
            });

            // --- 6) Publish your stream ---

            sessionRef.current.publish(publisherTemp);

            localUserInit.setAudioActive(media.audio);
            localUserInit.setVideoActive(media.video);
            localUserInit.setNickname(myUserName);
            localUserInit.setConnectionId(
              sessionRef.current.connection.connectionId
            );
            localUserInit.setStreamManager(publisherTemp);

            // Set the main video in the page to display our webcam and store our Publisher
            setPublisher(publisherTemp);
            setLocalUser(localUserInit);
          })
          .catch((error) => {
            console.log(
              "There was an error connecting to the session:",
              error.code,
              error.message
            );
          });
      });

      //back?????? ?????? ?????? data??????
      sessionRef.current.on("signal:game", (event) => {
        //???????????? ??????
        //?????????
        const data = event.data;
        if (data.gameId === 1 || data.gameId === 2) {
          if (data.gamename !== "" && data.gamename !== undefined) {
            let nicknameList = [];
            nicknameList = nickname;
            nicknameList.push({
              connectionId: data.streamId,
              keyword: data.gamename,
            });
            setNickname([...nicknameList]);
            console.log(nicknameList);
          }

          console.log(data.gameStatus);
          console.log(data.gameId);
          //?????? ???????????? ????????? ????????????
          if (data.gameId === 1) {
            if (data.gameStatus === 1) {
              if (
                data.streamId ===
                localUserRef.current.getStreamManager().stream.streamId
              ) {
                console.log("my turn");
                //????????? ????????? ???????????? ?????? ?????????
                setStreamId(data.streamId);
                setTargetId(data.targetId);
                setModalMode("assign");
                openKeywordInputModal();
                if (data.index !== undefined && data.index !== "") {
                  setIndex(data.index);
                }
                //?????? ????????? ????????? ????????????
              } else {
                console.log("not my turn");
                setModalMode("wait");
                openKeywordInputModal();
              }
            } else if (data.gameStatus === 2) {
              console.log(data.answerYn);
              if (data.answerYn !== undefined && data.answerYn !== "") {
                if (
                  data.streamId ===
                  localUserRef.current.getStreamManager().stream.streamId
                ) {
                  if (data.answerYn === "Y") {
                    setModalMode("correct");
                    openKeywordInputModal();
                    console.log("here!!!!");
                  } else if (data.answerYn === "N") {
                    setModalMode("wrong");
                    openKeywordInputModal();
                  }
                }
              } else {
                setModalMode("letsplay");
                openKeywordInputModal();
                setTimeout(() => {
                  setModalMode("answer");
                  closeKeywordInputModal();
                }, 5000);
                console.log("????????? ?????? ??????");
              }
            }
            //?????????
          } else if (data.gameId === 2) {
            console.log("here");
            if (data.gameStatus === 1) {
              if (
                data.streamId ===
                localUserRef.current.getStreamManager().stream.streamId
              ) {
                console.log("my turn");
                //????????? ????????? ???????????? ?????? ?????????
                setStreamId(data.streamId);
                setTargetId(data.targetId);
                setModalMode("assignForbidden");
                openKeywordInputModal();
                if (data.index !== undefined && data.index !== "") {
                  setIndex(data.index);
                }
                //?????? ????????? ????????? ????????????
              } else {
                console.log("not my turn");
                setModalMode("wait");
                openKeywordInputModal();
              }
            } else if (data.gameStatus === 2) {
              console.log(data.answerYn);
              if (data.answerYn !== undefined && data.answerYn !== "") {
                if (
                  data.streamId ===
                  localUserRef.current.getStreamManager().stream.streamId
                ) {
                  if (data.answerYn === "Y") {
                    setModalMode("correct");
                    openKeywordInputModal();
                    console.log("here!!!!");
                  } else if (data.answerYn === "N") {
                    setModalMode("wrong");
                    openKeywordInputModal();
                  }
                }
              } else {
                setModalMode("letsplay");
                openKeywordInputModal();
                setTimeout(() => {
                  setModalMode("answer");
                  closeKeywordInputModal();
                }, 5000);
                console.log("????????? ?????? ??????");
              }
            }
          }
        }
      });

      sessionRef.current.on("signal:sing", (event) => {
        const data = event.data;
        if (data.singMode === 2) {
        }
      });
    }
  }, [session]);

  useEffect(() => {
    console.log(subscribers);
    setTargetSubscriber(subscribers[0]);
  }, [subscribers]);

  const leaveSession = () => {
    const mySession = sessionRef.current;
    //console.log(mySession);
    if (mySession) {
      //console.log("leave");
      mySession.disconnect();
    }
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(undefined);
    setMyUserName(undefined);
    setPublisher(undefined);
    setLocalUser(undefined);
  };

  const deleteSubscriber = (stream) => {
    console.log(stream);
    console.log(subscribersRef.current);
    console.log(subscribers);
    const userStream = subscribersRef.current.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];

    console.log(userStream);

    console.log(subscribersRef.current);
    console.log(subscribers);
    let index = subscribersRef.current.indexOf(userStream, 0);
    console.log(index);
    if (index > -1) {
      subscribersRef.current.splice(index, 1);
      console.log(subscribersRef.current);
      console.log(subscribers);
      setSubscribers([...subscribersRef.current]);
    }
    console.log(subscribersRef.current);
  };

  useEffect(() => {
    console.log(subscribersRef.current);
    console.log(subscribers);
  }, [subscribers]);

  useEffect(() => {
    console.log("here");
    const nickname = subscribers.map((data) => {
      if (targetId === data.getStreamManager().stream.streamId) {
        return data.nickname;
      }
    });
    console.log(nickname);
    setTargetNickName(nickname);
  }, [targetId]);

  const onbeforeunload = (e) => {
    //console.log("tlfgodehla");

    //console.log("dfsdfsdf");
    leaveSession();
  };

  const sendSignalUserChanged = (data) => {
    //console.log("????????? ?????? ????????? ??????");
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    console.log(sessionRef.current);
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    //console.log("??? ?????? ??????!!!");
    localUserInit.setVideoActive(!localUserInit.isVideoActive());
    localUserInit
      .getStreamManager()
      .publishVideo(localUserInit.isVideoActive());

    setLocalUser(localUserInit);
    sendSignalUserChanged({ isVideoActive: localUserInit.isVideoActive() });
  };

  const micStatusChanged = () => {
    //console.log("????????? ?????? ??????!!!");
    localUserInit.setAudioActive(!localUserInit.isAudioActive());
    localUserInit
      .getStreamManager()
      .publishAudio(localUserInit.isAudioActive());
    sendSignalUserChanged({ isAudioActive: localUserInit.isAudioActive() });
    setLocalUser(localUserInit);
  };

  const sendSignalCameraStart = () => {
    const data = {
      photoStatus: 1,
    };
    const signalOptions = {
      data: JSON.stringify(data),
      type: "photo",
    };
    sessionRef.current.signal(signalOptions);
  };

  const getToken = () => {
    return createSession(mySessionId).then((sessionId) =>
      createToken(sessionId)
    );
  };

  const createSession = (sessionId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });
      axios1
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          //console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
            resolve(sessionId);
          } else {
            ////console.log(error);
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
  };

  const createToken = (sessionId) => {
    let jsonBody = {
      role: "PUBLISHER",
      kurentoOptions: {},
    };
    jsonBody.kurentoOptions = {
      allowedFilters: ["FaceOverlayFilter", "ChromaFilter", "GStreamerFilter"],
    };

    return new Promise((resolve, reject) => {
      let data = JSON.stringify(jsonBody);
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
          ////console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  const onCapture = () => {
    let flag = 0;
    setImages([]);
    setStatus(1);
    const loop = setInterval(() => {
      setCount((prev) => prev - 1);
      if (countRef.current === 0) {
        let cameraSound = new Audio(require("../../assets/sounds/camera.mp3"));
        cameraSound.volume = 0.1;
        cameraSound.play();

        setCount(5);
        console.log(flag);

        html2canvas(document.getElementById("user-video")).then((canvas) => {
          setImages([...imagesRef.current, canvas.toDataURL()]);
          flag++;

          // onSaveAs(canvas.toDataURL("image/png"), "image-download.png");
        });
        if (flag === 3) {
          setStatus(2);
          clearInterval(loop);
          //api??????
          //???????????? ????????????
          console.log("api!!!");
          let blobBin = atob(imagesRef.current[0].split(",")[1]); // base64 ????????? ?????????
          let array = [];
          for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
          }
          console.log(array);
          let file = new Blob([new Uint8Array(array)], { type: "image/png" }); // Blob ??????
          let newfile = new File([file], `room${sessionName}.png`);
          console.log(newfile);
          let formdata = new FormData(); // formData ??????
          formdata.append("file", newfile); // file data ??????
          console.dir(formdata);
          onSaveToProfile(formdata);
          // console.log(imagesRef.current);
          // onSaveToProfile(imagesRef.current[0]);
        }
        // sleep(1500);
      }
    }, 500);
  };

  const onSaveToProfile = async (formdata) => {
    console.log(formdata);

    const { data } = await getImgUploadResult(formdata);
    console.log(data);
    const body = {
      roomSeq: Number(sessionName),
      imgUrl: data.url,
    };
    await setRoomSnapshotResult(body);
  };

  const onRetry = () => {
    sendSignalCameraStart();
  };

  const onSave = () => {
    html2canvas(document.getElementById("image-container")).then((canvas) => {
      saveImg(canvas.toDataURL("image/png"), "????????? ??????.png");
    });
  };

  const handleVoiceFilter = () => {
    console.log(localUserRef.current);
    // const data = { command: "pitch pitch=0.5" };
    const type = "GStreamerFilter";
    const options = { command: "pitch pitch=0.7" };
    localUserRef.current
      .getStreamManager()
      .stream.applyFilter(type, options)
      .then((result) => {
        console.log(result);
      });
  };
  // filter.options = { command: "pitch pitch=0.5" };
  const saveImg = (uri, filename) => {
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };
  const closeSelectingPage = () => {
    setIsSelecting(false);
  };
  const closeStartPage = () => {
    console.log("close here");
    setStartPage(false);
  };
  const openStartPage = () => {
    setStartPage(true);
  };
  const giveGamename = (data, gamemode) => {
    console.log(streamId);
    console.log(targetId);
    console.log(data);
    console.log(index);
    const senddata = {
      streamId: streamId,
      gameStatus: 1,
      gameId: gamemode,
      gamename: data,
      index: index,
    };
    localUserRef.current.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  };
  const checkMyAnswer = (data) => {
    const senddata = {
      streamId: streamId,
      gameStatus: 2,
      gameId: 1,
      gamename: data,
    };
    localUserRef.current.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  };
  const openKeywordInputModal = () => {
    setKeywordInputModal(true);
  };
  const closeKeywordInputModal = () => {
    setKeywordInputModal(false);
  };
  const confirmMyAnswer = (data) => {
    closeKeywordInputModal();
    setAnswer(data);
    //?????? ?????? ????????? api??????
    checkMyAnswer(data);
  };
  const confirmTargetGameName = (data) => {
    closeKeywordInputModal();
    setTargetGameName(data);
    if (mode === "game1") giveGamename(data, 1);
    else if (mode === "game2") giveGamename(data, 2);
    //target gamename ??????????????? api??????
  };
  return (
    <div className={styles["contents-container"]}>
      <SelectingGame
        open={isSelecting}
        close={closeSelectingPage}
        startPage={startPage}
        closeStartPage={closeStartPage}
      />
      {mode === "snapshot" ? (
        <div className={styles.countContainer}>
          <p className={styles.count}>{count}</p>
        </div>
      ) : mode === "game1" ? (
        <Keyword
          open={keywordInputModal}
          close={closeKeywordInputModal}
          confirmMyAnswer={confirmMyAnswer}
          confirmTargetGameName={confirmTargetGameName}
          mode={modalMode}
          targetNickName={targetNickName}
        />
      ) : mode === "game2" ? (
        <Keyword
          open={keywordInputModal}
          close={closeKeywordInputModal}
          confirmMyAnswer={confirmMyAnswer}
          confirmTargetGameName={confirmTargetGameName}
          mode={modalMode}
          targetNickName={targetNickName}
        />
      ) : null}
      <div className={styles["user-videos-container"]}>
        <div
          id="user-video"
          className={
            mode === "karaoke"
              ? `${styles["video-container"]} ${styles.karaoke}`
              : participantNumRef.current > 6
              ? `${styles["video-container"]} ${styles.twoXfour}`
              : participantNumRef.current > 4
              ? `${styles["video-container"]} ${styles.twoXthree}`
              : participantNumRef.current > 2
              ? `${styles["video-container"]} ${styles.twoXtwo}`
              : styles["video-container"]
          }
        >
          {localUserRef.current !== undefined &&
            localUserRef.current.getStreamManager() !== undefined && (
              <StreamComponent
                user={localUserRef.current}
                sessionId={mySessionId}
                camStatusChanged={camStatusChanged}
                micStatusChanged={micStatusChanged}
                subscribers={subscribers}
                mode={mode}
                bangzzang={bangzzang}
                openKeywordInputModal={openKeywordInputModal}
              />
            )}
          {mode === "karaoke" ? (
            <div className={styles.videoplayer}>
              <Karaoke user={localUserRef.current} />
            </div>
          ) : null}

          {subscribersRef.current.map((sub, i) => {
            return (
              <StreamComponent
                key={i}
                user={sub}
                targetSubscriber={targetSubscriber}
                subscribers={subscribers}
                mode={mode}
                nickname={nickname}
              />
            );
          })}
        </div>
      </div>
      {localUser !== undefined && localUser.getStreamManager() !== undefined && (
        <div className={styles["chat-container"]}>
          {mode === "snapshot" ? (
            <SnapShotResult
              images={images}
              status={status}
              onStart={sendSignalCameraStart}
              onRetry={onRetry}
              onSave={onSave}
            />
          ) : (
            <>
              <Chat user={localUserRef.current} />
              <button onClick={handleVoiceFilter}>???????????????</button>
            </>
          )}
          {mode !== "karaoke" ? (
            <MusicPlayer user={localUserRef.current} music={music} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RoomContentsGrid;
