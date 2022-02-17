// import { useRef } from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./OvVideo.module.css";
function OvVideo({ user, mutedSound }) {
  const videoRef = useRef();
  // console.log("video render");
  
  // console.log(user);
  useEffect(() => {
    console.log("PROPS: ", user.streamManager);
    console.log("PROPS: ", user);
    if (user.streamManager && !!videoRef) {
      console.log("PROPS: ", user.streamManager);
      console.log("PROPS: ", user);
      console.log(videoRef.current);
      user.getStreamManager().addVideoElement(videoRef.current);
    }

    if (user && user.streamManager.session && !!videoRef) {
      user.streamManager.session.on("signal:userChanged", (event) => {
        const data = JSON.parse(event.data);
        if (data.isScreenShareActive !== undefined) {
          user.getStreamManager().addVideoElement(videoRef.current);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (user && !!videoRef) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
  }, [user]);

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
