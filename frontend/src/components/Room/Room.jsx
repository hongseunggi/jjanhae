import React from "react";
import styles from "./Room.module.css";
import { ReactComponent as PlayerIcon } from "../../assets/icons/player.svg";
import { ReactComponent as PlayIcon } from "../../assets/icons/play.svg";
import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as GameIcon } from "../../assets/icons/game.svg";
import { ReactComponent as MusicIcon } from "../../assets/icons/music.svg";
import { ReactComponent as SettingIcon } from "../../assets/icons/setting.svg";
import Marquee from "react-fast-marquee";
import LoginStatusContext from "../../contexts/LoginStatusContext";
import RegistMusic from "../Modals/RegistMusic";
import GameList from "../Modals/Game/GameList";
import Setting from "../Modals/Setting/Setting";
// import VideoRoomComponent from "./VideoRoomComponent";
import Room2 from "./Room2";
import { useEffect } from "react";
import { useState } from "react";

let posX = 0;
let posY = 0;

const Room = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.contents}>
          <div className={styles.title}>
            <h1>방 제목</h1>
          </div>
          <div className={styles.videos}>
            {/* <VideoRoomComponent /> */}
            <Room2 />
            {/* <video />
            <video />
            <video />
            <video />
            <video />
            <video /> */}
          </div>
          <div className={styles.player}>
            <div className={styles.playerIcon}>
              <PlayerIcon width="30" height="30" />
            </div>
            <Marquee
              play={true}
              pauseOnClick={true}
              direction="right"
              gradient={false}
              className={styles.musicTitle}
            >
              되돌리다 - 이승기
            </Marquee>

            <div>
              <PlayIcon width="30" height="30" />
            </div>
          </div>
        </div>
        <div className={styles.chatting}></div>
      </div>
      <div className={styles.dockBar}>
        <div className={styles.dock}>
          <CameraIcon width="50" height="50" />
          <GameIcon width="50" height="50" />
          <MusicIcon width="50" height="50" />
          <SettingIcon width="50" height="50" />
        </div>
      </div>
    </div>
  );
};

export default Room;
