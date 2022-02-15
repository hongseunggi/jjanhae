import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createRef,
} from "react";

import ReactPlayer from "react-player";
import styles from "./Karaoke.module.css";
import Youtube from "../../../api/Youtube";
import ReserveMusicList from "../../Modals/Karaoke/ReserveMusicList";
import ReserveMusic from "../../Modals/Karaoke/ReserveMusic";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
const youtube = new Youtube(process.env.REACT_APP_YOUTUBE_API_KEY);

const Karaoke = ({ user, singMode }) => {
  const [musicList, setMusicList] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [openReserveMusicList, setOpenReserveMusicList] = useState(false);
  const [openReserveMusic, setOpenReserveMusic] = useState(false);
  // const [status, setStatus] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const videoIdRef = useRef(videoId);
  videoIdRef.current = videoId;

  const musicListRef = useRef(musicList);
  musicListRef.current = musicList;

  useEffect(() => {
    console.log(musicList);
  }, [musicList]);

  useEffect(() => {
    console.log(videoId);
    console.log(videoIdRef);
  }, [videoId]);

  useEffect(() => {
    user.getStreamManager().stream.session.on("signal:sing", (event) => {
      const data = event.data;
      console.log(data);
      switch (data.singStatus) {
        case 1:
          //음악 추가
          const dataInfo = data.reserveSongList.split("|");
          const musicAddArr = [];
          dataInfo.forEach((value) => {
            musicAddArr.push(value);
          });
          setMusicList(musicAddArr);
          break;
        case 2:
          //노래 재생
          // if (data.singMode === 2) {
          //   const vlist = data.voiceFilter.split("/");
          //   setVoiceFilter(vlist);
          // }

          const musicInfo = data.nowSing.split("^");
          setVideoId(musicInfo[2]);
          setPlaying(true);

          const musicInfos = data.reserveSongList.split("|");
          const musicArr = [];
          musicInfos.forEach((value) => {
            musicArr.push(value);
          });
          setMusicList(musicArr);
          break;
        case 3:
          //음악 삭제
          const resultInfo = data.reserveSongList.split("|");
          const musicDeleteAfterArr = [];
          // if (resultInfo.length === 1) {
          //   const musicInfo = resultInfo[0].split("^");
          //   setVideoId(musicInfo[2]);
          // }
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

  const handleMusicSearch = (singer, song) => {
    // const music = `[KY ENTERTAINMENT] ${singer}${song}`;
    const music = `${singer}${song}lyrics`;
    console.log(music);
    youtube.search(music).then((videos) => {
      console.log(videos);
      const result = videos.filter((video) => {
        console.log(video);
        console.log(video.snippet.channelTitle);
        if (
          video.snippet.channelTitle !== "금영 노래방 공식 유튜브 채널" &&
          video.snippet.channelTitle !== "TJ KARAOKE TJ 노래방 공식 유튜브채널"
        ) {
          return video;
        } else {
          return null;
        }
      });
      console.log(result);
      const videoId = result[0].id.videoId;
      const thumbnail = result[0].snippet.thumbnails.default.url;
      // const url = `https://www.youtube.com/embed/${videoId}`;
      const data = {
        singMode: singMode,
        singStatus: 1,
        videoId: videoId,
        thumUrl: thumbnail,
        singer,
        song,
      };
      user.getStreamManager().stream.session.signal({
        type: "sing",
        data: JSON.stringify(data),
      });
    });
  };

  const handleModalClose = () => {
    setOpenReserveMusic(false);
    setOpenReserveMusicList(false);
  };

  const handleReserveMusicStart = () => {
    if (musicList.length !== 0 || musicList[0] !== "") {
      const data = {
        singStatus: 2,
        singMode: singMode,
      };

      user.getStreamManager().stream.session.signal({
        type: "sing",
        data: JSON.stringify(data),
      });
    }
  };
  const handleReserveMusicClick = () => {
    console.log("옴?");
    setOpenReserveMusic(true);
  };

  const handleReserveMusicListClick = () => {
    // if (musicList.length !== 0) {
    setOpenReserveMusicList(true);
    // }
  };

  const handleMusicListDelete = useCallback((music) => {
    const deleteMusicInfo = music.split("^");
    console.log(deleteMusicInfo);
    const deleteVideoId = deleteMusicInfo[2];
    const data = {
      singStatus: 3,
      singMode,
      videoId: deleteVideoId,
    };

    user.getStreamManager().stream.session.signal({
      type: "sing",
      data: JSON.stringify(data),
    });
  }, []);

  const handleEndMusic = () => {
    //music list 들어있나 확인
    if (musicListRef.current.length > 1) {
      const data = {
        singStatus: 2,
        singMode,
      };

      user.getStreamManager().stream.session.signal({
        type: "sing",
        data: JSON.stringify(data),
      });
    }
  };

  const handleChange = (event, newValue) => {
    setVolume(newValue / 100);
  };

  return (
    <div className={styles.videoPlayer}>
      <div className={styles["player-overlay"]}></div>
      <ReactPlayer
        url={`https://www.youtube.com/embed/${videoIdRef.current}`}
        playing={playing}
        volume={volume}
        // controls
        onEnded={() => handleEndMusic()}
        width="100%"
        height="75%"
        className={styles.video}
      />

      <div className={styles.ReserveBtns}>
        <div>음정</div>
        <div>템포</div>
        <div>멜로디</div>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>남여음정</div>
        <div>리듬변환</div>
        <div>신곡안내</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div className={styles.logoName}></div>
        <button className={styles.nextBtn} onClick={handleReserveMusicStart}>
          다음곡
        </button>

        {/* <div>남여음정</div>
        <div>리듬변환</div>
        <div>신곡안내</div> */}
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div className={styles.volumeBar}>
          {/* <PlayerIcon width="30" height="30" fill="#eee" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={volume}
            onChange={(event) => {
              setVolume(event.target.valueAsNumber);
            }}
          /> */}
          <Box sx={{ width: 200 }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <VolumeDown sx={{ color: "#eee" }} />
              <Slider
                aria-label="Volume"
                value={volume * 100}
                onChange={handleChange}
              />
              <VolumeUp sx={{ color: "#eee" }} />
            </Stack>
          </Box>
        </div>
        <button className={styles.reserveBtn} onClick={handleReserveMusicClick}>
          예약
        </button>
        <button
          className={styles.reserveListBtn}
          onClick={handleReserveMusicListClick}
        >
          목록
        </button>
        <div className={styles.smallvideo}>
          <div className={styles["small-player-overlay"]}></div>
          <ReactPlayer
            url={`https://www.youtube.com/embed/${videoIdRef.current}`}
            playing={playing}
            muted={true}
            volume={0}
            // controls
            onEnded={() => handleEndMusic()}
            width="100%"
            height="100%"
          />
        </div>
        <button className={styles.startBtn} onClick={handleReserveMusicStart}>
          시작
        </button>
      </div>
      {/* <button onClick={handleReserveMusicStart}>시작</button> */}
      {openReserveMusicList ? (
        <ReserveMusicList
          open={openReserveMusicList}
          onClose={handleModalClose}
          // onStart={handleMusicStart}
          // onStop={handleMusicStop}
          onDelete={handleMusicListDelete}
          musicList={musicList}
          playing={playing}
        />
      ) : null}
      {openReserveMusic ? (
        <ReserveMusic
          open={openReserveMusic}
          onClose={handleModalClose}
          onSubmit={handleMusicSearch}
        />
      ) : null}
    </div>
  );
};

export default Karaoke;
