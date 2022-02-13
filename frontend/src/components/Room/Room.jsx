import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Room.module.css";
import LoadingSpinner from "../Modals/LoadingSpinner/LoadingSpinner";
import RoomApi from "../../api/RoomApi";

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
import { useNavigate, useParams } from "react-router-dom";
import RoomContents from "./RoomContents";
import Youtube from "../../api/Youtube";
import SessionIdContext from "../../contexts/SessionIdContext";
import BangZzangContext from "../../contexts/BangZzangContext";

const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);

const Room = () => {
  const { sessionId } = useContext(SessionIdContext);
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
  
  const {setbangZzang} = useContext(BangZzangContext);

  const { title, roomseq } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getRoomExitResult } = RoomApi;

  const musicListRef = useRef(musicList);
  musicListRef.current = musicList;

  const musicRef = useRef(music);
  musicRef.current = music;

  useEffect(() => {
    console.log("room render");
    setContentTitle(title);
    return () => setLoginStatus("2");
  }, []);

  useEffect(() => {
    if(sessionId!==""&&sessionId!==undefined) {
      console.log(sessionId);
      sessionId.on("signal:game", (event) => {
        const data = event.data;
        console.log(data);
        console.log(data.gameId);
        if(data.gameId===1) setContentTitle("양세찬 게임");
        setbangZzang(data.streamId);
        setMode("game1");
      });
    }
  }, [sessionId]);

  useEffect(()=> {
    console.log(mode);
  },[mode])

  const onClickExit = async () => {
    const body = {
      roomSeq: roomseq * 1,
    };
    setLoading(true);
    await getRoomExitResult(body);
    setTimeout(() => {
      setLoading(false);
      navigate("/conferences/list");
    }, 1500);
  };

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

  const handleMusicSearch = (query) => {
    console.log(query);
    youtube.search(query).then((videos) => {
      console.log(videos);
      const videoId = videos[0].id.videoId;
      const url = `https://www.youtube.com/embed/${videoId}`;
      const data = {
        musicStatus: 4,
        videoId: url,
      };
      console.log(sessionId);
      sessionId.signal({
        type: "music",
        data: JSON.stringify(data),
      });
      // setMusic(url);
    });
  };

  const changeMode = () => {
    console.log("game1 change");
    const data={
      gameStatus : 0,
      gameId : 1,
    }
    sessionId.signal({
      type : "game",
      data : JSON.stringify(data), 
    });
  };

  const changeMain = () => {
    setMode("basic");
  };

  return (
    <div className={styles.container}>
      {loading ? <LoadingSpinner></LoadingSpinner> : null}
      <div className={styles.nav}>
        <button className={styles.link} onClick={onClickExit}>
          EXIT
        </button>
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.contents}>
          <div className={styles.title}>
        <button onClick={changeMode}>양세찬게임</button>
        <button onClick={changeMain}>메인</button>
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
