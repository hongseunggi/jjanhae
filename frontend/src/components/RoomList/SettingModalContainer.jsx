import React, { useState, useEffect } from "react";
import IntoRoom from "../Modals/RoomEnter/IntoRoom";
import style from "./RoomList.module.css";
import { ReactComponent as Clock } from "../../assets/icons/clock.svg";
import { ReactComponent as Lock } from "../../assets/icons/lock.svg";
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import IconButton from "@material-ui/core/IconButton";

function SettingModalContainer(props) {
  const { info } = props;
  // console.log(info);
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    let hour = "";
    let minute = "";
    if (info.startTime.time.hour <= 9) {
      hour += "0" + info.startTime.time.hour;
    } else hour = info.startTime.time.hour;

    if (info.startTime.time.minute <= 9) {
      minute += "0" + info.startTime.time.minute;
    } else minute = info.startTime.time.minute;

    setTime(hour + ":" + minute);
  });

  const handleIsOpen = (e) => {
    setIsOpen(!isOpen);
  };
  const renderDrinkLevel = (value) => {
    // console.log("정상 빌드 배포 완료");
    switch (value) {
      case 1:
        return <div className={style.roomlabel}>알쓰방</div>;
      case 2:
        return <div className={style.roomlabel}>주당방</div>;
      case 3:
        return <div className={style.roomlabel}>술고래방</div>;
      default:
        return null;
    }
  };

  const renderJoinUser = (value) => {
    if (value >= 8) {
      return <h3 className={style.fulluser}>8/8</h3>;
    }
    return <h3 className={style.joinuser}>{value}/8</h3>;
  };

  const renderLock = (value) => {
    if (value === 0) {
      return (
        <LockOutlinedIcon className={style.lock}
          filter="invert(34%) sepia(54%) saturate(4911%) hue-rotate(327deg) brightness(100%) contrast(103%)"
          fontSize="large"
        ></LockOutlinedIcon>

      );
    }
    return (
        <LockOpenOutlinedIcon className={style.lock}
          filter="invert(82%) sepia(33%) saturate(6059%) hue-rotate(128deg) brightness(98%) contrast(94%)"
          fontSize="large"
        ></LockOpenOutlinedIcon>
    );
  };

  return (
    <div>
      <div className={style.room} onClick={handleIsOpen}>
        <div
          className={style.roomthumb}
          style={{
            backgroundImage: `url(${info.thumbnail})`,
            backgroundSize: "cover",
          }}
        >
          {renderDrinkLevel(info.drinkLimit)}
        </div>
        <div className={style.about}>
          <h3>{info.title}</h3>
          {renderLock(info.type)}
          <br></br>
          <br></br>
          <br></br>
          <h5>{info.description}</h5>
        </div>
        <div className={style.footer}>
          <Clock
            fill="#EEE"
            width="20"
            height="20"
            filter="invert(100%) sepia(8%) saturate(101%) hue-rotate(221deg) brightness(113%) contrast(87%)"
            className={style.clock}
          />
          <h5>{time}~</h5>
          {renderJoinUser(info.joinUserNum)}
        </div>
      </div>

      {isOpen ? <IntoRoom onClose={handleIsOpen} room={info}></IntoRoom> : null}
    </div>
  );
}
export default SettingModalContainer;
