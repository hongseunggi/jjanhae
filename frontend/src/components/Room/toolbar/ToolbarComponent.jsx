import styles from "./ToolbarComponent.module.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Mic from "@material-ui/icons/Mic";
import MicOff from "@material-ui/icons/MicOff";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import Tooltip from "@material-ui/core/Tooltip";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import QuestionAnswer from "@material-ui/icons/QuestionAnswer";

import IconButton from "@material-ui/core/IconButton";

import logo from "../../../assets/logo.png";
import { useState } from "react";

function ToolbarComponent({
  sessionId,
  user,
  camStatusChanged,
  micStatusChanged,
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const mySessionId = sessionId;
  const localUser = user;
//   console.log(localUser.isAudioActive());

  // const activeFullscreen = () => {
  //     setFullscreen(!fullscreen);
  //     toggleFullscreen();
  // }

  return (
    <div className={styles.toolbar}>
      <div className={styles.buttonClass}>
        <button className={styles.buttons} onClick={micStatusChanged}>
          {localUser !== undefined && localUser.isAudioActive() ? (
            <Mic
              style={{
                marginTop: "5px",
              }}
            />
          ) : (
            <MicOff
              style={{
                marginTop: "5px",
              }}
              color="secondary"
            />
          )}
        </button>

        <button className={styles.buttons} onClick={camStatusChanged}>
          {localUser !== undefined && localUser.isVideoActive() ? (
            <Videocam />
          ) : (
            <VideocamOff color="secondary" />
          )}
        </button>

        {/* <IconButton
            color="inherit"
            className="navButton"
            onClick={activeFullscreen}
        >
            {localUser !== undefined && fullscreen ? (
            <FullscreenExit />
            ) : (
            <Fullscreen />
            )}
        </IconButton>
        <IconButton
            color="secondary"
            className="navButton"
            onClick={leaveSession}
            id="navLeaveButton"
        >
            <PowerSettingsNew />
        </IconButton> */}
        {/* <IconButton
            color="inherit"
            onClick={toggleChat}
            id="navChatButton"
        >
            {showNotification && <div id="point" className="" />}
            <Tooltip title="Chat">
            <QuestionAnswer />
            </Tooltip>
        </IconButton> */}
      </div>
    </div>
  );
}

export default ToolbarComponent;
