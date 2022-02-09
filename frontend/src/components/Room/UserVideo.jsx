import React, { useEffect, useRef } from "react";
import { useState } from "react";
import axios1 from "../../api/WebRtcApi";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import styles from "./UserVideo.module.css";
import UserModel from "../models/user-model";
import { useCallback } from "react";

const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "jjanhae";

let localUserInit = new UserModel();
let OV = undefined;

let localUserAccessAllowed = false;
let publisher = undefined;
let remotes = [];

const UserVideo = (props) => {
  const [mySessionId, setMySessionId] = useState(props.sessionName);
  const [myUserName, setMyUserName] = useState(props.user);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;

  const sessionRef = useRef(session);
  sessionRef.current = session;

  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

  const joinSession = useCallback(() => {
    OV = new OpenVidu();
    setSession(OV.initSession());
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();

    console.log("1. join session");

    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
    if (sessionRef.current) {
      console.log(`session:`);
      console.log(sessionRef.current);
      subscribeToStreamCreated();
      connectToSession();
    }
  }, [session]);

  const leaveSession = useCallback(() => {
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
    setLocalUser(undefined);

    // if (leaveSession) {
    //   leaveSession();
    // }
  }, [session]);

  const subscribeToStreamCreated = () => {
    console.log(`2. subscribeToStreamCreated : `);
    sessionRef.current.on("streamCreated", (event) => {
      console.log("subscribeToStreamCreated");
      const subscriber = sessionRef.current.subscribe(event.stream, undefined);
      // subscriber.on("streamPlaying", (e) => {
      //   subscriber.videos[0].video.parentElement.classList.remove(
      //     "custom-class"
      //   );
      // });
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType("remote");
      console.log(event.stream.connection.data);
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      remotes.push(newUser);
      console.log(remotes);
      if (localUserAccessAllowed) {
        updateSubscribers();
      }
    });
  };

  const connectToSession = () => {
    if (props.token !== undefined) {
      console.log("token received: ", props.token);
      connect(props.token);
    } else {
      getToken()
        .then((token) => {
          console.log(token);
          connect(token);
        })
        .catch((error) => {
          if (props.error) {
            props.error({
              error: error.error,
              messgae: error.message,
              code: error.code,
              status: error.status,
            });
          }
          console.log(
            "There was an error getting the token:",
            error.code,
            error.message
          );
          alert("There was an error getting the token:", error.message);
        });
    }
  };

  const connect = (token) => {
    sessionRef.current
      .connect(token, { clientData: myUserName })
      .then(() => {
        connectWebCam();
      })
      .catch((error) => {
        if (props.error) {
          props.error({
            error: error.error,
            messgae: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error connecting to the session:", error.message);
        console.log(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  };

  const connectWebCam = async () => {
    console.log(OV);
    const devices = await OV.getDevices();
    console.log(devices);
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    publisher = OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: localUserInit.isAudioActive(),
      publishVideo: localUserInit.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    if (sessionRef.current.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        sessionRef.current.publish(publisher).then(() => {
          ////////////////////////////////////////////////
          updateSubscribers();
          localUserAccessAllowed = true;
          if (props.joinSession) {
            console.log("들어오긴 함?");
            props.joinSession();
          }
        });
      });
    }
    localUserInit.setNickname(myUserName);
    localUserInit.setConnectionId(sessionRef.current.connection.connectionId);
    localUserInit.setStreamManager(publisher);
    console.log(localUserInit);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    setCurrentVideoDevice(videoDevices[0]);
    setLocalUser(localUserInit);
  };

  const updateSubscribers = () => {
    console.log("update subscribers");
    console.log(remotes);
    setSubscribers(remotes);
  };

  useEffect(() => {
    if (localUser) {
      // console.log(subscribersRef.current);
      sendSignalUserChanged({
        isAudioActive: localUser.isAudioActive(),
        isVideoActive: localUser.isVideoActive(),
        nickname: localUser.getNickname(),
      });
    }
  }, [subscribers]);

  useEffect(() => {
    if (localUser && currentVideoDevice) {
      localUser.getStreamManager().on("streamPlaying", (e) => {
        // updateLayout();
        publisher.videos[0].video.parentElement.classList.remove(
          "custom-class"
        );
      });
    }
  }, [currentVideoDevice, localUser]);

  const deleteSubscriber = (stream) => {
    const remoteUsers = subscribersRef.current;
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      setSubscribers(remoteUsers);
    }
    console.log("deleteSubscriber");
  };

  const subscribeToStreamDestroyed = () => {
    sessionRef.current.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream);
      event.preventDefault();
    });
    console.log("streamDestroyed");
  };

  const subscribeToUserChanged = () => {
    sessionRef.current.on("signal:userChanged", (event) => {
      let remoteUsers = subscribersRef.current;
      // let remoteUsers = subscribers;
      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENTO REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
        }
      });
      setSubscribers(remoteUsers);
    });
  };

  const onbeforeunload = (e) => {
    leaveSession();
  };

  // const updateLayout = () => {
  //   setTimeout(() => {
  //     layout.updateLayout();
  //   }, 20);
  // };

  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    sessionRef.current.signal(signalOptions);
  };

  const camStatusChanged = () => {
    localUserInit.setVideoActive(!localUserInit.isVideoActive());
    localUserInit
      .getStreamManager()
      .publishVideo(localUserInit.isVideoActive());
    sendSignalUserChanged({ isVideoActive: localUserInit.isVideoActive() });
    setLocalUser(localUserInit);
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
    <div className={styles.container} id="container">
      <div id="layout" className="bounds">
        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div
            className="OT_root OT_publisher custom-class"
            id="localUser"
            style={{ width: "250px", height: "250px" }}
          >
            <StreamComponent
              user={localUser}
              sessionId={mySessionId}
              camStatusChanged={camStatusChanged}
              micStatusChanged={micStatusChanged}
              // showNotification={messageReceived}
              // leaveSession={leaveSession}
              // toggleChat={toggleChat}
            />
          </div>
        )}
        {subscribersRef.current.map((sub, i) => {
          console.log(sub);
          return (
            <div
              key={i}
              className="OT_root OT_publisher custom-class"
              id="remoteUsers"
              style={{ width: "250px", height: "250px" }}
            >
              <StreamComponent
                user={sub}
                streamId={sub.streamManager.stream.streamId}
              />
            </div>
          );
        })}
        {/* {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div
            className="OT_root OT_publisher custom-class"
            style={chatDisplay}
          >
            <ChatComponent
              user={localUser}
              chatDisplay={chatDisplay}
              close={toggleChat}
              messageReceived={checkNotification}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserVideo;
