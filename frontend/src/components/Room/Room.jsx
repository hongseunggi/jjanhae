import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Room.module.css";

import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as GameIcon } from "../../assets/icons/game.svg";
import { ReactComponent as MusicIcon } from "../../assets/icons/music.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import Marquee from "react-fast-marquee";

import LoginStatusContext from "../../contexts/LoginStatusContext";
import NameContext from "../../contexts/NameContext";
import VideoMicContext from "../../contexts/VideoMicContext";
import RegistMusic from "../Modals/RegistMusic/RegistMusic";
import GameList from "../Modals/Game/GameList";
import { useParams } from "react-router-dom";
import RoomContents from "./RoomContents";
import Youtube from "../../api/Youtube";

const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);

const Room = () => {
  const { setLoginStatus } = useContext(LoginStatusContext);
  const { myVMstate } = useContext(VideoMicContext);
  const { myName } = useContext(NameContext);

  const [mode, setMode] = useState("basic");
  const [contentTitle, setContentTitle] = useState("");
  // const [onCamera, setOnCamera] = useState(false);
  const [onGameList, setOnGameList] = useState(false);
  const [onRegistMusic, setOnRegistMusic] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [music, setMusic] = useState("");

  const { title, roomseq } = useParams();

  const musicListRef = useRef(musicList);
  musicListRef.current = musicList;

  const musicRef = useRef(music);
  musicRef.current = music;

  useEffect(() => {
    console.log("room render");
    setContentTitle(title);
    return () => setLoginStatus("2");
  }, []);

  const handleHomeClick = () => {
    setContentTitle(title);
    setMode("basic");
  };
  const handleCameraClick = () => {
    setContentTitle("인생네컷");
    setMode("snapshot");
  };

  const handleModalClose = () => {
    setOnGameList(false);
    setOnRegistMusic(false);
  };

  const handleGameList = () => {
    setOnGameList(true);
  };

  const handleRegistMusic = () => {
    setOnRegistMusic(true);
  };

  // const handleFirstMusicRegist = (session) => {
  //   const data = {
  //     musicStatus: 4,
  //     videoId: music,
  //   };
  //   session.signal({
  //     type: "music",
  //     data,
  //   });
  // };
  const handleMusicSearch = useCallback(
    (query) => {
      console.log(query);
      youtube.search(query).then((videos) => {
        console.log(videos);
        const videoId = videos[0].id.videoId;
        const url = `https://www.youtube.com/embed/${videoId}`;
        console.log(url);
        setMusic(url);
      });
    },
    [youtube]
  );

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.contents}>
          <div className={styles.title}>
            <h1>{contentTitle}</h1>
          </div>
          <div className={styles["main-contents"]}>
            <RoomContents
              sessionName={roomseq}
              userName={myName}
              media={myVMstate}
              mode={mode}
              musicList={musicListRef.current}
              music={musicRef.current}
            />
          </div>
        </div>
      </div>
      <div className={styles.dockBar}>
        <div className={styles.dock}>
          <HomeIcon
            width="50"
            height="50"
            className={styles.icon}
            onClick={handleHomeClick}
          />
          <CameraIcon
            width="50"
            height="50"
            className={styles.icon}
            onClick={handleCameraClick}
          />
          <GameIcon
            width="50"
            height="50"
            fill="#eee"
            className={styles.icon}
            onClick={handleGameList}
          />
          <MusicIcon
            width="50"
            height="50"
            onClick={handleRegistMusic}
            className={styles.icon}
          />
        </div>
      </div>

      {/* 카메라 기능 */}
      {/* <CameraIcon onClick={handleCameraClick} /> */}
      <GameList
        open={onGameList}
        onClose={handleModalClose}
        // onChange={handleModeChange}
      />
      <RegistMusic
        open={onRegistMusic}
        onClose={handleModalClose}
        onSubmit={handleMusicSearch}
        // onChange={handleModeChange}
      />
    </div>
  );
};

export default Room;
