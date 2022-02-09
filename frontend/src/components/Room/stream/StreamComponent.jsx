import React, { Component } from "react";
import "./StreamComponent.css";
import OvVideoComponent from "./OvVideo.jsx";

import MicOff from "@material-ui/icons/MicOff";
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
  sessionId,
  camStatusChanged,
  micStatusChanged,
}) {
  const [nickname, setNickname] = useState(user.getNickname());
  const [showForm, setShowForm] = useState(false);
  const [mutedSound, setMuted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [controlBox, setControl] = useState(false);
  const handleChange = (e) => {
    setNickname(e.target.value);
    e.preventDefault();
  };

  const handleChangeControlBox = (e) => {
    setControl(!controlBox);
    e.preventDefault();
  };

  const toggleNicknameForm = () => {
    if (user.isLocal()) {
      setShowForm(!showForm);
    }
  };

  const toggleSound = () => {
    setMuted(!mutedSound);
  };

  const handlePressKey = (e) => {
    if (e.key === "Enter") {
      console.log(nickname);
      if (nickname.length >= 3 && nickname.length <= 20) {
        // handleNickNname(nickname);
        toggleNicknameForm();
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
  };

  return (
    <div className="OT_widget-container" style={{}}>
      <div className="pointer nickname">
        {showForm ? (
          <FormControl id="nicknameForm">
            <IconButton
              color="inherit"
              id="closeButton"
              onClick={toggleNicknameForm}
            >
              <HighlightOff />
            </IconButton>
            <InputLabel htmlFor="name-simple" id="label">
              Nickname
            </InputLabel>
            <Input
              color="inherit"
              id="input"
              value={nickname}
              onChange={handleChange}
              onKeyPress={handlePressKey}
              required
            />
            {!isFormValid && nickname.length <= 3 && (
              <FormHelperText id="name-error-text">
                Nickname is too short!
              </FormHelperText>
            )}
            {!isFormValid && nickname.length >= 20 && (
              <FormHelperText id="name-error-text">
                Nickname is too long!
              </FormHelperText>
            )}
          </FormControl>
        ) : (
          <div onClick={toggleNicknameForm}>
            <span id="nickname">{user.getNickname()}</span>
            {user.isLocal() && <span id=""> (edit)</span>}
          </div>
        )}
      </div>

      {user !== undefined && user.getStreamManager() !== undefined ? (
        <div
          className="streamComponent"
          onMouseEnter={handleChangeControlBox}
          onMouseLeave={handleChangeControlBox}
        >
          <OvVideoComponent user={user} mutedSound={mutedSound} />
          <ToolbarComponent
            className="controlbox"
            sessionId={sessionId}
            user={user}
            camStatusChanged={camStatusChanged}
            micStatusChanged={micStatusChanged}
          ></ToolbarComponent>
          )
          {/* <div id="statusIcons">
            {!user.isVideoActive() ? (
                <div id="camIcon">
                <VideocamOff id="statusCam" />
                </div>
            ) : null}

            {!user.isAudioActive() ? (
                <div id="micIcon">
                <MicOff id="statusMic" />
                </div>
            ) : null}
            </div> */}
          {/* <div>
            {/* {!user.isLocal() && (
                <IconButton id="volumeButton" onClick={toggleSound}>
                {mutedSound ? (
                    <VolumeOff color="secondary" />
                ) : (
                    <VolumeUp />
                )}
                </IconButton>
            )} }
            </div> */}
        </div>
      ) : null}
    </div>
  );
}
export default StreamComponent;
