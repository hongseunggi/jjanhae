import React from "react";
import styles from "./SnapShotResult.module.css";
import Logo from "../../../assets/logo.png";
import { ReactComponent as RetryIcon } from "../../../assets/icons/retry.svg";
import { ReactComponent as SaveIcon } from "../../../assets/icons/save.svg";
import { ReactComponent as StartIcon } from "../../../assets/icons/picStart.svg";

const SnapShotResult = ({ images, status, onStart, onRetry, onSave }) => {
  console.log(images);

  const handleStartClick = () => {
    onStart();
  };

  const handleRetryClick = () => {
    onRetry();
  };

  const handleSaveClick = () => {
    onSave();
  };

  return (
    <div className={styles.snapshotForm}>
      <div
        id="image-container"
        className={
          status !== 1
            ? `${styles["image-container"]} ${styles.blur}`
            : styles["image-container"]
        }
      >
        <div className={styles.images}>
          <div className={styles["image-form"]}>
            <div
              className={styles.image}
              style={
                images[0]
                  ? {
                      backgroundImage: `url(${images[0]})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor: "black",
                    }
                  : null
              }
            ></div>
          </div>
          <div className={styles["image-form"]}>
            <div
              className={styles.image}
              style={
                images[1]
                  ? {
                      backgroundImage: `url(${images[1]})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor: "black",
                    }
                  : null
              }
            ></div>
          </div>
          <div className={styles["image-form"]}>
            <div
              className={styles.image}
              style={
                images[2]
                  ? {
                      backgroundImage: `url(${images[2]})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor: "black",
                    }
                  : null
              }
            ></div>
          </div>
          <div className={styles["image-form"]}>
            <div
              className={styles.image}
              style={
                images[3]
                  ? {
                      backgroundImage: `url(${images[3]})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor: "black",
                    }
                  : null
              }
            ></div>
          </div>
        </div>
        <div className={styles.logo}>
          <img src={Logo} alt="logo" className={styles.logoImg} />
        </div>
      </div>
      {status === 0 ? (
        <div className={styles.start}>
          <button className={styles.startBtn} onClick={handleStartClick}>
            <StartIcon width="80" height="80" />
          </button>
        </div>
      ) : null}
      {status === 2 ? (
        <div className={styles.resultBtns}>
          <div className={styles.snapshotBtn}>
            <div>
              <button className={styles.retryBtn} onClick={handleRetryClick}>
                <RetryIcon width="50" height="50" />
              </button>
            </div>
            <div>
              <button className={styles.saveBtn} onClick={handleSaveClick}>
                <SaveIcon width="50" height="50" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SnapShotResult;
