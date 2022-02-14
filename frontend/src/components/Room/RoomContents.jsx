import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import axios1 from "../../api/WebRtcApi";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import YangGameComponent from "././game/YangGameComponent";
import SelectingGame from "././game/SelectingGame";

import styles from "./RoomContents.module.css";
import Chat from "./chat/Chat";
import UserModel from "../models/user-model";
import LoginStatusContext from "../../contexts/LoginStatusContext";
import NameContext from "../../contexts/NameContext";

import SnapShotResult from "./snapshot/SnapShotResult";
import html2canvas from "html2canvas";

import MusicPlayer from "./music/MusicPlayer";
import SessionIdContext from "../../contexts/SessionIdContext";
import Keyword from "../Modals/Game/Keyword";

const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";

let localUserInit = new UserModel();
let OV = undefined;

const RoomContents = ({
  sessionName,
  userName,
  media,
  mode,
  musicList,
  music,
  bangzzang,
}) => {
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
  const [siren, setSiren] = useState("N");
  const [sirenTarget, setSirenTarget] = useState({});
  const [sirenTargetNickName, setSirenTargetNickName] = useState({});

  // console.log(targetSubscriber);

  const sessionRef = useRef(session);
  sessionRef.current = session;
  setSessionId(sessionRef.current);

  const publisherRef = useRef(publisher);
  publisherRef.current = publisher;

  const localUserRef = useRef(localUser);
  localUserRef.current = localUser;

  console.log(localUserRef.current);

  // 인생네컷
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
    const nickname = subscribers.map((data)=>{if(targetId===data.getStreamManager().stream.streamId) {
      return data.nickname;
    }})
    console.log(subscribers);
    console.log(targetId);
    setTargetNickName(nickname);
  }, [targetId]);

  useEffect(()=> {
    console.log(subscribers);
    const nickname = subscribers.map((data)=>{if(sirenTarget===data.getStreamManager().stream.streamId) {
      return data.nickname;
    }})
    setSirenTargetNickName(nickname);
  },[sirenTarget])

  // useEffect(()=> {
  //   if(modalMode==="yousayForbidden") setModalMode("answerForbidden")
  //   if(modalMode==="someonesayForbidden") setModalMode("answerForbidden")
  // },[modalMode])

  useEffect(() => {
    if (sessionRef.current) {
      console.log(sessionRef.current);
      // 상대방이 들어왔을 때 실행
      sessionRef.current.on("streamCreated", (event) => {
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

      // 상대방이 상태를 변경했을 때 실행 (카메라 / 마이크 등)
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
        deleteSubscriber(event.stream);
      });

      sessionRef.current.on("exception", (exception) => {
        console.warn(exception);
      });

      sessionRef.current.on("signal:photo", (event) => {
        const data = event.data;
        console.log(data);
        if (data.photoStatus === 1) {
          console.log("사진 찍어요~");
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

      //back으로 부터 받는 data처리
      sessionRef.current.on("signal:game", (event) => {
        //초기요청 응답
        //양세찬
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
          //내가 키워드를 정해줄 차례라면
          if (data.gameId === 1) {
            closeKeywordInputModal("answer");
            //가장 처음온 요청인경우
            console.log(data.index);
            console.log(data.gameStatus);
            if(data.index===undefined&&data.gameStatus===1) {
              openKeywordInputModal("start");
              setTimeout(() => {
                yangGame(data);
              }, 6000);
            }else {
              yangGame(data);
            }
            
            
            //금지어
          } else if (data.gameId === 2) {
            if(data.index===undefined&&data.gameStatus===1) {
              openKeywordInputModal("startForbidden");
              setTimeout(() => {
                forbidden(data);
              }, 6000);
            }else {
              forbidden(data);
            }
          }
        }
      });
    }
  }, [session]);

  useEffect(() => {
    console.log(subscribers);
    setTargetSubscriber(subscribers[0]);
  }, [subscribers]);

  const yangGame = (data) => {
    if (data.gameStatus === 1) {
      if (
        data.streamId ===
        localUserRef.current.getStreamManager().stream.streamId
      ) {
        console.log("my turn");
        //상대방 키워드 입력해줄 모달 띄우기
        setStreamId(data.streamId);
        setTargetId(data.targetId);
        // setModalMode("assign");
        openKeywordInputModal("assign");
        if (data.index !== undefined && data.index !== "") {
          setIndex(data.index);
        }
        //내가 정해줄 차례가 아니라면
      } else {
        console.log("not my turn");
        // setModalMode("wait");
        openKeywordInputModal("wait");
      }
    } else if (data.gameStatus === 2) {
      console.log(data.answerYn);
      if (data.answerYn !== undefined && data.answerYn !== "") {
        if (
          data.streamId ===
          localUserRef.current.getStreamManager().stream.streamId
        ) {
          if (data.answerYn === "Y") {
            // setModalMode("correct");
            openKeywordInputModal("correct");
            console.log("here!!!!");
          } else if (data.answerYn === "N") {
            console.log("wrong!!!!!!");
            // setModalMode("wrong");
            openKeywordInputModal("wrong");
          }
        }
      } else {
        // setModalMode("letsplay");
        openKeywordInputModal("letsplay");
        setTimeout(() => {
          // setModalMode("answer");
          closeKeywordInputModal("answer");
        }, 4000);
        console.log("키워드 설정 완료");
      }
    }
  }

  const forbidden = (data) => {
    console.log("here");
      if (data.gameStatus === 1) {
        if (
          data.streamId ===
          localUserRef.current.getStreamManager().stream.streamId
        ) {
          console.log("my turn");
          //상대방 금지어 입력해줄 모달 띄우기
          setStreamId(data.streamId);
          setTargetId(data.targetId);
          // setModalMode("assignForbidden");
          openKeywordInputModal("assignForbidden");
          if (data.index !== undefined && data.index !== "") {
            setIndex(data.index);
          }
          //내가 정해줄 차례가 아니라면
        } else {
          console.log("not my turn");
          // setModalMode("waitForbidden");
          openKeywordInputModal("waitForbidden");
        }
        //금지어 입력 다했다
      } else if (data.gameStatus === 2) {
        console.log(data.answerYn);
        if (data.answerYn !== undefined && data.answerYn !== "") {
          if (
            data.streamId ===
            localUserRef.current.getStreamManager().stream.streamId
          ) {
            if (data.answerYn === "Y") {
              setModalMode("correct");
              openKeywordInputModal("correct");
              console.log("here!!!!");
            } else if (data.answerYn === "N") {
              // setModalMode("wrong");
              openKeywordInputModal("wrong");
            }
          }
        } else if(data.sirenYn !== undefined && data.sirenYn !== "") {
          console.log(data.sirenYn);
          //사이렌 울려라
          if(data.sirenYn==="Y") {
            console.log(data.streamId);
            setSirenTarget(data.streamId);
            //누가 날
            if (data.streamId === localUserRef.current.getStreamManager().stream.streamId) {
              // setModalMode("yousayForbidden");
              openKeywordInputModal("yousayForbidden");
              //저녀석 잡아라
            }else {
              // setModalMode("someonesayForbidden");
              openKeywordInputModal("someonesayForbidden");
            }
            //이제 금지어 찾아봐라
          }else {
            // setModalMode("letsplayForbidden");
            openKeywordInputModal("letsplayForbidden");
            setTimeout(() => {
              setModalMode("answer");
              closeKeywordInputModal();
            }, 7000);
            console.log("키워드 설정 완료");
          }
        }else {
        }
      }
  }

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




  const onbeforeunload = (e) => {
    //console.log("tlfgodehla");

    //console.log("dfsdfsdf");
    leaveSession();
  };

  const sendSignalUserChanged = (data) => {
    //console.log("시그널 보내 시그널 보내");
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    console.log(sessionRef.current);
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    //console.log("캠 상태 변경!!!");
    localUserInit.setVideoActive(!localUserInit.isVideoActive());
    localUserInit
      .getStreamManager()
      .publishVideo(localUserInit.isVideoActive());

    setLocalUser(localUserInit);
    sendSignalUserChanged({ isVideoActive: localUserInit.isVideoActive() });
  };

  const micStatusChanged = () => {
    //console.log("마이크 상태 변경!!!");
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
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({});
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
          //api호출
          //백엔드에 사진저장
        }
        // sleep(1500);
      }
    }, 1500);
  };

  const onRetry = () => {
    sendSignalCameraStart();
  };

  const onSave = () => {
    html2canvas(document.getElementById("image-container")).then((canvas) => {
      saveImg(canvas.toDataURL("image/png"), "오늘의 추억.png");
    });
  };

  const handleVoiceFilter = () => {
    console.log(localUserRef.current);
    const data = { command: "pitch pitch=0.5" };
    const type = "GStreamerFilter";
    const options = { command: "pitch pitch=0.5" };
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
    let senddata = {};
    if(gamemode===1) {
      senddata = {
        streamId: streamId,
        gameStatus: 1,
        gameId: gamemode,
        gamename: data,
        index: index,
      };
    }else if(gamemode===2) {
      senddata = {
        streamId: streamId,
        gameStatus: 1,
        gameId: gamemode,
        gamename: data,
        index: index,
        sirenYn : siren,
      };
    }
    localUserRef.current.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  };
  const checkMyAnswer = (data,gamemode) => {
    let senddata = {};
    console.log(gamemode);
    if(gamemode===1) {
      senddata = {
        streamId: streamId,
        gameStatus: 2,
        gameId: 1,
        gamename: data,
      };
    }else if(gamemode===2) {
      console.log("여기")
      senddata = {
        streamId: streamId,
        gameStatus: 2,
        gameId : gamemode,
        gamename: data,
        sirenYn : "N",
      };
    }
    localUserRef.current.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  };
  const openKeywordInputModal = (changemode) => {
    setModalMode(changemode);
    setKeywordInputModal(true);
  };
  const closeKeywordInputModal = (changeMode) => {
    setModalMode(changeMode);
    setKeywordInputModal(false);
  };
  const confirmMyAnswer = (data,gamemode) => {
    closeKeywordInputModal();
    setAnswer(data);
    //게임 정답 맞추는 api호출
    checkMyAnswer(data,gamemode);
  };
  const confirmTargetGameName = (data) => {
    closeKeywordInputModal();
    setTargetGameName(data);
    if (mode === "game1") giveGamename(data, 1);
    else if (mode === "game2") giveGamename(data, 2);
    //target gamename 지정해주는 api호출
  };
  const sirenWingWing = (target) => {
    console.log(target);
    console.log("wing~~~~~~~");
    //사이렌 당한 유저 가져오기
    const data = {
      streamId : target.getStreamManager().stream.streamId,
      gameId : 2,
      gameStatus : 2,
      sirenYn : "Y"
    }
    sessionRef.current.signal({
      type : "game",
      data : JSON.stringify(data),
    });
  }
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
          gameId={1}
        />
      ) : mode === "game2" ? (
        <Keyword
          open={keywordInputModal}
          close={closeKeywordInputModal}
          confirmMyAnswer={confirmMyAnswer}
          confirmTargetGameName={confirmTargetGameName}
          mode={modalMode}
          targetNickName={targetNickName}
          gameId={2}
          sirenTargetNickName = {sirenTargetNickName}
        />
      ) : null}
      <div id="user-video" className={styles["video-container"]}>
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
        {subscribersRef.current.map((sub, i) => {
          return (
            <StreamComponent
              key={i}
              user={sub}
              targetSubscriber={targetSubscriber}
              subscribers={subscribers}
              mode={mode}
              nickname={nickname}
              sirenWingWing = {sirenWingWing}
            />
          );
        })}
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
              {/* <button onClick={handleVoiceFilter}>목소리변조</button> */}
            </>
          )}
          <MusicPlayer user={localUserRef.current} music={music} />
        </div>
      )}
    </div>
  );
};

export default RoomContents;
