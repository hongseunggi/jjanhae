import React, { useEffect, useRef } from "react";
import { useState } from "react";
import axios1 from "../../api/WebRtcApi";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import styles from "./UserVideo.module.css";
import UserModel from "../models/user-model";
import UserVideoComponent from "./UserVideoComponent";

const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";

let localUserInit = new UserModel();
let OV = undefined;

const UserVideo2 = (props) => {
  const [mySessionId, setMySessionId] = useState(props.sessionName);
  const [myUserName, setMyUserName] = useState(props.user);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(undefined);

  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const publisherRef = useRef(publisher);
  publisherRef.current = publisher;

  const localUserRef = useRef(localUser);
  localUserRef.current = localUser;

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
      sessionRef.current.on("streamCreated", (event) => {
        let subscriber = sessionRef.current.subscribe(event.stream, undefined);
        setSubscribers([...subscribersRef.current, subscriber]);
      });

      sessionRef.current.on("streamDestroyed", (event) => {
        deleteSubscriber(event.stream.streamManager);
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
              // props로 받아서 처리
              publishAudio: localUserInit.isAudioActive(),
              publishVideo: localUserInit.isVideoActive(),
              resolution: "640x480",
              frameRate: 30,
              insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
              mirror: false,
            });

            // --- 6) Publish your stream ---

            sessionRef.current.publish(publisherTemp);

            localUserInit.setNickname(myUserName);
            localUserInit.setConnectionId(
              sessionRef.current.connection.connectionId
            );
            localUserInit.setStreamManager(publisherTemp);
            console.log(localUserInit);
            // console.log({ ...localUserInit });

            // Set the main video in the page to display our webcam and store our Publisher
            // setCurrentVideoDevice(videoDevices[0]);
            // setMainStreamManager(publisherTemp);
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

  useEffect(() => {
    console.log("local :");
    console.log(localUser);
  }, [localUser]);

  useEffect(() => {
    console.log("sub :");
    console.log(subscribers);
  }, [subscribers]);

  useEffect(() => {
    console.log(publisher);
  }, [publisher]);

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
    // setMainStreamManager(undefined);
    setPublisher(undefined);
    setLocalUser(undefined);
  };

  const deleteSubscriber = (streamManager) => {
    // let subscribersTemp = subscribersRef.current;
    let index = subscribersRef.current.indexOf(streamManager, 0);

    if (index > -1) {
      subscribersRef.current.splice(index, 1);
      setSubscribers([...subscribersRef.current]);
    }
  };

  const onbeforeunload = (e) => {
    leaveSession();
  };

  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    console.log("cam status");
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
    <div>
      {/* <div id="session"> */}
      {/* <div id="session-header"></div> */}

      <div id="video-container" className="col-md-6">
        {/* {publisherRef.current !== undefined ? ( */}
        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div className="stream-container col-md-6 col-xs-6">
            {/* <StreamComponent
              user={localUserRef.current}
              sessionId={mySessionId}
              camStatusChanged={camStatusChanged}
              micStatusChanged={micStatusChanged}
            /> */}
            <UserVideoComponent streamManager={publisherRef.current} />
          </div>
        )}
        {/* // ) : null} */}
        {subscribersRef.current.map((sub, i) => {
          // {subscribers.map((sub, i) => {
          console.log(sub);
          return (
            <div key={i} className="stream-container col-md-6 col-xs-6">
              {/* <StreamComponent user={sub} streamId={sub.stream.streamId} /> */}
              <UserVideoComponent streamManager={sub} />
            </div>
          );
        })}
      </div>
    </div>
    // </div>
  );
};

export default UserVideo2;
