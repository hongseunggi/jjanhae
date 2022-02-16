import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import Image from "../../assets/picture.PNG";
import styles from "./ConferenceDetail.module.css";
import moment from "moment";

const ConferenceDetail = (props) => {
  const { open, close, date, time, userList, partyImg } = props;
  console.log(partyImg);
  const [participant, setParticipant] = useState([]);
  const [roomDetail, setRoomDetail] = useState();

  const showParticipant = () => {
    //console.log(participant);
    const dataList = [];
    for (let i = 0; i < participant.userList.length; i++) {
      dataList.push(participant.userList[i]);
    }
    const userListData = dataList.map((data, index) => (
      <div className={styles.partyDpeopleNameata} key={index}>
        {data}
      </div>
    ));

    return <>{userListData}</>;
  };

  useEffect(() => {
    setParticipant({ userList });
  }, [userList]);

  useEffect(() => {
    //console.log(participant);
  }, [participant]);

  useEffect(() => {
    //console.log(time);
  }, [time]);

  return (
    <div
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
    >
      {open ? (
        <section className={styles.modalForm}>
          <main className={styles.main}>
            <div className={styles.partyDetailFormBorder}>
              <div className={styles.partyDetailLeft}>
                <div className={styles.partyDetailLeftData}>
                  <div className={styles.logoBorder}>
                    <img src={Logo} className={styles.logo} alt="logo"></img>
                  </div>
                  <h1 className={styles.title}>
                    {date.month}월{date.day}일
                  </h1>
                  <div className={styles.partyDetailData}>
                    <div className={styles.partyStartTimeBorder}>
                      <div className={styles.partyStartTimeTitle}>시작시간</div>
                      <div className={styles.partyStartTime}>
                        {time.startTime.time.hour} :{time.startTime.time.minute}
                      </div>
                    </div>
                    <div className={styles.partyElapsedTimeBorder}>
                      <div className={styles.partyStartTimeTitle}>
                        종료 시간
                      </div>
                      <div className={styles.partyStartTime}>
                        {time.endTime.time.hour} :{time.endTime.time.minute}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.partyDetailRight}>
                <div className={styles.partyDetailRightBackground}>
                  <div className={styles.rightTop}>
                    <button className={styles.closeBtn} onClick={close}>
                      {" "}
                      x{" "}
                    </button>
                  </div>
                  <div className={styles.partyImageForm}>
                    <img
                      className={styles.partyImage}
                      src={partyImg}
                      alt="thumbnail"
                    />
                  </div>
                  <div className={styles.partyPeople}>
                    <div className={styles.peopleList}>{showParticipant()}</div>
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
