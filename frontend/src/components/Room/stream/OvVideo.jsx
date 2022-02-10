// import { useRef } from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./OvVideo.module.css";
function OvVideo({ user, mutedSound }) {
  const videoRef = useRef();

  useEffect(() => {
    if (user.streamManager && !!videoRef) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
  }, []);

  return (
    <video
      autoPlay={true}
      ref={videoRef}
      muted={mutedSound}
      className={styles.video}
    />
  );
}

export default OvVideo;
