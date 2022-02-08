import React, { useState, useEffect, useRef } from "react";
import styles from "./CalendarPage.module.css";
import axios from "axios";
import moment from "moment";
import buildCalendar from "./buildCalendar";
import ConferenceList from "./ConferenceList";
import ConferenceDetail from "./ConferenceDetail3";
import UserApi from "../../api/UserApi.js";
// import ConferenceDetail from "./ConferenceDetail2";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { ReactComponent as PartyIcon } from "../../assets/icons/party.svg";
import beerbottle from "../../assets/icons/beerbottle.png";
import { Dropdown } from "bootstrap";
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
  //
  const [month, setMonth] = useState();
  //startDate
  const [startMonth, setStartMonth] = useState(moment());
  //endDate
  const [endMonth, setEndMonth] = useState(moment());
  //conference list
  const [party, setParty] = useState({
    conferences: [],
  });
  const [partyList, setPartyList] = useState({
    conferencesId: [1, 2, 3],
  });
  const [roomList, setRoomList] = useState({
    roomList: [],
  });
  const [roomSeq, setRoomSeq] = useState();
  const [userList, setUserList] = useState([]);
  const [room , setRoom] = useState({});
  const [startTime, setStartTime] = useState();
  const [totalTime, setTotalTime] = useState();
  const [time, setTime] = useState({
    startTime:"",
    endTime:"",
  });

  const [listModalOpen, setListModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { getRoomDate, getRoomList, getUserList } = UserApi;
  const [isActive, setIsActive] = useState(false);

  const dropDown = useRef([]);
  const partyIconBtn = useRef([]);

  const getDetailModalOpen = (status) => {
    setDetailModalOpen(status);
  };

  const handleCloseList = (event) => {
    if (event.target.nodeName !== "BUTTON") {
      for (let i = 0; i < partyIconBtn.current.length; i++) {
        dropDown.current[i].style.visibility = "hidden";
      }
    }
  };

  useEffect(async () => {
    setCalendar(buildCalendar(value));
    setStartMonth(value.clone().startOf("month").subtract(1, "day"));
    setEndMonth(value.clone().endOf("month"));

    const result = await getRoomDate(value.format("M")*1);

    //받아온 party data state에 저장
    handleParyDataList(result.data.conferencesDateList);
  }, [value]);

  useEffect(async () => {
    if(item.day!="") {
      const result = await getRoomList(item.day);
      let roomList = [];
      roomList = result.data.roomList; 
      setRoomList({roomList});
    }
  }, [item.day])


  const handleParyDataList = (result) => {
    const arr = [];
    for (let i = 0; i < result.length; i++) {
      let data = result[i].date;
      let year = data.year;
      let month = data.month;
      let day = data.day;
      let date = year + "-" + month + "-" + day;
      date = new Date(date);
      let res = moment(date).format("YYYY-MM-DD");
      arr.push(res);
    }

    //중복제거
    let conferences = [];
    arr.forEach((element) => {
      if (!conferences.includes(element)) {
        conferences.push(element);
      }
    });

    setParty({
      conferences,
    });
  };

  useEffect(() => {
    // console.log(item);
  }, [item]);

  useEffect(() => {
    // console.log(party)
  }, [party]);

  useEffect(() => {
    // console.log(roomList);
    makeList();
  }, [roomList]);

  useEffect(() => {
    console.log(room);
    setTime({
      startTime : room.startTime,
      endTime : room.endTime
    });
  }, [room])

  useEffect(() => {
  },[time])


  useEffect(() => {}, [detailModalOpen]);

  useEffect(() => {
    document.addEventListener("click", handleCloseList);

    return () => {
      document.removeEventListener("click", handleCloseList);
    };
  });

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

  const handleClick = async (event) => {
    setUnvisible(event);
    const data = event.nativeEvent.path[2].outerText;
    const dataArr = data.split("\n");
    setItem({
      month: value.format("M"),
      day: dataArr[0],
    });
    //해당 날짜에 진행한 파티목록 가져오는 api호출
    // const result = await getRoomList(item.day);
    // console.log(result);
  };

  function showList(target) {
    if (target.visibility === "visible") {
      target.visibility = "hidden";
      target.opacity = "0";
      target.transform = "translateY(0)";
    } else {
      target.visibility = "visible";
      target.opacity = "1";
      target.transform = "translateY(-20px)";
    }
  }

  function setUnvisible(event) {
    for (let i = 0; i < dropDown.current.length; i++) {
      dropDown.current[i].style.visibility = "hidden";
    }
    showList(event.target.nextElementSibling.style);
  }

  const calcYoil = (day) => {
    let yoil = dayStyles(day);
    let date = day.format("D").toString();
    return <div className={styles[yoil]}>{date}</div>;
  };

  //roomseq로 참석한 모든 인원 데이터 받아오기
  const getRoomDetail = async (roomSeq) => {
    setRoomSeq(roomSeq);
    const { data } = await getUserList(roomSeq);
    let userList = data.userList;
    setUserList({ userList });
    setRoom(data.room);

    openDetailModal();
  };

  //make dropdown
  const makeList = () => {
    const dataList = [];

    for (let i = 0; i < roomList.roomList.length; i++) {
      dataList.push(roomList.roomList[i]);
    }
    // const roomListData = dataList.map((data, index) => (<li key={index}><button className={styles.partyData}>{data.title}</button></li>))
    const roomListData = dataList.map((data, index) => (
      <li key={index}>
        <button
          className={styles.partyData}
          onClick={() => getRoomDetail(data.roomSeq)}
        >
          {data.title}
        </button>
      </li>
    ));
    return <>{roomListData}</>;
  };

  const listStyle = { visibility: "visible" };

  const checkParty = (day) => {
    for (let i = 0; i < party.conferences.length; i++) {
      if (day.format("YYYY-MM-DD") === party.conferences[i]) {
        return (
          <>
            <div className={styles.container}>
              <button
                className={styles.partyicon}
                onClick={handleClick}
                ref={(el) => (partyIconBtn.current[i] = el)}
              ></button>
              <div
                className={
                  isActive
                    ? `${styles.partyList} ${styles.open}`
                    : styles.partyList
                }
                style={listStyle}
                ref={(el) => (dropDown.current[i] = el)}
              >
                <p className={styles.listTitle}>파티 목록</p>
                <ul>{makeList()}</ul>
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

  const openDetailModal = () => {
    setDetailModalOpen(true);
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
            time={time}
            userList={userList.userList}
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
