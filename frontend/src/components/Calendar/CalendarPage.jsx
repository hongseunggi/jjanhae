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
  //selected date
  const [value, setValue] = useState(moment());
  
  useEffect(() => {
    setCalendar(buildCalendar(value))
  }, [value])


  function isSelected(day) {
    return value.isSame(day, "day")
  }

  function beforeToday(day) {
    return day.isBefore(new Date(), "day");
  }

  function isToday(day) {
    return day.isSame(new Date(), "day");
  }

  function dayStyles(day) {
    if (beforeToday(day)) return "before";
    if (isSelected(day)) return "selected";
    if (isToday(day)) return "today";
    return "";
  }


const currentMonth = () => {
  return value.format("MMM");
}

const onClick = (day) => {
  // console.log(day);
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
              {calendar.map((week) => (
                  <div className={styles.week}>
                    {
                      week.map((day) => (
                        <div className={styles.day}
                          // onClick={onClick(day)}
                        >
                          <div className={dayStyles(day, "day") ? "selected" : ""}>
                            {day.format("D").toString()}
                          </div>
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
