import React, { useState } from "react";
import { ReactComponent as LockIcon } from "../../assets/icons/password.svg";
import imageUpload from "../../assets/icons/imageUpload.png";

import styles from "./RoomConfig.module.css";
const RoomConfig = ({ open, onClose }) => {
  // const { open, close, header } = props;
  const [configStatus, setConfigStatus] = useState(false);
  const [roomConfig, setRoomConfig] = useState("public");
  const [drinkConfig, setDrinkConfig] = useState("first");

  const handleRoomConfig = (e) => {
    setRoomConfig(e.target.value);
  };

  const handleDrinkConfig = (e) => {
    setDrinkConfig(e.target.value);
  };
  
  const handleStopEvent = (e) =>{
    e.stopPropagation();
  };


  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      onClick={onClose}
    >
      {open ? (
        <section className={styles.modalForm} onClick={handleStopEvent}>
          <header>
            <h1 className={styles.title}>파티룸 생성하기</h1>
            <div>
              {roomConfig === "public" ? (
                <LockIcon
                  width="24"
                  height="24"
                  fill="rgba(255, 87, 34, 0.3)"
                />
              ) : (
                <LockIcon width="24" height="24" fill="rgba(255, 87, 34, 1)" />
              )}
            </div>
          </header>
          <main>
            <div className={styles.configForm}>
              <div className={styles.imagePreview}>
                <img
                  className={styles.thumbnail}
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"
                  alt="thumbnail"
                />
                <button className={styles.uploadBtn}>
                  <img
                    src={imageUpload}
                    alt="upload thumbnail"
                    className={styles.uploadImage}
                  />
                </button>
              </div>
              <form className={styles.configData}>
                <label htmlFor="title">방 이름</label>
                <input
                  id="title"
                  className={styles.nameInput}
                  placeholder="방 이름을 입력하세요."
                />
                <label htmlFor="config">방 설정</label>
                <div className={styles.radioWrap}>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="public"
                      checked={roomConfig === "public"}
                      onChange={handleRoomConfig}
                    />
                    <span>공개방</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="private"
                      checked={roomConfig === "private"}
                      onChange={handleRoomConfig}
                    />
                    <span>비공개방</span>
                  </div>
                  {roomConfig === "private" && (
                    <div className={styles.roomPwd}>
                      <input
                        type="password"
                        placeholder="비밀번호"
                        maxLength="10"
                      />
                    </div>
                  )}
                </div>
                <div className={styles.radioWrap}>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="first"
                      checked={drinkConfig === "first"}
                      onChange={handleDrinkConfig}
                    />
                    <span>0 ~ 1병</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="second"
                      checked={drinkConfig === "second"}
                      onChange={handleDrinkConfig}
                    />
                    <span>2 ~ 3병</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="config"
                      type="radio"
                      value="third"
                      checked={drinkConfig === "third"}
                      onChange={handleDrinkConfig}
                    />
                    <span>4병 ~</span>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <form className={styles.descriptionForm}>
                <label htmlFor="description">방 설명</label>
                <textarea
                  id="description"
                  className={styles.description}
                  placeholder="방에 대한 정보를 입력하세요."
                ></textarea>
              </form>
            </div>
          </main>
          <footer>
            <button className={styles.createBtn}> 방 생성 </button>
            <button className={styles.closeBtn} onClick={onClose}>
              {" "}
              취소{" "}
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default RoomConfig;
