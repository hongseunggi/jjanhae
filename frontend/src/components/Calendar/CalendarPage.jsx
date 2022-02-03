import React, { useState, useEffect, useRef } from "react";
import styles from "./CalendarPage.module.css";
import axios from "axios";
import moment from "moment";
import buildCalendar from "./buildCalendar";
import ConferenceList from "./ConferenceList";
import ConferenceDetail from "./ConferenceDetail3";
// import ConferenceDetail from "./ConferenceDetail2";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { ReactComponent as PartyIcon } from "../../assets/icons/party.svg";
// import Modal from 'react-modal'

const CalendarPage = () => {
  //calendar
  const [calendar, setCalendar] = useState([]);
  //today
  const [value, setValue] = useState(moment());
  //set cliked date
  const [item, setItem] = useState({
    month: "",
    day: "",
  });
  //startDate
  const [startMonth, setStartMonth] = useState(moment());
  //endDate
  const [endMonth, setEndMonth] = useState(moment());
  //conference list
  const [party, setParty] = useState({
    conferences: [
      "2022-02-01",
      "2022-02-02",
      "2022-02-03",
    ],
  });

  const [partyList, setPartyList] = useState({
    conferencesId: [1, 2, 3, 4],
  });

  const [listModalOpen, setListModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const getDetailModalOpen = (status) => {
    setDetailModalOpen(status);
  };


  useEffect(() => {
    setCalendar(buildCalendar(value));
    setStartMonth(value.clone().startOf("month").subtract(1, "day"));
    setEndMonth(value.clone().endOf("month"));
  }, [value]);

  useEffect(() => {
    console.log(item);
  }, [item]);

  useEffect(() => {}, [detailModalOpen]);

  function dayStyles(day) {
    let yoil = day.day();
    if (day.isAfter(startMonth) && day.isBefore(endMonth)) {
      if (yoil === 0) return "sunday";
      if (yoil === 6) return "saturday";
      if (yoil > 0 && yoil) return "weekday";
    } else {
      return "none";
    }
  }

  const currentMonth = () => {
    return value.format("M") + "월";
  };

  //선택된것 말고 다 hidden
  const handleClick = (event) => {
    setIsActive(false);
    setItem({
      month: value.format("M"),
      day: event.nativeEvent.path[2].outerText[0],
      });
    showList(event.target.nextElementSibling.style);
  };

  const showList = (target) => {
    if(target.visibility==='visible') {
      target.visibility='hidden';
      target.opacity='0';
      target.transform='translateY(0)';
    }else {
      target.visibility='visible';
      target.opacity='1';
      target.transform='translateY(-20px)';
    }
  }

  const calcYoil = (day) => {
    let yoil = dayStyles(day);
    let date = day.format("D").toString();
    return <div className={styles[yoil]}>{date}</div>;
  };

  const checkParty = (day) => {
    for (let i = 0; i < party.conferences.length; i++) {
      if (day.format("YYYY-MM-DD") === party.conferences[i]) {
        return (
          <>
            <div className={styles.container}>
            <button className={styles.partyicon} onClick={handleClick}></button>
              {/* <button onClick={onClick} className={`${styles.iconBtn}  ${styles.date}`}>
                <PartyIcon className={styles.partyicon} onClick={handleClick} ref={dropdownRef} />
              </button> */}
                <div className={isActive ? `${styles.partyList} ${styles.open}` : styles.partyList}>
                파티 목록
                  <ul>
                    <li><button className={styles.partyData}>{partyList.conferencesId[0]}</button></li>
                    <li><button className={styles.partyData}>{partyList.conferencesId[1]}</button></li>
                    <li><button className={styles.partyData}>{partyList.conferencesId[2]}</button></li>
                  </ul>
                </div>
              </div>
          </>
        );
      }
    }
  };

  const openListModal = () => {
    setListModalOpen(true);
  };

  const closeListModal = () => {
    setListModalOpen(false);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };

  return (
    <>
      <div className={styles.calendarFormBorder}>
        <div className={styles.calendarForm}>
          <ConferenceList
            open={listModalOpen}
            close={closeListModal}
            partyList={partyList}
            getDetailModalOpen={getDetailModalOpen}
          />
          <ConferenceDetail
            open={detailModalOpen}
            close={closeDetailModal}
            date={item}
          ></ConferenceDetail>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarTitle}>술자리 기록</div>
            <div className={styles.calendarTop}>
              <div className={styles.month}>{currentMonth()}</div>
              <CalendarIcon className={styles.icon} />
            </div>
          </div>
          <div className={styles.calendarBodyBorder}>
            <div className={styles.calendarBody}>
              {calendar.map((week, key) => (
                <div className={styles.week}>
                  {week.map((day) => (
                    <div className={styles.day}>
                      {calcYoil(day)}
                      {checkParty(day)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
