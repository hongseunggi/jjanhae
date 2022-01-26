import React, { useState, useEffect } from "react";
import styles from "./CalendarPage.module.css";
import axios from "axios";
import moment, { calendarFormat } from "moment";
import buildCalendar from "./buildCalendar";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
// import Modal from 'react-modal'

const CalendarPage = () => {
  
  //calendar
  const [calendar, setCalendar] = useState([]);
  //today
  const [value, setValue] = useState(moment());
  //set cliked date
  const [item, setItem] = useState({
    month : "",
    day : "",
  });
  //startDate
  const [startMonth, setStartMonth] = useState(moment());
  //endDate
  const [endMonth, setEndMonth] = useState(moment());
  //conference list
  const [conferences, setConferences] = useState({

  });
  
  useEffect(() => {
    setCalendar(buildCalendar(value))
    setStartMonth(value.clone().startOf("month").subtract(1,"day"))
    setEndMonth(value.clone().endOf("month"))
  }, [value])

  useEffect(() => {
    console.log(item);
  }, [item])

 
  function isSunday(day) {
    if(day.day()===0) return true;
  }

  function isSaturday(day) {
    if(day.day()===0) return true;
  }

  function isToday(day) {
    return day.isSame(new Date(), "day");
  }

  function dayStyles(day) {
    let yoil = day.day();
    console.log(day.isAfter(startMonth));
    if(day.isAfter(startMonth)&&day.isBefore(endMonth)) {
      if (yoil===0) return "sunday";
      if (yoil===6) return "saturday";
      if (yoil>0&&yoil)return "weekday";
    }else {
      return "none"
    }
  }

  const currentMonth = () => {
    return value.format("M")+"월";
  }

const handleClick = (event) => {
  setItem({
    month : value.format("M"),
    day : event.target.innerText 
  });

}

const calcYoil = (day) => {
  let yoil = dayStyles(day);
  let date = day.format("D").toString();
  return (<div className={styles[yoil]}>{date}</div>);
}

    return (
        <>
          <div className={styles.calendarForm}>
            <div className={styles.calendarHeader}>
              <div className={styles.calendarTitle}>술자리 기록</div>
              <div className={styles.calendarTop}>
                <div className={styles.month}>{currentMonth()}</div>
                <CalendarIcon className={styles.icon} />
              </div>
            </div>
            <div className={styles.calendarBody}>
              {calendar.map((week, key) => (
                  <div className={styles.week}>
                    {
                      week.map((day) => (
                        <div className={styles.day}
                          onClick={handleClick}
                        >
                          {calcYoil(day)}
                        </div>
                    ))}
                  </div>
                ))
              }
            </div>
          </div>
        </>
    );
    
}

export default CalendarPage;
