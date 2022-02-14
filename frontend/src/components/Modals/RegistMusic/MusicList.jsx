import React, { createRef, useState } from "react";
import { ReactComponent as CancelIcon } from "../../../assets/icons/cancel.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play.svg";
import { ReactComponent as StopIcon } from "../../../assets/icons/stop.svg";
import styles from "./MusicList.module.css";

const MusicList = ({
  open,
  onClose,
  musicList,
  playing = false,
  onStart,
  onStop,
  onDelete,
}) => {
  const currentMusic = musicList[0].split("^");
  const nextMusicList = musicList.slice(1);

  const handleDeleteClick = (music) => {
    // const deleteMusicInfo = music.split("^");
    // const deleteVideoId = deleteMusicInfo[2];
    onDelete(music);
  };
  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
    >
      {open ? (
        <section className={styles.modalForm}>
          <div className={styles.btnRow}>
            <h1 className={styles.title}>신청곡 목록</h1>
            <button className={styles.closeBtn} onClick={onClose}>
              <CancelIcon width="20" height="20" />
            </button>
          </div>

          <ul className={styles.musicList}>
            {nextMusicList.map((music) => {
              const musicInfo = music.split("^");
              const song = musicInfo[1];
              const singer = musicInfo[0];

              return (
                <li key={musicInfo[2]} className={styles.musicRow}>
                  <div className={styles.musicInfoRow}>
                    <div>
                      <img
                        className={styles.thumbnail}
                        src={musicInfo[3]}
                        alt="thumbnail"
                      />
                    </div>
                    <div className={styles.musicInfo}>
                      <span className={styles.song}>{song}</span>
                      <span className={styles.singer}>{singer}</span>
                    </div>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClick(music)}
                  >
                    <DeleteIcon width={20} height={30} />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className={styles.currentMusic}>
            <div className={styles.musicInfo}>
              <span className={styles.currentSong}>{currentMusic[1]}</span>
              <span className={styles.currentSinger}>{currentMusic[0]}</span>
            </div>
            <div className={styles.currentRight}>
              <div className={styles.playerIcon}>
                {playing ? (
                  <StopIcon
                    width="20"
                    height="20"
                    fill="#000"
                    onClick={onStop}
                  />
                ) : (
                  <PlayIcon
                    width="20"
                    height="20"
                    fill="#000"
                    onClick={onStart}
                  />
                )}
              </div>
              <div>
                <img
                  className={styles.currentThumbnail}
                  src={currentMusic[3]}
                  alt="thumbnail"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default MusicList;
