import React, { useEffect, useRef } from "react";
import { useState } from "react";
import axios1 from "../../api/WebRtcApi";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";

import UserModel from "../models/user-model";
// import OpenViduLayout from "../../layout/openvidu-layout";
import ChatComponent from "./chat/ChatComponent";
import ToolbarComponent from "./toolbar/ToolbarComponent";

let localUserInit = new UserModel();
let OV = undefined;

const UserVideo = (props) => {
  const OPENVIDU_SERVER_URL = "https://i6a507.p.ssafy.io:5443";
  const OPENVIDU_SERVER_SECRET = "jjanhae";

  let remotes = [];
  let localUserAccessAllowed = false;
  let publisher = undefined;

  const [mySessionId, setMySessionId] = useState(props.sessionName);
  const [myUserName, setMyUserName] = useState(
    `OpenVidu_User ${Math.floor(Math.random() * 100)}`
  );
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  const subscribersRef = useRef(subscribers);
  subscribersRef.current = subscribers;

  const [chatDisplay, setChatDisplay] = useState("none");
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);

  const [messageReceived, setMessageReceived] = useState(false);
  // const [hasBeenUpdated, setHasBeenUpdated] = useState(false);

  // const layout = new OpenViduLayout();

  const joinSession = () => {
    OV = new OpenVidu();
    console.log("join session start");
    setSession(OV.initSession());
  };

  useEffect(() => {
    joinSession();
    console.log("1. join session");
    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
    if (session) {
      console.log(`session:`);
      console.log(session);
      subscribeToStreamCreated();
      connectToSession();
    }
  }, [session]);

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }
    OV = null;
    setSession(undefined);
    // setSubscribers([]);
    setMySessionId(undefined);
    setMyUserName(undefined);
    setLocalUser(undefined);

    // if (leaveSession) {
    //   leaveSession();
    // }
  };

  const subscribeToStreamCreated = () => {
    console.log(`2. subscribeToStreamCreated : `);
    session.on("streamCreated", (event) => {
      console.log("subscribeToStreamCreated");
      const subscriber = session.subscribe(event.stream, undefined);
      subscriber.on("streamPlaying", (e) => {
        subscriber.videos[0].video.parentElement.classList.remove(
          "custom-class"
        );
      });
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType("remote");
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      remotes.push(newUser);
      console.log(localUserAccessAllowed);
      if (localUserAccessAllowed) {
        updateSubscribers();
      }
    });
    console.log(remotes);
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
    session
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
    var devices = await OV.getDevices();
    var videoDevices = devices.filter((device) => device.kind === "videoinput");

    publisher = OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: localUserInit.isAudioActive(),
      publishVideo: localUserInit.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    if (session.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        session.publish(publisher).then(() => {
          updateSubscribers();
          localUserAccessAllowed = true;
          if (props.joinSession) {
            props.joinSession();
          }
        });
      });
    }
    localUserInit.setNickname(myUserName);
    localUserInit.setConnectionId(session.connection.connectionId);
    localUserInit.setStreamManager(publisher);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    sendSignalUserChanged({
      isScreenShareActive: localUserInit.isScreenShareActive(),
    });

    setCurrentVideoDevice(videoDevices[0]);
    setLocalUser(localUserInit);
  };

  const updateSubscribers = () => {
    let subscribers2 = remotes;
    setSubscribers(subscribers2);
  };

  useEffect(() => {
    if (localUser) {
      console.log(subscribersRef.current);
      sendSignalUserChanged({
        isAudioActive: localUser.isAudioActive(),
        isVideoActive: localUser.isVideoActive(),
        nickname: localUser.getNickname(),
        isScreenShareActive: localUser.isScreenShareActive(),
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
  };

  const subscribeToStreamDestroyed = () => {
    session.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream);
      event.preventDefault();
      // updateLayout();
    });
  };

  const subscribeToUserChanged = () => {
    session.on("signal:userChanged", (event) => {
      console.log(subscribersRef.current);
      let remoteUsers = subscribersRef.current;
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
    session.signal(signalOptions);
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

  const toggleChat = (property) => {
    let display = property;

    if (display === undefined) {
      display = chatDisplay === "none" ? "block" : "none";
    }
    if (display === "block") {
      setChatDisplay(display);
      setMessageReceived(false);
    } else {
      console.log("chat", display);
      setChatDisplay(display);
    }
    // updateLayout();
  };

  const checkNotification = (event) => {
    if (chatDisplay === "none") {
      setMessageReceived(true);
    } else {
      setMessageReceived(false);
    }
  };

  // const checkSize = () => {
  //   if (
  //     document.getElementById("layout").offsetWidth <= 700 &&
  //     !hasBeenUpdated
  //   ) {
  //     toggleChat("none");
  //     setHasBeenUpdated(true);
  //   }
  //   if (document.getElementById("layout").offsetWidth > 700 && hasBeenUpdated) {
  //     setHasBeenUpdated(false);
  //   }
  // };

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
    <div className="container" id="container">
      <ToolbarComponent
        sessionId={mySessionId}
        user={localUser}
        showNotification={messageReceived}
        camStatusChanged={camStatusChanged}
        micStatusChanged={micStatusChanged}
        // toggleFullscreen={toggleFullscreen}
        leaveSession={leaveSession}
        toggleChat={toggleChat}
      />

      <div id="layout" className="bounds">
        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div
            className="OT_root OT_publisher custom-class"
            id="localUser"
            style={{ width: "250px", height: "250px" }}
          >
            <StreamComponent user={localUser} />
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
