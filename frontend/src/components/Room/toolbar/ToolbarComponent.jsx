import styles from "./ToolbarComponent.module.css";

import Mic from "@material-ui/icons/Mic";
import MicOff from "@material-ui/icons/MicOff";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";

function ToolbarComponent({ user, camStatusChanged, micStatusChanged }) {
  const localUser = user;
  console.log("tool render");
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
      </div>
    </div>
  );
}

export default ToolbarComponent;
