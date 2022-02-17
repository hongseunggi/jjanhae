import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Room.module.css";
import LoadingSpinner from "../Modals/LoadingSpinner/LoadingSpinner";
import RoomApi from "../../api/RoomApi";

import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as GameIcon } from "../../assets/icons/game.svg";
import { ReactComponent as RegistMusicIcon } from "../../assets/icons/library.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as SongIcon } from "../../assets/icons/microphone.svg";

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
import KaraokeList from "../Modals/Karaoke/KaraokeList";
// import RoomContentsGrid from "./RoomContentsGrid";

const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);

const Room = () => {
  const { sessionId } = useContext(SessionIdContext);
  const { setLoginStatus } = useContext(LoginStatusContext);
  const { myVMstate } = useContext(VideoMicContext);
  // const { myName } = useContext(NameContext);
  const myName = localStorage.getItem("name");
  const [mode, setMode] = useState("basic");
  const [contentTitle, setContentTitle] = useState("");
  const [onGameList, setOnGameList] = useState(false);
  const [onKaraokeList, setOnKaraokeList] = useState(false);
  const [onRegistMusic, setOnRegistMusic] = useState(false);
  const [gameId, setGameId] = useState("");
  const [singMode, setSingMode] = useState(1);

  const { setbangZzang } = useContext(BangZzangContext);

  // const { title, roomseq } = useParams();
  const { roomseq } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getRoomExitResult, getRoomTitle } = RoomApi;

  // const musicListRef = useRef(musicList);
  // musicListRef.current = musicList;

  const getRoomTitleToServer = async () => {
    const result = await getRoomTitle(roomseq);
    console.log(result);
  };
  useEffect(() => {
    console.log("room render");
    getRoomTitleToServer();
    // setContentTitle(title);
    setLoginStatus("3");

    if (sessionId !== "" && sessionId !== undefined) {
      sessionId.on("signal:photo", (event) => {
        const data = event.data;
        console.log(data);
        if (data.photoStatus === 0) {
          setContentTitle("인생네컷");
          setMode("snapshot");
        }
      });
      sessionId.on("signal:game", (event) => {
        const data = event.data;
        console.log(data);
        console.log(data.gameId);
        if (data.gameStatus !== 3) {
          setGameId(data.gameId);
          if (data.gameId === 1) {
            setContentTitle("양세찬 게임");
            setMode("game1");
            setbangZzang(data.streamId);
          } else if (data.gameId === 2) {
            setContentTitle("금지어 게임");
            setMode("game2");
            setbangZzang(data.streamId);
          } else if (data.gameId === 3) {
            console.log("????????되긴하니?");
            setContentTitle("UP DOWN 게임");
            setMode("game3");
            setbangZzang(data.streamId);
            // handleStartUpdown();
          }
        } else {
          if (data.gameId === 3 && data.updown === undefined) {
            setGameId(0);
            setMode("basic");
          }
        }
      });
      sessionId.on("signal:sing", (event) => {
        const data = event.data;
        if (data.singMode === 1) {
          console.log(data.singMode);
          setSingMode(1);
          setContentTitle("노래방");
        } else if (data.singMode === 2) {
          setSingMode(2);
          setContentTitle("복불복 노래방");
        }
        setMode("karaoke");
      });
    }

    return () => setLoginStatus("2");
  }, [sessionId]);

  useEffect(() => {
    console.log(mode);
    console.log(contentTitle);
  }, [mode]);

  useEffect(() => {
    console.log(contentTitle);
  }, [contentTitle]);

  useEffect(() => {
    if (gameId !== "" && gameId !== undefined) {
      console.log(gameId);
      changeGameMode();
    }
  }, [gameId]);

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
  const sendSignalForRemoveVoiceFilter = () => {
    const data = {
      singStatus: -1,
      singMode,
    };
    sessionId.signal({
      type: "sing",
      data: JSON.stringify(data),
    });
  };
  const handleHomeClick = () => {
    if (mode === "karaoke") {
      console.log("보이스필터 제거");
      sendSignalForRemoveVoiceFilter();
    }
    if (mode !== "basic" && mode !== "snapshot" && mode !== "karaoke") {
      let curId = gameId;
      curId *= 1;
      //게임종료 api호출
      let data = {
        gameStatus: 3,
        gameId: curId,
      };
      sessionId.signal({
        data: JSON.stringify(data),
        type: "game",
      });
    }
    // setContentTitle(title);
    setMode("basic");
  };

  const handleGoTitle = () => {
    // setContentTitle(title); //////
    setMode("basic");
  };

  const handleCameraClick = () => {
    if (mode === "karaoke") {
      sendSignalForRemoveVoiceFilter();
    }
    if (mode !== "snapshot") {
      const data = {
        photoStatus: 0,
      };

      sessionId.signal({
        data: JSON.stringify(data),
        type: "photo",
      });
    }
  };

  const handleModalClose = () => {
    setOnGameList(false);
    setOnKaraokeList(false);
    setOnRegistMusic(false);
  };

  const handleGameList = () => {
    setOnGameList(true);
  };

  const handleKaraokeList = () => {
    setOnKaraokeList(true);
  };

  const handleRegistMusic = () => {
    setOnRegistMusic(true);
  };

  const handleMusicSearch = (singer, song) => {
    const music = `${singer}${song}`;
    youtube.search(music).then((videos) => {
      const videoId = videos[0].id.videoId;
      const thumbnail = videos[0].snippet.thumbnails.default.url;
      const data = {
        musicStatus: 4,
        videoId: videoId,
        thumUrl: thumbnail,
        singer,
        song,
      };
      sessionId.signal({
        type: "music",
        data: JSON.stringify(data),
      });
    });
  };

  const changeGameMode = (gameMode) => {
    if (mode === "karaoke") {
      console.log("보이스필터 제거");
      sendSignalForRemoveVoiceFilter();
    }
    console.log(gameMode);
    console.log(gameId);
    if (gameMode === 3) {
      const data = {
        gameStatus: 0,
        gameId: 3,
        // index : 1,
      };
      console.log("실행됨?");
      sessionId.signal({
        type: "game",
        data: JSON.stringify(data),
      });
      const data2 = {
        gameStatus: 1,
        gameId: 3,
        index: 1,
      };
      sessionId.signal({
        data: JSON.stringify(data2),
        type: "game",
      });
    } else if (gameMode !== undefined) {
      const data = {
        gameStatus: 0,
        gameId: gameMode,
      };
      sessionId.signal({
        type: "game",
        data: JSON.stringify(data),
      });
    }
  };

  const handleGameModeChange = (data) => {
    console.log(data);
    if (data === "1") {
      changeGameMode(1);
    } else if (data === "2") {
      changeGameMode(2);
    } else if (data === "3") {
      changeGameMode(3);
    }
  };

  const changeKaraokeMode = (mode) => {
    const data = {
      singStatus: 0,
      singMode: mode,
    };
    sessionId.signal({
      type: "sing",
      data: JSON.stringify(data),
    });
  };

  const handleKaraokeModeChange = (data) => {
    console.log(data);
    if (data === "1") {
      changeKaraokeMode(1);
    } else if (data === "2") {
      changeKaraokeMode(2);
    }
  };

  const goHome = () => {
    setMode("basic");
    setGameId(0);
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
            <h1>{contentTitle}</h1>
          </div>
          <div className={styles["main-contents"]}>
            <RoomContents
              sessionName={roomseq}
              userName={myName}
              media={myVMstate}
              mode={mode}
              singMode={singMode}
              back={handleHomeClick}
              goHome={goHome}
              home={handleGoTitle}
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
          <SongIcon
            width="50"
            height="50"
            fill="#eee"
            onClick={handleKaraokeList}
            className={styles.icon}
          />
          <RegistMusicIcon
            width="50"
            height="50"
            fill="#eee"
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
        onChange={handleGameModeChange}
      />
      <KaraokeList
        open={onKaraokeList}
        onClose={handleModalClose}
        onChange={handleKaraokeModeChange}
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
