import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import axios1 from "../../api/WebRtcApi";
import RoomApi from "../../api/RoomApi";
import ImgApi from "../../api/ImgApi.js";
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
import Karaoke from "./karaoke/Karaoke";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";

let localUserInit = new UserModel();
let OV = undefined;

const RoomContents = ({
  sessionName,
  userName,
  media,
  mode,
  singMode,
  // musicList,
  // music,
  bangzzang,
  back,
  goHome,
  home,
}) => {
  const navigate = useNavigate();
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
  const [startPage, setStartPage] = useState(true);
  const [nickname, setNickname] = useState([]);
  const [streamId, setStreamId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [targetGameName, setTargetGameName] = useState("");
  const [index, setIndex] = useState("1");
  const [keywordInputModal, setKeywordInputModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [modalMode, setModalMode] = useState("start");
  const [targetNickName, setTargetNickName] = useState("");
  const [siren, setSiren] = useState("N");
  const [sirenTarget, setSirenTarget] = useState({});
  const [sirenTargetNickName, setSirenTargetNickName] = useState({});
  const [correctGamename, setCorrectGamename] = useState(false);
  const [correctForbiddenName, setCorrectForbiddenName] = useState(false);

  const [correctNickname, setCorrectNickname] = useState([]);
  const [correctPeopleId, setCorrectPeopleId] = useState();
  const [correctPeopleName, setCorrectPeopleName] = useState();

  // console.log(targetSubscriber);
  // 인원수
  const [participantNum, setParticpantNum] = useState(1);
  const participantNumRef = useRef(participantNum);
  participantNumRef.current = participantNum;

  const { getRoomExitResult } = RoomApi;
  // voicefilter
  // const [voiceFilter, setVoiceFilter] = useState(false);
  console.log(sessionName);

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
    console.log(participantNum);
    console.log(participantNumRef.current);
  }, [participantNum]);
  useEffect(() => {
    if (axios.defaults.headers.Authorization === undefined) {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        console.log("실행됩니다.");
        axios.defaults.headers.Authorization =
          "Bearer " + sessionStorage.getItem("accessToken");
        console.log(axios.defaults.headers.Authorization);
      } else {
        toast.error(
          <div className="hi" style={{ width: "350px" }}>
            로그인 후 이용가능 합니다. 로그인 해주세요
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            role: "alert",
          }
        );
        navigate("/user/login");
      }
    }

    setLoginStatus("3");
    console.log(loginStatus);
    const preventGoBack = () => {
      window.history.pushState(null, "", window.location.href);
      console.log("prevent go back!");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventGoBack);
    window.addEventListener("beforeunload", onbeforeunload);
    window.addEventListener("unload", handleleaveRoom);

    joinSession();
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      window.removeEventListener("popstate", preventGoBack);
      window.removeEventListener("unload", handleleaveRoom);
      handleleaveRoom();
      leaveSession();
    };
  }, []);

  useEffect(() => {
    const nickname = subscribers.map((data) => {
      if (targetId === data.getStreamManager().stream.streamId) {
        return data.nickname;
      }
    });
    console.log(subscribers);
    console.log(targetId);
    setTargetNickName(nickname);
  }, [targetId]);

  useEffect(() => {
    console.log(subscribers);
    const nickname = subscribers.map((data) => {
      if (sirenTarget === data.getStreamManager().stream.streamId) {
        return data.nickname;
      }
    });
    setSirenTargetNickName(nickname);
  }, [sirenTarget]);

  useEffect(() => {
    const nickname = subscribers.map((data) => {
      if (correctPeopleId === data.getStreamManager().stream.streamId) {
        return data.nickname;
      }
    });
    setCorrectPeopleName(nickname);
  }, [correctPeopleId]);
  // useEffect(()=> {
  //   if(modalMode==="yousayForbidden") setModalMode("answerForbidden")
  //   if(modalMode==="someonesayForbidden") setModalMode("answerForbidden")
  // },[modalMode])

  useEffect(() => {
    if (sessionRef.current) {
      console.log(sessionRef.current);
      // 상대방이 들어왔을 때 실행

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
        let nicknameData = nickname;
        let correctNicknameData = correctNickname;
        const data = event.data;
        if (data.gameStatus === 3) {
          if (data.gameId !== 3) {
            console.log("gotoHome");
            goHome();
          }
        } else {
          if (data.gameId === 1) {
            if (data.index !== undefined) {
              //기존 다 날리고 가자
              console.log("set");
              //닉네임 정하기
              console.log("닉네임 정하자");
              //바뀌는 닉네임
              nicknameData.push({
                connectionId: data.streamId,
                keyword: data.gamename,
              });
              setNickname([...nicknameData]);

              correctNicknameData.push({
                connectionId: data.streamId,
                keyword: data.gamename,
              });

              setCorrectNickname([...correctNicknameData]);
            }
            //닉네임 맞추는 단계
            if (
              data.gameStatus === 2 &&
              data.index === undefined &&
              data.answerYn !== undefined
            ) {
              console.log("here????");
              nicknameData.push({
                connectionId: data.streamId,
                keyword: data.gamename,
              });
              setNickname([...nicknameData]);
            }
            if (data.index === undefined && data.gameStatus === 1) {
              nicknameData.length = 0;
              correctNicknameData.length = 0;
              setNickname([...nicknameData]);
              setCorrectNickname([...correctNicknameData]);
              openKeywordInputModal("start");
              setCorrectGamename(false);
              setCorrectForbiddenName(false);
              setTimeout(() => {
                yangGame(data);
              }, 5000);
            } else {
              yangGame(data);
            }
          } else if (data.gameId === 2) {
            if (data.index !== undefined) {
              //닉네임 정하기
              //바뀌는 닉네임
              nicknameData.push({
                connectionId: data.streamId,
                keyword: data.gamename,
              });
              setNickname([...nicknameData]);

              correctNicknameData.push({
                connectionId: data.streamId,
                keyword: data.gamename,
              });

              setCorrectNickname([...correctNicknameData]);
            }

            //닉네임 맞추는 단계
            if (
              data.gameStatus === 2 &&
              data.index === undefined &&
              data.sirenYn === undefined
            ) {
              nicknameData.push({
                connectionId: data.streamId,
                keyword: data.gamename,
              });
              setNickname([...nicknameData]);
            }

            if (
              data.index === undefined &&
              data.gameStatus === 1 &&
              data.sirenYn === undefined
            ) {
              nicknameData.length = 0;
              correctNicknameData.length = 0;
              setCorrectNickname([...correctNicknameData]);
              setNickname([...nicknameData]);
              openKeywordInputModal("startForbidden");
              setCorrectForbiddenName(false);
              setCorrectGamename(false);
              setTimeout(() => {
                forbidden(data);
              }, 5000);
            } else {
              forbidden(data);
            }
          }
        }
      });

      sessionRef.current.on("signal:sing", (event) => {
        const data = event.data;
        console.log(data);
        console.log(localUserRef.current.getStreamManager().stream.streamId);
        if (data.singStatus === 2 && data.singMode === 2) {
          console.log("너도 오냐?");
          removeVoiceFilter();
          if (
            data.voiceFilter.includes(
              localUserRef.current.getStreamManager().stream.streamId
            )
          ) {
            // setVoiceFilter(true);
            handleVoiceFilter();
          }
        } else if (data.singStatus === -1) {
          console.log("오냐?");
          removeVoiceFilter();
          goHome();
          //       setContentTitle(roomTitle);
          // setMode("basic");
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
      //정답 맞추기 시도했다
      if (data.answerYn !== undefined && data.answerYn !== "") {
        //내가 했디
        if (
          data.streamId ===
          localUserRef.current.getStreamManager().stream.streamId
        ) {
          if (data.answerYn === "Y") {
            // setModalMode("correct");
            openKeywordInputModal("correct");
            setCorrectGamename(true);
            console.log("here!!!!");
          } else if (data.answerYn === "N") {
            console.log("wrong!!!!!!");
            // setModalMode("wrong");
            openKeywordInputModal("wrong");
          }
          //내가 안했다
        } else {
          //누군가 맞췄다
          if (data.answerYn === "Y") {
            openKeywordInputModal("someoneCorrect");
            setCorrectPeopleId(data.streamId);
          }
        }
        //게임안내
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
  };

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
      //정답 맞춘다
      if (data.answerYn !== undefined && data.answerYn !== "") {
        if (
          data.streamId ===
          localUserRef.current.getStreamManager().stream.streamId
        ) {
          if (data.answerYn === "Y") {
            // setModalMode("correct");
            setCorrectForbiddenName(true);
            openKeywordInputModal("correctForbidden");
          } else if (data.answerYn === "N") {
            // setModalMode("wrong");
            openKeywordInputModal("wrong");
          }
        } else {
          // 누군가 맞췄다
          if (data.answerYn === "Y") {
            openKeywordInputModal("someoneCorrectForbidden");
            setCorrectPeopleId(data.streamId);
            console.log("here!!!!");
          }
        }
      } else if (data.sirenYn !== undefined && data.sirenYn !== "") {
        console.log(data.sirenYn);
        //사이렌 울려라
        if (data.sirenYn === "Y") {
          console.log(data.streamId);
          setSirenTarget(data.streamId);
          //누가 날
          if (
            data.streamId ===
            localUserRef.current.getStreamManager().stream.streamId
          ) {
            // setModalMode("yousayForbidden");
            openKeywordInputModal("yousayForbidden");
            //저녀석 잡아라
          } else {
            // setModalMode("someonesayForbidden");
            openKeywordInputModal("someonesayForbidden");
          }
          //이제 금지어 찾아봐라
        } else {
          // setModalMode("letsplayForbidden");
          openKeywordInputModal("letsplayForbidden");
          setTimeout(() => {
            setModalMode("answer");
            closeKeywordInputModal();
          }, 7000);
          console.log("키워드 설정 완료");
        }
      }
    }
  };
  const handleleaveRoom = async () => {
    const body = {
      roomSeq: sessionName * 1,
    };
    await getRoomExitResult(body);
  };
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
    e.preventDefault();
    e.returnValue = "나가실껀가요?";
    //console.log("dfsdfsdf");
    // leaveSession();
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
          setImages([...imagesRef.current, canvas.toDataURL("image/jpeg")]);
          flag++;

          // onSaveAs(canvas.toDataURL("image/png"), "image-download.png");
        });
        if (flag === 3) {
          setStatus(2);
          clearInterval(loop);
          //api호출
          //백엔드에 사진저장
          console.log("api!!!");
          let blobBin = atob(imagesRef.current[0].split(",")[1]); // base64 데이터 디코딩
          let array = [];
          for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
          }
          console.log(array);
          let file = new Blob([new Uint8Array(array)], { type: "image/jpeg" }); // Blob 생성
          let newfile = new File([file], `room${sessionName}.jpeg`);
          console.log(newfile);
          let formdata = new FormData(); // formData 생성
          formdata.append("file", newfile); // file data 추가
          console.dir(formdata);
          onSaveToProfile(formdata);
          // console.log(imagesRef.current);
          // onSaveToProfile(imagesRef.current[0]);
        }
        // sleep(1500);
      }
    }, 1500);
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
      saveImg(canvas.toDataURL("image/png"), "오늘의 추억.png");
    });
  };

  // const randomNum = (min, max) => {
  //   const randNum = Math.floor(Math.random() * (max - min) + min);
  //   return randNum;
  // };

  const handleVoiceFilter = () => {
    const filterList = [0.6, 0.7, 0.8, 1.5, 1.6, 1.7];
    const type = "GStreamerFilter";
    const rnum = Math.floor(Math.random() * 5);
    console.log(rnum);
    const options = { command: `pitch pitch=${filterList[rnum]}` };
    // const options = { command: `pitch pitch=0.6` };
    localUserRef.current
      .getStreamManager()
      .stream.applyFilter(type, options)
      .then((result) => {
        console.log(result);
      });
  };

  const removeVoiceFilter = () => {
    localUserRef.current
      .getStreamManager()
      .stream.removeFilter()
      .then(() => {
        console.log("필터 제거");
      })
      .catch(() => {
        console.log("필터 없어용");
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
  // const openStartPage = () => {
  //   setStartPage(true);
  // };
  const giveGamename = (data, gamemode) => {
    console.log(streamId);
    console.log(targetId);
    console.log(data);
    console.log(index);
    let senddata = {};
    if (gamemode === 1) {
      senddata = {
        streamId: streamId,
        gameStatus: 1,
        gameId: gamemode,
        gamename: data,
        index: index,
      };
    } else if (gamemode === 2) {
      senddata = {
        streamId: streamId,
        gameStatus: 1,
        gameId: gamemode,
        gamename: data,
        index: index,
        sirenYn: siren,
      };
    }
    localUserRef.current.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  };
  const checkMyAnswer = (data, gamemode) => {
    let senddata = {};
    console.log(gamemode);
    if (gamemode === 1) {
      senddata = {
        streamId: streamId,
        gameStatus: 2,
        gameId: 1,
        gamename: data,
      };
    } else if (gamemode === 2) {
      console.log("여기");
      senddata = {
        streamId: streamId,
        gameStatus: 2,
        gameId: gamemode,
        gamename: data,
        sirenYn: "N",
      };
    }
    localUserRef.current.getStreamManager().stream.session.signal({
      data: JSON.stringify(senddata),
      type: "game",
    });
  };
  const openKeywordInputModal = (changemode) => {
    //키워드 이미 맞췄다
    if (correctForbiddenName === true) {
      setModalMode("alreadyForbidden");
      //금지어 이미 맞췄다
    } else if (correctGamename === true) {
      setModalMode("already");
      //아직 마추지 못했다
    } else {
      setModalMode(changemode);
    }
    setKeywordInputModal(true);
  };
  const closeKeywordInputModal = (changeMode) => {
    setModalMode(changeMode);
    setKeywordInputModal(false);
  };
  const confirmMyAnswer = (data, gamemode) => {
    closeKeywordInputModal();
    setAnswer(data);
    //게임 정답 맞추는 api호출
    checkMyAnswer(data, gamemode);
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
      streamId: target.getStreamManager().stream.streamId,
      gameId: 2,
      gameStatus: 2,
      sirenYn: "Y",
    };
    sessionRef.current.signal({
      type: "game",
      data: JSON.stringify(data),
    });
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
          gameId={1}
          correctPeopleName={correctPeopleName}
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
          sirenTargetNickName={sirenTargetNickName}
          correctPeopleName={correctPeopleName}
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
              <Karaoke user={localUserRef.current} singMode={singMode} />
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
                correctNickname={correctNickname}
                sirenWingWing={sirenWingWing}
                correctPeopleName={correctPeopleName}
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
              <Chat
                user={localUserRef.current}
                mode={mode}
                exitgame={home}
                sub={subscribers}
              />
              {/* <button onClick={handleVoiceFilter}>목소리변조</button> */}
            </>
          )}
          {mode !== "karaoke" ? (
            <MusicPlayer user={localUserRef.current} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RoomContents;
