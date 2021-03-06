import React, { useState } from "react";
import { ReactComponent as LockIcon } from "../../../assets/icons/password.svg";
import ImgApi from "../../../api/ImgApi";
import RoomApi from "../../../api/RoomApi";
import imageUpload from "../../../assets/icons/imageUpload.png";
import styles from "./RoomConfig.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RoomConfig = ({ open, onClose }) => {
  // const { open, close, header } = props;
  const [configStatus, setConfigStatus] = useState(false);
  const [roomConfig, setRoomConfig] = useState("public");
  const [drinkConfig, setDrinkConfig] = useState("first");
  const [thumbnailImg, setThumbnailImg] = useState(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"
  );
  const [description, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { getImgUploadResult } = ImgApi;
  const { getCreateRoomResult } = RoomApi;

  const titleHandler = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const descHandler = (e) => {
    e.preventDefault();
    setDesc(e.target.value);
  };

  const pwdHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const imgInputhandler = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const { data } = await getImgUploadResult(formData);
    //console.log(data);
    setThumbnailImg(data.url);
  };

  const handleRoomConfig = (e) => {
    setRoomConfig(e.target.value);
  };

  const handleDrinkConfig = (e) => {
    setDrinkConfig(e.target.value);
  };

  const handleStopEvent = (e) => {
    e.stopPropagation();
  };

  const createRoomSubmit = async () => {
    let type = 1;
    let drinkLimit = 1;

    if (roomConfig === "private") {
      type = 0;
    }
    if (drinkConfig === "second") {
      drinkLimit = 2;
    } else if (drinkConfig === "third") {
      drinkLimit = 3;
    }
    if (type === 0 && password.length >= 0 && password.length < 3) {
      toast.error(
        <div className="hi" style={{ width: "350px" }}>
          비밀번호를 3자리 이상으로 설정 해주세요.
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          role: "alert",
        }
      );
      return;
    }
    const body = {
      name: title,
      thumbnail: thumbnailImg,
      type: type,
      password: password,
      description: description,
      drinkLimit: drinkLimit,
      ismute: "y",
      isOn: "y",
    };
    const { data } = await getCreateRoomResult(body);
    //// -> 리턴 되는 data 가지고 뭘 한다면 이 밑에 작성
    //console.log(data);
    navigate(`/conferences/detail/${data.roomSeq}`);
    //// -> 이 밑 부분에 화상회의 방 ? 으로 라우트 시켜주는게 들어가야 할 듯 합니다. 일단 닫기로 했습니다.
    onClose();
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
                  src={thumbnailImg}
                  alt="thumbnail"
                />
                <label htmlFor="input-img">
                  <img
                    src={imageUpload}
                    alt="upload thumbnail"
                    className={styles.uploadImage}
                    style={{ cursor: "pointer" }}
                  />
                </label>
                <input
                  type="file"
                  id="input-img"
                  accept="image/png, image/jpeg"
                  className={styles.uploadBtn}
                  onChange={imgInputhandler}
                />
              </div>
              <form className={styles.configData}>
                <label htmlFor="title">방 이름</label>
                <input
                  id="title"
                  className={styles.nameInput}
                  value={title}
                  placeholder="방 이름을 입력하세요."
                  onChange={titleHandler}
                />
                <label htmlFor="config">방 설정</label>
                <div className={styles.radioWrap}>
                  <div className={styles.radioData}>
                    <input
                      id="public"
                      type="radio"
                      value="public"
                      checked={roomConfig === "public"}
                      onChange={handleRoomConfig}
                    />
                    <span>공개방</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="private"
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
                        value={password}
                        onChange={pwdHandler}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.radioWrap}>
                  <div className={styles.radioData}>
                    <input
                      id="first"
                      type="radio"
                      value="first"
                      checked={drinkConfig === "first"}
                      onChange={handleDrinkConfig}
                    />
                    <span>0 ~ 1병</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="second"
                      type="radio"
                      value="second"
                      checked={drinkConfig === "second"}
                      onChange={handleDrinkConfig}
                    />
                    <span>2 ~ 3병</span>
                  </div>
                  <div className={styles.radioData}>
                    <input
                      id="third"
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
                  value={description}
                  onChange={descHandler}
                ></textarea>
              </form>
            </div>
          </main>
          <footer>
            <button className={styles.createBtn} onClick={createRoomSubmit}>
              {" "}
              방 생성{" "}
            </button>
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
