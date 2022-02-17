import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as NameIcon } from "../../assets/icons/name.svg";
import styles from "./FindId.module.css";

const ShowId = ({ id, name }) => {
  const maskingId = (str) => {
    let originStr = str;
    let maskingStr;
    let strLength;

    strLength = originStr.length;
    if (strLength < 3) {
      maskingStr = originStr.replace(/(?<=.{1})./gi, "*");
    } else {
      maskingStr = originStr.replace(/(?<=.{2})./gi, "*");
    }
    return maskingStr;
  };

  const securityId = maskingId(id);

  return (
    <>
      <div className={styles.resultTitle}>
        <div className={styles.content}>
          {name}님이 입력하신 정보와 일치하는 계정입니다.
        </div>
        <span className={styles.info}>
          개인정보 보호를 위해 계정의 일부를 * 처리 하였습니다.
        </span>
      </div>
      <div className={styles.resultId}>
        <NameIcon fill="#EEE" width="20" height="20" />
        <span className={styles.idInfo}>아이디: {securityId}</span>
        {/* <span className={styles.idInfo}>아이디: {id}</span> */}
      </div>

      <div className={styles.confirmButtons}>
        <Link to="/user/login">
          <button className={styles.loginBtn}>로그인</button>
        </Link>

        <Link to="/user/findPwd">
          <button className={styles.findPwdBtn}>비밀번호 찾기</button>
        </Link>
      </div>
    </>
  );
};

export default ShowId;
