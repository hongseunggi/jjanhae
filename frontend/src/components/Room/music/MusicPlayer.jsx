import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player";
import styles from "./MusicPlayer.module.css";

import { ReactComponent as PlayerIcon } from "../../../assets/icons/player.svg";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play.svg";
import { ReactComponent as StopIcon } from "../../../assets/icons/stop.svg";

let posX = 0;
let posY = 0;

const MusicPlayer = ({ music, user }) => {
  const [onPlayerClick, setOnPlayerClick] = useState(false);
  const [isPlayMusic, setIsPlayMusic] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    user.getStreamManager().stream.session.on("signal:music", (event) => {
      const data = event.data;
      // const data = JSON.parse(event.data);
      console.log(data);
      switch (data.musicStatus) {
        case 1:
          //음악재생
          setPlaying(true);
          break;
        case 2:
          //음악정지
          setPlaying(false);
          break;
        case 3:
          //다음 곡
          break;
        case 4:
          //음악 처음 추가
          break;
        case 5:
          //음악 추가
          break;
        case 6:
          //음악 삭제
          break;
        default:
          console.log("err");
      }
    });
  });

  const handleMusicPlayer = () => {
    // setIsPlayMusic((prev) => !prev);
  };

  const handleMusicStart = () => {
    const data = {
      musicStatus: 1,
    };

    user.getStreamManager().stream.session.signal({
      type: "music",
      data: JSON.stringify(data),
    });
    setPlaying(true);
  };

  const handleMusicStop = () => {
    const data = {
      musicStatus: 2,
    };

    user.getStreamManager().stream.session.signal({
      type: "music",
      data: JSON.stringify(data),
    });
    setPlaying(false);
  };

  const handlePlayerClick = () => {
    setOnPlayerClick((prev) => !prev);
  };

  const handleEndMusic = () => {
    //music list 들어있나 확인
    const data = {
      musicStatus: 3,
    };

    user.getStreamManager().stream.session.signal({
      type: "music",
      data,
    });
  };
  const dragStartHandler = (e) => {
    posX = e.clientX;
    posY = e.clientY;
  };

  const dragHandler = (e) => {
    e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
    e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;
    posX = e.clientX;
    posY = e.clientY;
  };

  const dragEndHandler = (e) => {
    e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
    e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;
  };
  return (
    <div>
      <ReactPlayer
        url={music}
        playing={playing}
        controls
        onEnded={() => handleEndMusic()}
        width="300px"
        height="300px"
      />
      <div
        className={styles.player}
        draggable
        onDragStart={dragStartHandler}
        onDrag={dragHandler}
        onDragEnd={dragEndHandler}
      >
        <div
          className={
            isPlayMusic
              ? `${styles.playerIcon} ${styles.playerStart}`
              : styles.playerIcon
          }
          onClick={handlePlayerClick}
        >
          <PlayerIcon width="30" height="30" />
        </div>
        {onPlayerClick ? (
          <>
            <Marquee
              play={isPlayMusic}
              pauseOnClick={isPlayMusic}
              direction="right"
              gradient={false}
              className={styles.musicTitle}
            >
              되돌리다 - 이승기
            </Marquee>

            <div>
              {playing ? (
                <StopIcon width="30" height="30" onClick={handleMusicStop} />
              ) : (
                <PlayIcon width="30" height="30" onClick={handleMusicStart} />
              )}
            </div>
          </>
        ) : (
          <div>Music Player</div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
