import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "../Regist/RegisterTemplate.module.css";
import { Link, useNavigate } from "react-router-dom";

const FindAccountResult = ({ id, progress = 100 }) => {
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

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/user/login");
  };

  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      handleClick(e);
    }
  };
  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <div className={styles.contents}>
          <div className={styles.progressBar}>
            <ProgressBar
              completed={progress}
              customLabel=" "
              width={"20%"}
              height={"5px"}
              bgColor="#ff2e63"
              baseBgColor="#51f0ed1a"
            />
          </div>
          <h2 className={styles.info}>
            입력한 정보와 일치하는 <br />
            짠해 계정을 확인해주세요.
          </h2>

          <form
            className={styles.form}
            onKeyPress={onCheckEnter}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={styles.inputArea}>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label htmlFor="id">아이디</label>
                  <input
                    className={styles.inputData}
                    id="id"
                    value={securityId}
                    type="text"
                    autoComplete="off"
                    disabled
                  />
                </div>
              </div>
            </div>
            <ul className={styles.alertMsg}>
              <li>개인정보 보호를 위해 정보 일부를 *로 표시하였습니다.</li>
              <li>표시된 아이디로 짠해에 로그인 할 수 있습니다.</li>
            </ul>
            <div className={styles.btnRow}>
              <Link to="/user/findPwd">
                <button className={styles.findPwdBtn}>비밀번호 찾기</button>
              </Link>
            </div>
            <div className={styles.nextBtns}>
              <button
                className={styles.nextBtn}
                type="button"
                onClick={handleClick}
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </article>
    </main>
  );
};

export default FindAccountResult;
