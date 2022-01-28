import React, { useState } from "react";
import { ReactComponent as FireworksIcon } from "../../assets/icons/fireworks.svg";
import { ReactComponent as ToastIcon } from "../../assets/icons/toast.svg";
import imageUpload from "../../assets/icons/imageUpload.png";
import Image from "../../assets/picture.PNG";
import styles from "./ConferenceDetail.module.css";
const ConferenceDetail = (props) => {
  const { open, close, date } = props;

  const [data, setData] = useState({
    participant : ["소주희", "김정연", "배하은", "송민수", "유소연", "홍승기"],
    callStartTime : "01:30",
    totalTime : "07:30",
  });

  const showParticipant = () => {
    const result = [];
    for(let i=0; i<data.participant.length; i++) {
      result.push(<div className={styles.peopleName}>{data.participant[i]}</div>)
    }
    return result;
  }


  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
    >
      {open ? (
        <section className={styles.modalForm}>
          <header>
            <div>
              <ToastIcon className={styles.icon} />
            </div>
            <h1 className={styles.title}>{date.month}월{date.day}일</h1>
            <div>
              <ToastIcon className={styles.icon} />
            </div>
          </header>
          <main>
              <div className={styles.partyDetailFormBorder}>
                <div className={styles.partyDetailLeft}>
                  <div className={styles.partyDetailData}>
                    <div className={styles.partyPeople}>
                      <div className={styles.peopleTitle}>참여인원</div>
                      <div className={styles.peopleList}>
                        {showParticipant()}
                      </div>
                    </div>
                    <div className={styles.partyStartTimeBorder}>
                      <div className={styles.partyStartTimeTitle}>시작시간</div>
                      <div className={styles.partyStartTime}>{data.callStartTime}</div>
                    </div>
                    <div className={styles.partyElapsedTimeBorder}>
                      <div className={styles.partyStartTimeTitle}>총 파티 시간</div>
                      <div className={styles.partyStartTime}>{data.totalTime}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.partyDetailRight}>
                  <div className={styles.partyImageTitle}>함께한 순간</div>
                  <div className={styles.partyImageForm}>
                    <img
                      className={styles.partyImage}
                      src={Image}
                      alt="thumbnail"
                    />
                  </div>
                </div>
              </div>
          </main>
          <footer>
            <button className={styles.closeBtn} onClick={close}>
              {" "}
              닫기{" "}
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default ConferenceDetail;
