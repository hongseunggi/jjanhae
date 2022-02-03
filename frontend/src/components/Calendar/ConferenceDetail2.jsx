import React, { useState } from "react";
import { ReactComponent as ToastIcon } from "../../assets/icons/toast.svg";
import imageUpload from "../../assets/icons/imageUpload.png";

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
          <div className={styles.modalTitle}>
            <div>
              <ToastIcon className={styles.icon} />
            </div>
            <h1 className={styles.title}>2022년 {date.month}월 {date.day}일</h1>
            <div>
              <ToastIcon className={styles.icon} />
            </div>
          </div>
            {/* <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button> */}
          </header>
          <main>
              <div className={styles.partyDetailFrom}>
                

            <div className={styles.partyDetailTop}>
              {/* <div className={styles.partyImageTitle}>함께한 순간</div> */}
              <div className={styles.partyImageForm}>
                <img
                  className={styles.partyImage}
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/paris.jpg"
                  alt="thumbnail"
                />
              </div>
            </div>
            <div className={styles.partyDetailBottom}>
              <div className={styles.partyDetailBottomData}>
                <div className={styles.partyPeople}>
                  <div className={styles.peopleTitle}>참가자</div>
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
