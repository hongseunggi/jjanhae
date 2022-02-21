import React, { useEffect, useRef, useState, useCallback } from "react";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player";
import styles from "./MusicPlayer.module.css";

import { ReactComponent as PlayerIcon } from "../../../assets/icons/player.svg";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play.svg";
import { ReactComponent as StopIcon } from "../../../assets/icons/stop.svg";
import { ReactComponent as NextIcon } from "../../../assets/icons/next.svg";
import { ReactComponent as HamburgerIcon } from "../../../assets/icons/hamburger.svg";
import MusicList from "../../Modals/RegistMusic/MusicList";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
let posX = 0;
let posY = 0;

const MusicPlayer = ({ user }) => {
  const [onPlayerClick, setOnPlayerClick] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [music, setMusic] = useState("");
  const [open, setOpen] = useState(false);
  const [openVolumeController, setOpenVolumeController] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const videoIdRef = useRef(videoId);
  videoIdRef.current = videoId;

  const musicListRef = useRef(musicList);
  musicListRef.current = musicList;

  useEffect(() => {
    console.log(musicList);
  }, [musicList]);

  useEffect(() => {
    user.getStreamManager().stream.session.on("signal:music", (event) => {
      const data = event.data;
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
          const musicInfo = data.music.split("^");
          setMusic(`${musicInfo[0]} - ${musicInfo[1]}`);
          setVideoId(musicInfo[2]);
          setPlaying(true);

          const musicInfos = data.musicList.split("|");
          console.log(musicInfos);
          const musicArr = [];
          musicInfos.forEach((value) => {
            musicArr.push(value);
          });
          setMusicList(musicArr);
          break;
        case 4:
          //음악 추가
          const dataInfo = data.musicList.split("|");
          const musicAddArr = [];
          console.log(dataInfo);
          if (dataInfo.length === 1) {
            const musicInfo = dataInfo[0].split("^");
            setMusic(`${musicInfo[0]} - ${musicInfo[1]}`);
            setVideoId(musicInfo[2]);
            setPlaying(true);
          }
          dataInfo.forEach((value) => {
            musicAddArr.push(value);
          });
          setMusicList(musicAddArr);
          break;
        case 5:
          //음악 삭제
          const resultInfo = data.musicList.split("|");
          const musicDeleteAfterArr = [];
          if (resultInfo.length === 1) {
            const musicInfo = resultInfo[0].split("^");
            setMusic(`${musicInfo[0]} - ${musicInfo[1]}`);
            setVideoId(musicInfo[2]);
          }
          resultInfo.forEach((value) => {
            musicDeleteAfterArr.push(value);
          });
          setMusicList(musicDeleteAfterArr);
          break;
        default:
          console.log("err");
      }
    });
  }, []);

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleMusicStart = useCallback(
    (e) => {
      if (videoId) {
        const data = {
          musicStatus: 1,
        };

        user.getStreamManager().stream.session.signal({
          type: "music",
          data: JSON.stringify(data),
        });
        setPlaying(true);
      }
    },
    [videoId]
  );

  const handleMusicStop = useCallback(
    (e) => {
      if (videoId) {
        const data = {
          musicStatus: 2,
        };

        user.getStreamManager().stream.session.signal({
          type: "music",
          data: JSON.stringify(data),
        });
        setPlaying(false);
      }
    },
    [videoId]
  );

  const handlePlayerClick = () => {
    setOnPlayerClick((prev) => !prev);
  };

  const handleMusicListClick = () => {
    if (musicList.length !== 0) {
      setOpen(true);
    }
  };

  const handleMusicListDelete = useCallback((music) => {
    const deleteMusicInfo = music.split("^");
    console.log(deleteMusicInfo);
    const deleteVideoId = deleteMusicInfo[2];
    const singer = deleteMusicInfo[0];
    const song = deleteMusicInfo[1];
    const data = {
      musicStatus: 5,
      videoId: deleteVideoId,
      singer,
      song,
    };

    user.getStreamManager().stream.session.signal({
      type: "music",
      data: JSON.stringify(data),
    });
  }, []);

  const handleEndMusic = () => {
    //music list 들어있나 확인
    if (musicListRef.current.length > 1) {
      const data = {
        musicStatus: 3,
      };

      user.getStreamManager().stream.session.signal({
        type: "music",
        data: JSON.stringify(data),
      });
    }
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

  const handleVolumeControl = () => {
    setOpenVolumeController((prev) => !prev);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue / 100);
  };

  const preventHorizontalKeyboardNavigation = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  };
  return (
    <div>
      <ReactPlayer
        url={`https://www.youtube.com/embed/${videoIdRef.current}`}
        playing={playing}
        onEnded={() => handleEndMusic()}
        width="100px"
        height="100px"
        volume={volume}
        muted={false}
        className={styles.videoPlayer}
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
            playing
              ? `${styles.playerIcon} ${styles.playerStart}`
              : styles.playerIcon
          }
          onClick={handlePlayerClick}
        >
          <PlayerIcon width="30" height="30" fill="#eee" />
        </div>
        {onPlayerClick ? (
          <>
            <Marquee
              play={playing}
              // pauseOnClick={playing}
              direction="right"
              gradient={false}
              className={styles.musicTitle}
            >
              {music ? music : "음악을 추가해주세요."}
            </Marquee>

            <div className={styles.BtnRow}>
              {playing ? (
                <StopIcon
                  width="30"
                  height="30"
                  fill="#eee"
                  onClick={handleMusicStop}
                />
              ) : (
                <PlayIcon
                  width="30"
                  height="30"
                  fill="#eee"
                  onClick={handleMusicStart}
                />
              )}
              <NextIcon
                width="30"
                height="30"
                fill="#eee"
                className={styles.nextIcon}
                onClick={handleEndMusic}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.musicPlayerInitTitle}>Music Player</div>
            <HamburgerIcon
              width="30"
              height="30"
              fill="#eee"
              onClick={handleMusicListClick}
            />
            <VolumeUp sx={{ color: "#eee" }} onClick={handleVolumeControl} />
            <div className={styles.volumeController}>
              {openVolumeController ? (
                <Box sx={{ height: 100 }}>
                  <Slider
                    sx={{
                      '& input[type="range"]': {
                        WebkitAppearance: "slider-vertical",
                      },
                    }}
                    orientation="vertical"
                    // defaultValue={volume}
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    onKeyDown={preventHorizontalKeyboardNavigation}
                  />
                </Box>
              ) : // <Slider
              //   aria-label="Volume"
              //   value={volume * 100}
              //   onChange={handleVolumeChange}
              //   className={styles.volumeController}
              // />
              null}
            </div>
          </>
        )}
      </div>

      {open ? (
        <MusicList
          open={open}
          onClose={handleModalClose}
          onStart={handleMusicStart}
          onStop={handleMusicStop}
          onDelete={handleMusicListDelete}
          musicList={musicList}
          playing={playing}
        />
      ) : null}
    </div>
  );
};

export default MusicPlayer;
