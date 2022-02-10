import React from "react";
import styles from "./StreamComponent.module.css";
import OvVideoComponent from "./OvVideo.jsx";

import MicOff from "@material-ui/icons/MicOff";
import Mic from "@material-ui/icons/Mic";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import { useState } from "react";
import ToolbarComponent from "../toolbar/ToolbarComponent.jsx";

function StreamComponent({
  user,
  sessionId,
  camStatusChanged,
  micStatusChanged,
}) {
  const [mutedSound, setMuted] = useState(false);
  const [controlBox, setControl] = useState(false);

  const handleChangeControlBox = (e) => {
    setControl(!controlBox);
    e.preventDefault();
  };

  return (
    <div className={styles["video-innerContainer"]}>
      <div className={styles.nickname}>
        <span id={styles.nickname}>{user.getNickname()}</span>
      </div>
      {user !== undefined && user.getStreamManager() !== undefined ? (
        <div
          className={styles.streamComponent}
          onMouseEnter={handleChangeControlBox}
          onMouseLeave={handleChangeControlBox}
        >
          <OvVideoComponent user={user} mutedSound={mutedSound} />

          <div className={styles.controlbox}>
            {sessionId ? (
              <ToolbarComponent
                sessionId={sessionId}
                user={user}
                camStatusChanged={camStatusChanged}
                micStatusChanged={micStatusChanged}
              ></ToolbarComponent>
            ) : null}
          </div>

          <div id={styles.statusIcons}>
            {sessionId ? null : !user.isVideoActive() ? (
              <div id={styles.camIcon}>
                <VideocamOff id={styles.statusCam} color="secondary" />
              </div>
            ) : null}

            {sessionId ? null : !user.isAudioActive() ? (
              <div id={styles.micIcon}>
                <MicOff id={styles.statusMic} color="secondary" />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default StreamComponent;
