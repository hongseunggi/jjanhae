import React, { Component } from "react";
import styles from "./StreamComponent.module.css";
import OvVideoComponent from "./OvVideo.jsx";

import MicOff from "@material-ui/icons/MicOff";
import Mic from "@material-ui/icons/Mic";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import HighlightOff from "@material-ui/icons/HighlightOff";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useState } from "react";
import { set } from "react-hook-form";
import ToolbarComponent from "../toolbar/ToolbarComponent.jsx";

function StreamComponent({
  user,
  handleNickNname,
  sessionId,
  camStatusChanged,
  micStatusChanged,
}) {
  console.log(user);
  // const [nickname, setNickname] = useState(user.getNickname());
  const [showForm, setShowForm] = useState(false);
  const [mutedSound, setMuted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [controlBox, setControl] = useState(false);
  // const handleChange = (e) => {
  //   setNickname(e.target.value);
  //   e.preventDefault();
  // };

  const handleChangeControlBox = (e) => {
    setControl(!controlBox);
    e.preventDefault();
  };

  // const toggleNicknameForm = () => {
  //   if (user.isLocal()) {
  //     setShowForm(!showForm);
  //   }
  // };

  // const toggleSound = () => {
  //   setMuted(!mutedSound);
  // };

  // const handlePressKey = (e) => {
  //   if (e.key === "Enter") {
  //     console.log(nickname);
  //     if (nickname.length >= 3 && nickname.length <= 20) {
  //       handleNickNname(nickname);
  //       toggleNicknameForm();
  //       setIsFormValid(true);
  //     } else {
  //       setIsFormValid(false);
  //     }
  //   }
  // };

  return (
    <div className={styles["OT_widget-container"]}>
      <div className={`${styles.nickname}`}>
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
