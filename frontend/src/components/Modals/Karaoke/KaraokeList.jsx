import React, { useState, useEffect } from "react";
import styles from "./KaraokeList.module.css";
import { ReactComponent as KaraokeIcon } from "../../../assets/icons/microphone.svg";

const KaraokeList = (props) => {
  const { open, onClose, onChange } = props;
  const [game, setGame] = useState();

  const handleChange = (event) => {
    setGame(event.target.value);
  };

  const confirm = () => {
    onChange(game);
    onClose();
  };

  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
    >
      {open ? (
        <section className={styles.modalForm}>
          <main className={styles.main}>
            <div className={styles.icon}>
              <KaraokeIcon className={styles.icon} fill="#000" />
            </div>
            <div className={styles.gameListBorder}>
              <div className={styles.game}>
                일반 노래방
                <input
                  value="1"
                  type="radio"
                  checked={game === "1"}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.game}>
                복불복 노래방
                <input
                  value="2"
                  name="platform"
                  type="radio"
                  checked={game === "2"}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.buttonBorder}>
              <button className={styles.confirmBtn} onClick={confirm}>
                {" "}
                확인{" "}
              </button>
              <button className={styles.closeBtn} onClick={onClose}>
                {" "}
                취소{" "}
              </button>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default KaraokeList;
