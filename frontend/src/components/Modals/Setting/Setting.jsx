import React, { useState } from "react";
import styles from "./Setting.module.css";

const Keyword = (props) => {
  const { open, onClose } = props;

  const [setting, setSetting] = useState({
    sound: "",
    mic: "",
  });

  const { sound, mic } = setting;

  const handleChange = (event) => {
    const { id, value } = event.target;
    setSetting({
      ...setting,
      [id]: value,
    });
  };

  const confirm = () => {
    console.log(setting);
    onClose();
  };

  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
    >
      {open ? (
        <section className={styles.modalForm}>
          <header></header>
          <main className={styles.main}>
            <div className={styles.titleSection}>
              <p className={styles.title}>설정</p>
            </div>
            <div className={styles.settingBorder}>
              <div className={styles.sound}>
                <p className={styles.text}>사운드</p>
                <input id="sound" type="range" onChange={handleChange} />
              </div>
              <div className={styles.mic}>
                <p className={styles.text}>마이크</p>
                <input id="mic" type="range" onChange={handleChange} />
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

export default Keyword;
