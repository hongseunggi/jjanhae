import React, { useEffect, useRef } from "react";
import { useState } from "react";
import axios1 from "../../api/WebRtcApi";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import YangGameComponent from "././game/YangGameComponent";

import styles from "./RoomContents.module.css";
import Chat from "./chat/Chat";
import UserModel from "../models/user-model";

import ReactPlayer from 'react-player'

const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";

let localUserInit = new UserModel();
let OV = undefined;

const RoomContents = ({ sessionName, userName, media }) => {

  const [mySessionId, setMySessionId] = useState(sessionName);
  const [myUserName, setMyUserName] = useState(userName);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(undefined);
  const [playYangGame, setPlayYangGame] = useState();
  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;
  const [targetSubscriber, setTargetSubscriber] = useState({});

  console.log(targetSubscriber);

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const publisherRef = useRef(publisher);
  publisherRef.current = publisher;

  const localUserRef = useRef(localUser);
  localUserRef.current = localUser;

  const targetSubscriberRef = useRef(targetSubscriber);
  targetSubscriberRef.current = targetSubscriber;

  console.log(myUserName);
  const joinSession = () => {
    OV = new OpenVidu();
    setSession(OV.initSession());
  };

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      leaveSession();
    };
  }, []);

  useEffect(() => {
    if (sessionRef.current) {
      // 상대방이 들어왔을 때 실행
      sessionRef.current.on("streamCreated", (event) => {
        let subscriber = sessionRef.current.subscribe(event.stream, undefined);
        console.log(event);
        const newUser = new UserModel();
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setAudioActive(event.stream.audioActive);
        newUser.setVideoActive(event.stream.videoActive);
        newUser.setType("remote");

        const nickname = event.stream.connection.data.split("%")[0];
        console.log(nickname);
        newUser.setNickname(JSON.parse(nickname).clientData);

        setSubscribers([...subscribersRef.current, newUser]);
      });

      // 상대방이 상태를 변경했을 때 실행 (카메라 / 마이크 등)
      sessionRef.current.on("signal:userChanged", (event) => {
        console.log("1");
        console.log(subscribersRef.current);
        subscribersRef.current.forEach((user) => {
          if (user.getConnectionId() === event.from.connectionId) {
            const data = JSON.parse(event.data);
            console.log(data);
            console.log("EVENTO REMOTE: ", event.data);
            if (data.isAudioActive !== undefined) {
              user.setAudioActive(data.isAudioActive);
            }
            if (data.isVideoActive !== undefined) {
              user.setVideoActive(data.isVideoActive);
            }
          }
        });
        console.log("2");
        console.log(subscribersRef.current);
        setSubscribers([...subscribersRef.current]);
      });

      sessionRef.current.on("streamDestroyed", (event) => {
        deleteSubscriber(event.stream);
      });

      sessionRef.current.on("exception", (exception) => {
        console.warn(exception);
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
    }
  }, [session]);

  useEffect (()=> {
    console.log(subscribers);
    setTargetSubscriber(subscribers[0]);
  }, [subscribers])

  const leaveSession = () => {
    const mySession = sessionRef.current;
    console.log(mySession);
    if (mySession) {
      console.log("leave");
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
    const userStream = subscribersRef.current.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    let index = subscribersRef.current.indexOf(userStream, 0);
    if (index > -1) {
      subscribersRef.current.splice(index, 1);
      setSubscribers([...subscribersRef.current]);
    }
  };

  const onbeforeunload = (e) => {
    leaveSession();
  };

  const sendSignalUserChanged = (data) => {
    console.log("시그널 보내 시그널 보내");
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    console.log("캠 상태 변경!!!");
    localUserInit.setVideoActive(!localUserInit.isVideoActive());
    console.log(localUserInit);
    localUserInit
      .getStreamManager()
      .publishVideo(localUserInit.isVideoActive());

    console.log(localUser === localUserInit);
    console.log(typeof localUser);
    setLocalUser(localUserInit);
    sendSignalUserChanged({ isVideoActive: localUserInit.isVideoActive() });
  };

  const micStatusChanged = () => {
    console.log("마이크 상태 변경!!!");
    localUserInit.setAudioActive(!localUserInit.isAudioActive());
    localUserInit
      .getStreamManager()
      .publishAudio(localUserInit.isAudioActive());
    sendSignalUserChanged({ isAudioActive: localUserInit.isAudioActive() });
    setLocalUser(localUserInit);
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
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          let error = Object.assign({}, response);
          if (error.response && error.response.status === 409) {
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
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  return (
    <>
      <div className={styles["video-container"]}>
        {localUserRef.current !== undefined &&
          localUserRef.current.getStreamManager() !== undefined && (
            <StreamComponent
              user={localUserRef.current}
              sessionId={mySessionId}
              camStatusChanged={camStatusChanged}
              micStatusChanged={micStatusChanged}
            />
          )}
        {subscribersRef.current.map((sub, i) => {
          return (
            //양세찬 게임 키워드 props로 같이 보내줘야할듯
            <StreamComponent key={i} user={sub} targetSubscriber={targetSubscriber}/>
            // <UserVideoComponent user={sub} />
          );
        })}
      </div>
      <ReactPlayer 
      url={['https://www.youtube.com/watch?v=7C2z4GqqS5E', 'https://youtu.be/Bf_tncvBZ7Y', 'https://youtu.be/sqgxcCjD04s']}  playing controls
      width = '300px'
      height = '300px'
      />
        {/* url={'https://youtu.be/Z5M8LH9qZtY'}
        width = '200px'
        height = '200px'
        playing = {true}
         /> */}
      {localUser !== undefined && localUser.getStreamManager() !== undefined && (
        <div className={styles["chat-container"]}>
          <Chat user={localUserRef.current} />
        </div>
      )}

    </>
  );
};

export default RoomContents;
