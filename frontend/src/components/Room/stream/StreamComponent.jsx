import React from "react";
import styles from "./StreamComponent.module.css";
import OvVideoComponent from "./OvVideo.jsx";
import YangGameComponent from ".././game/YangGameComponent";

import MicOff from "@material-ui/icons/MicOff";
import Mic from "@material-ui/icons/Mic";
import Videocam from "@material-ui/icons/Videocam";
import VideocamOff from "@material-ui/icons/VideocamOff";
import { useState, useEffect } from "react";
import ToolbarComponent from "../toolbar/ToolbarComponent.jsx";
import { ReactComponent as SirenIcon } from "../../../assets/icons/siren.svg";



function StreamComponent({
  user,
  sessionId,
  camStatusChanged,
  micStatusChanged,
  mode,
  targetSubscriber,
  subscribers,
  openKeywordInputModal,
  nickname,
  correctNickname,
  sirenWingWing,
}) {
  console.log(user);
  const [mutedSound, setMuted] = useState(false);
  const [controlBox, setControl] = useState(false);
  const [bgcolor, setBgcolor] = useState("");
  const [bgothercolor, setBgothercolor] = useState("");
  const [myNickname, setMyNickname] = useState("");
  const [myCorrectNickname, setMyCorrectNickname] = useState("");

  console.log(nickname,"hihi","1");
  console.log(correctNickname,"hihi","2");
    
  const color = [
    "#adeac9",
    "#ff98ad",
    "#abece7",
    "#ffff7f",
    "#FFC0CB",
    "#FFEB46",
    "#EE82EE",
    "#B2FA5C",
    "#a3c9f0",
    "#e3ae64",
    "#a1e884",
    "#84e8c5",
    "#ceb1e3",
    "#e3b1d2",
    "#e3b1b1",
    "#d4ff8f",
    "#98ff8f",
    "#b6f0db",
    "#b6e3f0",
    "#f288e9",
    "#adeac9",
    "#ff98ad",
    "#abece7",
    "#ffff7f",
    "#FFC0CB",
    "#FFEB46",
    "#EE82EE",
    "#B2FA5C",
    "#a3c9f0",
    "#e3ae64",
    "#a1e884",
    "#84e8c5",
    "#ceb1e3",
    "#e3b1d2",
    "#e3b1b1",
    "#d4ff8f",
    "#98ff8f",
    "#b6f0db",
    "#b6e3f0",
    "#f288e9",
  ];

  console.log("stream render");
  const handleChangeControlBox = (e) => {
    setControl(!controlBox);
    e.preventDefault();
  };

  useEffect(() => {
    if(nickname!==""&&nickname!==undefined) {
      console.log(nickname,"nickname");
      console.log(nickname.length,"nicknamelength");
    for (let i = 0; i < nickname.length; i++) {
        if (user.getStreamManager().stream.streamId === nickname[i].connectionId) {
          setMyNickname(nickname[i].keyword);
        }
      }
      if(nickname.length===0){
        setMyNickname("");
      }
    }
  }, [nickname]);

  
  useEffect(() => {
    if(correctNickname!==""&&correctNickname!==undefined) {
      console.log(correctNickname,"correctNickname");
    for (let i = 0; i < correctNickname.length; i++) {
        if (user.getStreamManager().stream.streamId === correctNickname[i].connectionId) {
          setMyCorrectNickname(correctNickname[i].keyword);
        }
      }
    }
  }, [correctNickname]);


  useEffect(() => {
    let bgindex = Math.floor(Math.random() * 39);
    let bgotherindex = Math.floor(Math.random() * 39);
    setBgcolor(color[bgindex]);
    setBgothercolor(color[bgotherindex]);
  }, []);

  const handleSiren = (target) => {
    sirenWingWing(target);
  }
  const handleSubmitKeyword = (nextmode) => {
    openKeywordInputModal(nextmode);
  }


  return (
    <div
      className={
        mode === "snapshot"
          ? `${styles["video-innerContainer"]} ${styles.snapshotMode}`
          : styles["video-innerContainer"]
      }
    >
      <div className={styles.nickname}>
        <span id={styles.nickname}>{user.getNickname()}</span>
      </div>
      {user !== undefined && user.getStreamManager() !== undefined ? (
        <div
          className={styles.streamComponent}
          // onMouseEnter={handleChangeControlBox}
          // onMouseLeave={handleChangeControlBox}
        >
          <OvVideoComponent user={user} mutedSound={mutedSound} />
          {mode === "snapshot" ? null : mode === "game1" ? (
            <>
            <div className={styles.yangGame}>
                {sessionId ? (
                  <div className={styles.postitInput}>
                    <div 
                      className={styles.yangkeyword} 
                      onClick = {()=> {handleSubmitKeyword("answer")}}>당신의 키워드는?
                      </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.answerBorder}>
                      <div
                        className={styles.answerpostit}
                      >
                      정답
                      </div>
                      <div
                        className={styles.postit}
                        style={{ backgroundColor: `${bgcolor}` }}
                      >
                      {myCorrectNickname}
                      </div>
                    </div>
                    <div className={styles.hmmBorder}>
                      <div
                        className={styles.hmmpostit}
                      >
                      시도
                      </div>
                      <div
                        className={styles.inputpostit}
                        style={{ backgroundColor: `${bgothercolor}` }}
                      >
                      {myNickname}
                      </div>
                    </div>
                  </div>
                    )}
              </div>
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
            </>
          ) : mode === "game2" ? (
            <>
                {sessionId ? (
                <div className={styles.forbiddenGame}>
                  <div className={styles.postitInput}>
                    <div 
                      className={styles.keyword} 
                      onClick = {()=> openKeywordInputModal("answerForbidden")}>금지어가 뭘까요?
                      </div>
                  </div>
                  </div>
                ) : (
                  <div>
                  <div className={styles.forbiddenAlertGameBorder}>
                    <div className={styles.forbiddenAlertGame}>
                    <button className={styles.sirenBtn} onClick={()=> {handleSiren(user)}}>
                      <SirenIcon className={styles.sirenIcon}/>
                      </button>
                      <div
                      className={styles.answerpostit}
                      >
                      정답
                      </div>
                    <div
                      className={styles.forbiddenpostit}
                      style={{ backgroundColor: `${bgcolor}` }}
                      >
                      {myCorrectNickname}
                      </div>
                    </div>
                    <div className={styles.hmmBorder}>
                    <div
                      className={styles.hmmpostit}
                    >
                    시도
                    </div>
                      </div>
                      <div
                        className={styles.inputforbiddenpostit}
                        style={{ backgroundColor: `${bgcolor}` }}
                        >
                        {myNickname}
                     </div>
                    </div>
                  </div>
                    )}
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
            </>
          ): (
            <>
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
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
export default StreamComponent;
