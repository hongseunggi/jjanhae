import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import Image from "../../assets/picture.PNG";
import styles from "./ConferenceDetail.module.css";
import moment from "moment";

const ConferenceDetail = (props) => {
  const { open, close, date, time, userList, partyImg = Image } = props;
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

  console.log(time,"time");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  useEffect(() => {
    let hour = "";
    let minute = "";
    if(time.startTime!==undefined&&time.endTime!==undefined&&time.startTime!==''&&time.endTime!=='') {
      console.log("임마");
      if (time.startTime.time.hour <= 9) {
        hour += "0" + time.startTime.time.hour;
      } else hour = time.startTime.time.hour;
  
      if (time.startTime.time.minute <= 9) {
        minute += "0" + time.startTime.time.minute;
      } else minute = time.startTime.time.minute;
  
      setStartTime(hour + ":" + minute);
    }
  },[time]);

  useEffect(() => {
    let hour = "";
    let minute = "";
    if(time.startTime!==undefined&&time.endTime!==undefined&&time.startTime!==''&&time.endTime!=='') {
      console.log("임마");
      if (time.endTime.time.hour <= 9) {
        hour += "0" + time.endTime.time.hour;
      } else hour = time.endTime.time.hour;
      
      if (time.endTime.time.minute <= 9) {
        minute += "0" + time.endTime.time.minute;
      } else minute = time.endTime.time.minute;
      
      setEndTime(hour + ":" + minute);
    }
  },[time]);

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
                        {startTime}
                      </div>
                    </div>
                    <div className={styles.partyElapsedTimeBorder}>
                      <div className={styles.partyStartTimeTitle}>
                        종료 시간
                      </div>
                      <div className={styles.partyStartTime}>
                        {endTime}{" "}
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
