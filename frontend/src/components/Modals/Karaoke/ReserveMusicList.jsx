import React from "react";
import { ReactComponent as CancelIcon } from "../../../assets/icons/cancel.svg";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import styles from "./ReserveMusicList.module.css";

const ReserveMusicList = ({ open, onClose, musicList, onDelete }) => {
  console.log(musicList.length);
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
            <h1 className={styles.title}>예약 목록</h1>
            <button className={styles.closeBtn} onClick={onClose}>
              <CancelIcon width="20" height="20" />
            </button>
          </div>
          {musicList[0] !== "" ? (
            <ul className={styles.musicList}>
              {musicList.map((music, index) => {
                const musicInfo = music.split("^");
                const song = musicInfo[1];
                const singer = musicInfo[0];

                return (
                  <li key={index} className={styles.musicRow}>
                    <div className={styles.musicInfoRow}>
                      {/* <div>
                      <img
                        className={styles.thumbnail}
                        src={musicInfo[3]}
                        alt="thumbnail"
                      />
                    </div> */}
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
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export default ReserveMusicList;
