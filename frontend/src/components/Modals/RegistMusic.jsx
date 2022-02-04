import React, { createRef, useState } from "react";
import { ReactComponent as CancelIcon } from "../../assets/icons/cancel.svg";
import styles from "./RegistMusic.module.css";

const RegistMusic = ({ open, onClose }) => {
  const [singer, setSinger] = useState("");
  const [song, setSong] = useState("");
  const singerRef = createRef();
  const songRef = createRef();

  const handleInput = (e) => {
    e.preventDefault();
    setSinger(singerRef.current.value);
    setSong(songRef.current.value);
  };

  const handleClick = () => {
    console.log(singer);
    console.log(song);
  };
  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
    >
      {open ? (
        <section className={styles.modalForm}>
          <div className={styles.btnRow}>
            <button className={styles.closeBtn}>
              <CancelIcon width="20" height="20" />
            </button>
          </div>
          <h1>신청곡</h1>
          <form className={styles.inputData}>
            <input ref={singerRef} placeholder="가수" onChange={handleInput} />
            <input
              ref={songRef}
              placeholder="노래 제목"
              onChange={handleInput}
            />
          </form>
          <div className={styles.btnRow}>
            <button className={styles.registBtn} onClick={handleClick}>
              접수
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default RegistMusic;
